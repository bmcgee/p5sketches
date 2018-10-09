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

let visualizers = [];

//gui globals
var bgcolor = [0, 0, 0];
var drywet_fade = 0;

//gui
let visible = true;
let gui;

let analyzeType = 'xx';

//var capturer = new CCapture( { format: 'png' } );
var capturer = new CCapture( {
        format: 'webm',
        framerate: 30,
        verbose: true,
        //display:true,

} );


function preload() {
        audio = loadSound('assets/02 - Breathe (In the Air).mp3')
}

function setup() {
        createCanvas(windowWidth, windowHeight);
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

        temp = new AmpVis(new Vis({
                audioObj: filter
        }));
        visualizers.push(temp); //new amplitude visualizer

        //create layout gui
        gui = createGui('audio');

        gui.addGlobals('drywet_fade');
        sliderRange(0, 10, 1);



}

function draw() {
        background(0, 0, 0, 255);

        filterFreq = map(mouseX, 0, width, 10, 22050);
        filterWidth = map(mouseY, 0, height, 0, 90);
        filter.set(filterFreq, filterWidth);
        filter.drywet(drywet_fade);

        visualizer.draw();

        //draw visualizations
        visualizers.forEach(vis => {
                vis.update();
                vis.draw();
        });

        //capturer.capture(c);
        capturer.capture( canvas );


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
                case 'n':
                        capturer.start();
                        break;
                case 'm':
                        capturer.stop();
                        capturer.save();

        }

}

function mouseClicked() {
        visualizers.push(new fftLocationVis(new Vis({audioObj: filter})));

}
