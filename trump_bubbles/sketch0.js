var sketch = function(p) {

  let bubbles = [];
  let radScale = 90;


  //setup
  p.setup = function() {
    p.frameRate(30);
    let canvas = p.createCanvas(500, 500);


    //create bubbles to bubble array
    //get photos and size from json or dict

    let numBubbles = 3;
    for (let i = 0; i < numBubbles; i++) {
      bubbles[i] = new Bubble(3, p.random(0, p.width), p.random(0, p.height));
    };

   // bubbles[0] = new Bubble(2, 250, 250);

  };



  p.draw = function() {
    p.background(0);
    p.fill(255);
    p.text(p.frameCount, 30, 30);

    for (let b of bubbles) {
      let wind = p.createVector(p.noise(b.pos.x), p.noise(b.pos.y));
      let gravity = p.createVector(0, 1);


      let overlapping = false;
      for (let other of bubbles) {
	      if (b !== other && b.intersects(other)) {
		      overlapping = true;
	      }
      }
      if (overlapping) {
	      b.red = 255;
      } else {
	      b.red = 0;
      }
      b.update();
      b.draw();
      b.checkEdges();
    }

  };

  class Bubble {
    constructor(m, x, y) {
      this.mass = m;
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
      this.acc = p.createVector(0, 0);
      this.rad = radScale;
      this.cr = 1;
      this.red = 0;
    }

    applyForce(force) {
      let f = p5.Vector.mult(force, this.mass);
      this.acc.add(f);
    }

    intersects(b) {

 	let d = p.dist(this.pos.x, this.pos.y, b.pos.x, b.pos.y);
	return (d < (this.rad + b.rad)/2);

	//if (dist <= (this.rad + b.rad)) {
        //this.red = 255;
	//
	// let v1, v2;
	// let sumMass = this.mass + b.mass;
	//
	// v1 = (this.vel * (this.mass - b.mass) + (2 * (b.mass * b.vel))) / sumMass;
	// v2 = (b.vel * (b.mass - this.mass) + (2 * (this.mass * this.vel))) / sumMass;

	//this.vel.add(v1);



    }

    update() {
      //update
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);

      //if bubble certain size or smaller –– destroy!
    }

    draw() {
      //draw from image
      p.strokeWeight(0);
      p.fill(this.red, this.mass * 10, 130);
      p.ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
    }

    checkEdges() {
      if (this.pos.x > p.width) {
        this.pos.x = p.width;
        this.vel.x *= -1;
      } else if (this.pos.x < 0) {
        this.vel.x *= -1;
        this.pos.x = 0;
      }
      if (this.pos.y > p.height) {
        this.vel.y *= -1;
        this.pos.y = p.height;
      } else if (this.pos.y < 0) {
        this.vel.y *= -1;
        this.pos.y = 0;
      }
    }

  }



};

var myp5 = new p5(sketch);
