//audio globals
let audio, master;
let filter, filterFreq, filterRes;

//let fftbands = 1024;
let fftsmooth = .7;

//misc globals
let logView = false;
let spectView = true;
var fftbands = 256;
var oct_bands = 4;
var oct_center = 15.625;

let c;
let energyVisArray = [];
let selectableVisArray = [];
let ampVisArray = [];

//gui globals
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
        c = createCanvas(windowWidth, windowHeight);
        frameRate(30);

        //play unfiltered
        //audio.connect(originalAudio);
        //originalAudio.play();
        master = new p5.Effect();

        audio.play();
        audio.connect(master);
        master.connect();

        //filter audio
        filter = new p5.BandPass();
        audio.connect(filter);
        filter.disconnect();
        audio.setVolume(.2);

        //audio.connect();
        //audio.play();

        visualizer = new FftVis(); //display visualizer
        visualizer.setup(filter);

	temp = new AmpVis({audioObj: filter});
        ampVisArray.push( temp ); //new amplitude visualizer

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
}

function draw() {
        background(0, 0, 0, 255);

        filterFreq = map(mouseX, 0, c.width, 10, 22050);
        filterWidth = map(mouseY, 0, c.height, 0, 90);
        filter.set(filterFreq, filterWidth);
        filter.drywet(drywet_fade);

        visualizer.draw();

	//draw visualizations
	ampVisArray.forEach(ampVis => {
		ampVis.update();
		ampVis.draw();
	});

	selectableVisArray.forEach(vis => {
		vis.update();
                vis.drawSelector();
		vis.drawViz();
        });


        energyVisArray.forEach(shape => {
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
        energyVisArray.push(new EnergyVis(mouseX, mouseY, filter, 1));

}

// function AmpVis(x, y, obj, smoothRate) {
// 	this.x = x; this.y = y;
// 	this.amp = 500;
// 	this.smoothRate = smoothRate;
// 	this.levelSmooth = 0;
// 	//let this.freqValues[10] = 0;
// 	console.log(this.levelSmooth);
//
// 	this.ampObj = new p5.Amplitude(.001);
// 	this.ampObj.setInput(obj);
//
//
//
//         this.draw = function() {
//                 this.level = this.ampObj.getLevel();
// 		//a(i+1) = tiny*data(i+1) + (1.0-tiny)*a(i)
//
// 		this.levelSmooth *= .9;
// 		if (this.levelSmooth < this.level) {
// 			this.levelSmooth = (((this.level - this.levelSmooth) * .2) + this.levelSmooth);
// 		};
//
//
//                 this.size = map(this.levelSmooth, 0, 1, 0, this.amp);
//                 strokeWeight(2);
//                 stroke(255);
//                 noFill();
//                 ellipse(c.width / 2, c.height / 2, this.size, this.size);
//         }
// }

function EnergyVis(x, y, src) {
        this.x = x;
        this.y = y;
        this.fft = new p5.FFT();
        this.fft.setInput(src);

        this.draw = function() {
                this.fft.mode = 'xx'
                this.fft.analyze();
                this.freq = map(this.x, 0, c.width, 10, 22050);
                this.avg = map(mouseY, 0, c.height, 0, 500);
                this.amp = this.fft.getEnergy(this.freq - this.avg, this.freq + this.avg);

		//this.amp = buffSmooth(this.amp);

                colorMode(RGB);
                strokeWeight(2);
                stroke(0, 150, 255);
                ellipse(xSnap(this.x), ySnap(this.y), map(this.amp, 0, 255, 0, 200));

                // filterFreq = map(mouseX, 0, c.width, 10, 22050);
                // filterWidth = map(mouseY, 0, c.height, 0, 90);
        }
}

function selectableVis(ampMult, src, smooth, x, y, color) {
        //this.loFreq = freqLo;
        //this.hiFreq = freqHi;
        this.ampMult = ampMult;

        this.x = x;
        this.y = y;
        this.color = color;

        this.fft = new p5.FFT(smooth);
        this.fft.setInput(src);

        let randomPos = random(0, 100);
	div = createDiv('Name' + this);
	createElement('t', 'Low:').parent(div);
        loSlider = createSlider(0, 100, randomPos).parent(div);
	createElement('t', 'Hi:').parent(div);
        hiSlider = createSlider(0, 100, randomPos + 10).parent(div);




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
