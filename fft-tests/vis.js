class Vis {
	constructor({
		audioObj,
		xy = [width/2, height/2],
		ampMult = 100,
		smooth = .8,
		rgb = [255,255,255],
	}) {
		if (audioObj == undefined) {
			throw new Error("missing audioObj");
		}
		this.audioObj = audioObj;  			//audiobject for input
		this.xy = xy;
		this.pos = createVector(xy[0],xy[1]);
		this.ampMult = ampMult;
		this.smoothIn = smooth;
		this.smoothOut = smooth;
		this.col = color(rgb[0],rgb[1],rgb[2]);
		this.size = 100;

		// this.ampMult = ampMult || 100; 		//amp multiplier - used to dynamically scale and for effectors
		// this.smooth = smooth || .85;  		//smooths incoming and outgoing values
		// this.col = col || color(random(0, 255), random(0, 255), random(0, 255)); //color the visualization
		this.val = 0;  			//initival values
		this.valSmoothed = 0;
	}
}

class AmpVis {
	constructor(viz) {
		this.viz = viz;
		//switch out for global p5.amp object if necessary
		this.ampObj = new p5.Amplitude(.2);	//new amp p5 WITH SMOOTH AT 0
		this.ampObj.setInput(this.viz.audioObj);	//bind object
		this.viz.smoothOut = .25;
	}

	update() {
		this.viz.val = this.ampObj.getLevel();
		smoothVal(this.viz);
	}
	draw() {
		strokeWeight(2);
		stroke(this.viz.col);
		noFill();
		let radius = map(this.viz.valSmoothed, 0, 1, 0, this.viz.size) * this.viz.ampMult;
		ellipse(this.viz.pos.x, this.viz.pos.y, radius, radius);
	//	console.log("drawing");
	}
}

class fftLocationVis {
	constructor(viz) {
		this.viz = viz;
		//switch out for global fft object if necessary
		this.fft = new p5.FFT();	//new amp p5 WITH SMOOTH AT 0
		this.fft.setInput(this.viz.audioObj);	//bind object
		this.viz.smoothOut = .9;
		this.col = color(120, 30, 30);
		this.pos = createVector(mouseX, mouseY);
		this.viz.size = 400;
		this.viz.ampMult = 1;
	}
	update() {
		this.fft.analyze();
		this.freq = map(this.pos.x, 0, width, 10, 22050);
		this.avg = map(this.pos.y, 0, height, 0, 1000);
		this.viz.val = this.fft.getEnergy(this.freq - this.avg, this.freq + this.avg);
		smoothVal(this.viz);
	}
	draw() {
		colorMode(RGB);
		strokeWeight(3);
		stroke(this.col);
	//	console.log(this.viz.val)
		ellipse(xSnap(this.pos.x), ySnap(this.pos.y), map(this.viz.valSmoothed, 0, 255, 0, (this.viz.size * this.viz.ampMult)));
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
                line(x_lo, height, x_lo, height - 100);
                line(x_hi, height, x_hi, height - 100);


        }
        this.drawViz = function() {
                colorMode(RGB);
                strokeWeight(2);
                stroke(this.color);
                ellipse(this.x, this.y, (this.energy * this.ampMult));
        }
}
