class Vis {
	constructor({
		audioObj,
		xy = [width/2, height/2],
		ampMult = 100,
		smooth = .99,
		rgb = [255,255,255],
	}) {
		if (audioObj == undefined) {
			throw new Error("missing audioObj");
		}
		this.audioObj = audioObj;  			//audiobject for input
		this.xy = xy;
		this.pos = createVector(xy[0],xy[1]);
		this.ampMult = ampMult;
		this.smooth = smooth;
		this.col = color(rgb[0],rgb[1],rgb[2]);
		this.size = 100;

		// this.ampMult = ampMult || 100; 		//amp multiplier - used to dynamically scale and for effectors
		// this.smooth = smooth || .85;  		//smooths incoming and outgoing values
		// this.col = col || color(random(0, 255), random(0, 255), random(0, 255)); //color the visualization
		this.value = 0;  			//initival values
		this.valSmoothed = 0;
	}
}	

class AmpVis {
	constructor(obj) {
		this.ampObj = new p5.Amplitude(0);	//new amp p5 WITH SMOOTH AT 0
		this.ampObj.setInput(this.audioObj);	//bind object
	}

	update() {
		this.val = this.ampObj.getLevel();
		smoothVal(this);
		console.log("Val: ", this.val, "   Smothed: ", this.valSmoothed);
	}
	draw() {
		strokeWeight(2);
		stroke(this.col);
		noFill();
		let radius = map(this.valSmoothed, 0, 1, 0, this.size) * this.ampMult;
		ellipse(this.pos.x, this.pos.y, radius, radius);
	//	console.log("drawing");
	}
}
