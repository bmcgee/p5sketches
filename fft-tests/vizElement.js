class VizElement {
	constructor(x = 0, y = 0, audioObj, ampMult = 1, smoothIn = 0, smoothOut = 0) {
		console.log("X" + x);
		this.x = x;
		this.y = y;
		this.ampMult = ampMult;
		this.audioObj = audioObj;
		this.smoothIn = smoothIn;
		this.smoothOut = smoothOut;
		this.val = 0;
		this.valSmoothed = 0;
		this.col = color(random(0, 255), random(0, 255), random(0, 255));
	}
	smoothVal() {
		this.valSmoothed *= this.smoothOut;
		if (this.valSmoothed < this.val) {
			this.valSmoothed = (((this.val - this.valSmoothed) * .2) + this.val);
		};
		return this.valSmoothed;
	}
}

class AmpVis extends VizElement {
	// constructor() {
	// 	super();
	// 
	// }

			//super(x, y, ampMult, audioObj, val, valSmoothed, col)
	this.amp = 100;

	this.ampObj = new p5.Amplitude(0); //new amp p5 WITH SMOOTH AT 0
	this.ampObj.setInput(this.audioObj);
	update() {
		this.val = this.ampObj.getLevel();
		this.rad = map(this.smoothVal(), 0, 1, 0, this.amp);
	}
	draw() {
		strokeWeight(2);
		stroke(255);
		noFill();
		ellipse(this.x, this.y, this.rad, this.rad);
	}
}
