var sketch = function(p) {

        let bubbles = [];
        let radScaler = 10;


        //setup
        p.setup = function() {
                p.frameRate(30);
                let canvas = p.createCanvas(1000, 1000);


                //create bubbles to bubble array
                        //get photos and size from json or dict
                let numBubbles = 30;
                for(let i=0; i < numBubbles; i++) {
                        bubbles[i] = new Bubble(p.random(0.5, 3), p.random(0, p.width), p.random(0, p.height));
                };
        };



        p.draw = function() {
                p.background(0);
                p.fill(255);
                p.text(p.frameCount, 30,30);
                //console.log("Frame: ", p.frameCount);
                //increase radius on click
                        //increase hero bubble

                //check collisions

                //update bubble

                //draw bubble

                for(let i = 0; i < bubbles.length; i++) {
                        let wind = p.createVector(p.noise(bubbles[i].pos.x), p.noise(bubbles[i].pos.y));
                        let gravity = p.createVector(0, 1);

                        //console.log("Gravity", gravity);

                        //bubbles[i].applyForce(wind);
                        bubbles[i].applyForce(gravity);

                        bubbles[i].update();

                        for (j = i + 1; j < bubbles.length; j++) {
                             bubbles[j].checkCollision(bubbles[i]);
                        }

                        bubbles[i].draw();

                        bubbles[i].checkEdges();

                }

        };

        p.mousePressed = function() {
                console.log("rad: ", bubbles[4].rad);
                bubbles[4].rad = bubbles[4].rad + 10;
                console.log("click");
                console.log("rad: ", bubbles[4].rad);

        }

        class Bubble {
                constructor(m,x,y) {
                        this.mass = m;
                        this.pos = p.createVector(x,y);
                        this.vel = p.createVector(0,0);
                        this.acc = p.createVector(0,0);
                        this.rad = this.mass * 10;
                        this.cr = 1;
                }

                applyForce(force) {
                        let f = p5.Vector.mult(force, this.mass);
                        this.acc.add(f);
                }

                checkCollision(b) {

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
                        p.fill(255, this.mass * 10, 130);
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
