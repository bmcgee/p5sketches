//audio globals
let audio, master;
let filter, filterFreq, filterRes;

let temp;

//let fftbands = 1024;
let fftsmooth = .7;
let ampsmooth = .8;

//misc globals
let logView = false;
let spectView = false;
var fftbands = 128;
var oct_bands = 3;
var oct_center = 15.625;

let c;
let energyShapes = [];

//gui globals
var ringColor = [0, 255, 0];
var bgcolor = [0, 0, 0];
var drywet_fade = 0;

//gui
let visible = true;
let gui;

var capturer = new CCapture( { format: 'png' } );

function preload() {

        //load audio
        audio = loadSound('assets/02 - In Cold Blood [Explicit].mp3')

        //audio.start();
}

function setup() {
        c = createCanvas(1920, 1080);
        frameRate(30);

        //play unfiltered
        //audio.connect(originalAudio);
        //originalAudio.play();
        master = new p5.Effect();

        audio.play();
        //audio.disconnect();
        audio.connect(master);
        master.connect();

        //filter audio
        filter = new p5.BandPass();
        audio.connect(filter);
        filter.disconnect();

        //audio.connect();
        //audio.play();

        //display visualizer
        visualizer = new FftVis();
        visualizer.setup(filter);

        ampV = new AmpVis();
        ampV.setup(filter);

        //create layout gui
        gui = createGui('audio');

        gui.addGlobals('ringColor', 'bgcolor');
        sliderRange(0, 1, 0.1);
        gui.addGlobals('drywet_fade');
        sliderRange(0, 10, 1);
        gui.addGlobals('oct_bands');
        sliderRange(0, 100, .001);
        gui.addGlobals('oct_center');
        //sliderRange(0, 255, 1);
        //gui.addGlobals('fftbands');

        temp = new EnergyVis(random(0, c.width), random(0, c.height), filter, .2);
}

function draw() {
        background(0, 0, 0, 30);

        filterFreq = map(mouseX, 0, c.width, 10, 22050);
        filterWidth = map(mouseY, 0, c.height, 0, 90);
        filter.set(filterFreq, filterWidth);
        filter.drywet(drywet_fade);

        visualizer.draw();
        ampV.draw();

        temp.draw();

        energyShapes.forEach(shape => { shape.draw() });

        //capturer.capture(c);


}

function keyPressed() {
        switch (key) {
                case 's':
                        if (audio.isPlaying()) {
                                audio.pause();
                                //filter.stop();
                        } else {
                                audio.play();
                                //filter.play();
                        }
                case 'q':
                        filter.toggle();
                case 'l':
                        logView = !logView;
                case 'k':
                        spectView = !spectView;
                case 'c':
                        capturer.start();
                        console.log('capture start');


        }

}

function mouseClicked() {
        energyShapes.push( new EnergyVis(mouseX, mouseY, filter, .8));
        console.log("mouse clicked");
}

function AmpVis() {
        this.setup = function(obj) {
                this.amp = new p5.Amplitude(ampsmooth);
                this.amp.setInput(obj);
        }
        this.draw = function() {
                this.level = this.amp.getLevel();
                this.size = map(this.level, 0, 1, 0, 1000);
                strokeWeight(2);
                stroke(ringColor);
                noFill();
                ellipse(c.width / 2, c.height / 2, this.size, this.size);
        }
}

function EnergyVis(x, y, src, smooth) {
        this.x = x;
        this.y = y;
        this.fft = new p5.FFT(smooth);
        this.fft.setInput(src);

        this.draw = function() {
                this.fft.analyze();
                this.freq = map(this.x, 0, c.width, 10, 22050);
                this.avg = map(mouseY, 0, c.height, 0, 500);
                this.freqValue = this.fft.getEnergy(this.freq - this.avg, this.freq + this.avg);

                colorMode(RGB);
                strokeWeight(2);
                stroke(0, 150, 255);
                ellipse(xSnap(this.x) ,ySnap(this.y), map(this.freqValue, 0, 255, 0, 200));

                // filterFreq = map(mouseX, 0, c.width, 10, 22050);
                // filterWidth = map(mouseY, 0, c.height, 0, 90);
        }
}

// helper functions via
// https://github.com/borismus/spectrograph/blob/master/g-spectrograph.js
// MIT license

/**
 * Given an index and the total number of entries, return the
 * log-scaled value.
 */
function logScale(index, total, opt_base) {
        var base = opt_base || 2;
        var logmax = logBase(total + 1, base);
        var exp = logmax * index / total;
        return Math.round(Math.pow(base, exp) - 1);
}

function logBase(val, base) {
        return Math.log(val) / Math.log(base);
}

function xScale(x, min, max) {
        let t = min * (max / min);
        x = math.pow(t, x);
}

function db(x) {
        if (x == 0) {
                return 0;
        } else {
                return 10 * Math.log10(x);
        }
}

function xSnap(x) {
        h = 96;
        x = x/h;
        x = Math.round(x);
        x = x * h;
        return x;
}
function ySnap(y) {
        w = 54;
        y = y/h;
        y = Math.round(y);
        y = y * h;
        return y;
}
