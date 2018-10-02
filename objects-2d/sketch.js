//globals
let shapes = [];
let world;
let boundaries = [];
let boxes = [];


function setup() {
  	let c = createCanvas(300, 300);
	//c.mouseClicked(createShape);

	world = createWorld();

	boundaries.push(new Boundary(width / 4, height - 5, width / 2 - 50, 10));
	boundaries.push(new Boundary(3 * width / 4, height - 50, width / 2 - 50, 10));

	shapes.push( new Box() );


}

function draw() {
	background(45,40,40);

	let timeStep = 1.0 / 30;
	world.Step(timeStep, 10, 10 );

	//display boundaries
	boundaries.forEach( boundary => boundary.display() );

	color(150);
	noStroke();
	shapes.forEach( shape => shape.display() );

}

//user interaction
function keyTyped() {
	//console.log('keyPressed');
	if (key == 'e') {
		shapes.push(new Circle());
		console.log(key);
	}
	if (key == 'r' ) {
		shapes.push(new Box());
		console.log(key);
	}
}


//define shapes
function Shape() {

	//fixture holds shape

	//fd.shape.SetAsBox(scaleToWorld());  //FIX FOR Box OR CIRCLE!!

	//physics
	// fd.density = 1.0;
	// fd.friction = 0.5;
	// fd.restitution = 0.2;
	//
	// this.body = world.CreateBody(bd);
	// this.body.CreateFixture(fd);
	//
	// this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
	// this.body.SetAngularVelocity(random(-5, 5));

}

function Circle() {
	//Shape.call(this);

	fd.shape = new box2d.b2CircleShape();
	fd.shape.m_radius = scaleToWorld(this.rad);

	this.display = function () {
		ellipse(this.pos.x, this.pos.y, this.rad) ;
	}
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;


function Box() {
	//	Shape.call(this);

	this.pos = createVector(random(0, width), random(0, height));
	this.rad = random(10, 30);

	//define body
	let bd = new box2d.b2BodyDef();
	bd.type = box2d.b2BodyType.b2_dynamicBody;
	bd.position = scaleToWorld(this.pos.x,this.pos.y);

	//define fixture
	let fd = new box2d.b2FixtureDef();
	console.log(fd);


	fd.shape = new box2d.b2PolygonShape();
	fd.shape.SetAsBox(scaleToWorld(this.w / 2), scaleToWorld(this.h / 2));

	fd.density = 1.0;
	fd.friction = 0.5;
	fd.restitution = 0.2;

	this.body = world.CreateBody(bd);
	this.body.CreateFixture(fd);

	this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
	this.body.SetAngularVelocity(random(-5, 5));

	console.log(this.body.GetPosition());

	this.display = function () {
		//console.log(this.body.GetAngleRadians());



		let posi = scaleToPixels(this.body.GetPosition());
		let a = this.body.GetAngleRadians();

		rectMode(CENTER);
		push();
		translate(posi.x,posi.y);
		rotate(a);
		rect(0, 0, this.rad, this.rad);
		pop();
	}
}

Box.prototype = Object.create(Shape.prototype);
Box.prototype.constructor = Box;




function createShape() {
	shapes.push( new Shape(random(0, width), random(0,height), random(10,50)) );
}
