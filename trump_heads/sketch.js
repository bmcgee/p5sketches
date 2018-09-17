var system;

function setup() {
        var cnv = createCanvas(windowWidth, windowHeight);
        cnv.style('display', 'block');
        background(0,0,0);

        system = new ParticleSystem();
}

function draw() {
        //system.addParticle(createVector(0,0), 10);
        system.run();
}

function windowResized() {
        resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
        system.addParticle(createVector(mouseX, mouseY), random(23,100));
        print("click");
}

//setup particles
var Particle = function(position, radius) {
        this.radius = radius;
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.position = position.copy();
        this.lifespan = 255;
        //ellipse(position.x, position.y, radius);
};

Particle.prototype.run = function() {
        this.update();
        this.display();
};

Particle.prototype.update = function() {

};

Particle.prototype.display = function() {
        fill(124, 23, 434);
        ellipse(this.position.x, this.position.y, this.radius, this.radius);
};

//setup system
var ParticleSystem = function() {
  //this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(position, radius) {
  this.particles.push(new Particle(position,radius));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    // if (p.isDead()) {
    //   this.particles.splice(i, 1);
    // }
  }
};
