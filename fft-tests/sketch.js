//audio globals
let audio, master;
let filter, filterFreq, filterRes;

let temp;

//let fftbands = 1024;
let fftsmooth = .7;
let ampsmooth = .8;

//misc globals
let logView = false;
let spectView = true;
var fftbands = 256;
var oct_bands = 4;
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

let analyzeType = 'xx';

//var capturer = new CCapture( { format: 'png' } );

function preload() {

        //load audio
        audio = loadSound('assets/02 - Breathe (In the Air).mp3')

        //audio.start();
}

function setup() {
        c = createCanvas(960, 540);
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

        // gui.addGlobals('ringColor', 'bgcolor');
        // sliderRange(0, 1, 0.1);
        gui.addGlobals('drywet_fade');
        sliderRange(0, 10, 1);
        // gui.addGlobals('oct_bands');
        // sliderRange(0, 100, .001);
        // gui.addGlobals('oct_center');
        //sliderRange(0, 255, 1);
        //gui.addGlobals('fftbands');

        temp = new EnergyVis(random(0, c.width), random(0, c.height), filter, .2);

        tempSelect = new selectableVis(20, 500, 3, filter, .8, 300, 1, color(180, 100, 30));

}

function draw() {
        background(0, 0, 0, 255);

        filterFreq = map(mouseX, 0, c.width, 10, 22050);
        filterWidth = map(mouseY, 0, c.height, 0, 90);
        filter.set(filterFreq, filterWidth);
        filter.drywet(drywet_fade);

        visualizer.draw();
        ampV.draw();

        temp.draw();

        tempSelect.update();
        tempSelect.drawSelector();
        tempSelect.drawViz();

        energyShapes.forEach(shape => {
                shape.draw()
        });

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
                case 'd':
                        if (analyzeType != 'db') {
                                analyzeType = 'db';
                        } else {
                                analyzeType = 'xx';
                        }
                        console.log(analyzeType);
                        break;

        }

}

function mouseClicked() {
        energyShapes.push(new EnergyVis(mouseX, mouseY, filter, .8));
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
                this.fft.mode = 'xx'
                this.fft.analyze();
                this.freq = map(this.x, 0, c.width, 10, 22050);
                this.avg = map(mouseY, 0, c.height, 0, 500);
                this.freqValue = this.fft.getEnergy(this.freq - this.avg, this.freq + this.avg);

                colorMode(RGB);
                strokeWeight(2);
                stroke(0, 150, 255);
                ellipse(xSnap(this.x), ySnap(this.y), map(this.freqValue, 0, 255, 0, 200));

                // filterFreq = map(mouseX, 0, c.width, 10, 22050);
                // filterWidth = map(mouseY, 0, c.height, 0, 90);
        }
}

function selectableVis(freqLo, freqHi, ampMult, src, smooth, x, y, color) {
        this.loFreq = freqLo;
        this.hiFreq = freqHi;
        this.ampMult = ampMult;

        this.x = x;
        this.y = y;
        this.color = color;

        this.fft = new p5.FFT(smooth);
        this.fft.setInput(src);

        let randomPos = random(0, 100);
        loSlider = createSlider(0, 100, randomPos);
        hiSlider = createSlider(0, 100, randomPos + 10);


        this.update = function() {
                this.fft.analyze();
                this.freq = map()
                this.loFreq = map(loSlider.value(), 0, 100, 10, 22050);
                this.hiFreq = map(hiSlider.value(), 0, 100, 10, 22050);
                this.energy = this.fft.getEnergy(this.loFreq, this.hiFreq);
        }

        this.drawSelector = function() {
                colorMode(RGB);
                strokeWeight(1);
                stroke(this.color);
                x_lo = map(this.loFreq, 10, 22050, 0, width);
                x_hi = map(this.hiFreq, 10, 22050, 0, width);
                line(x_lo, height, x_lo, height-100);
                line(x_hi, height, x_hi, height-100);


        }
        this.drawViz = function() {
                colorMode(RGB);
                strokeWeight(2);
                stroke(this.color);
                ellipse(this.x, this.y, (this.energy*this.ampMult));
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
                x = x / h;
                x = Math.round(x);
                x = x * h;
                return x;
        }

        function ySnap(y) {
                w = 54;
                y = y / h;
                y = Math.round(y);
                y = y * h;
                return y;
        }
