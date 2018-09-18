var slink;

var xScale, yScale;


function preload() {
                trumpImage = loadImage("data/head.png");
                lipsImage = loadImage("data/lips.png");

}

function setup() {
        createCanvas(windowWidth,windowHeight);

        xScale = windowWidth / 1319;
        print(xScale);

        slink = new Slinky();
        slink.setup();
        //background(trumpImage);
        //print(trumpImage.width);

}

function draw() {

        //background(trumpImage);

        //print("x: ", mouseX, " y: ", mouseY);
        xScale = windowWidth;
        imageMode(CORNER);
        image(trumpImage, 0, 0, trumpImage.width * .5, trumpImage.height * .5);

        imageMode(CENTER);
        slink.update();
        slink.draw();

}

function mouseClicked() {
        slink.animate();
}

function touchStarted() {
        //print("touch");
        slink.animate();
        return false;

}

function touchEnded() {
        slink.animate();
        return false;

}

function touchMoved() {
        return false;
}

var Slinky = function() {
        this.radius = 1;
        this.numExtensions = 50;
        this.clicked = false;

        this.pos = createVector(500,530);
        this.endPos = createVector(60,60);
        this.startPos = createVector(193,454);

        this.positions = [];

        this.setup = function() {
                for (var i=0; i<this.numExtensions;i++) {
                        var tempPos = this.startPos;
                        this.positions.push(tempPos);
                }
        }

        this.update = function() {
                var c = .85;
                this.endPos.set(mouseX,mouseY);
                //print("endPos: ", this.endPos);
                //this.pos.lerp(this.startPos, this.endPos, c);
                //print("Lerped Pos: ", this.pos);
                if(this.clicked) {
                        for (var i=0; i<this.positions.length; i++){
                                var lerpAmt = map(i, 0, this.positions.length, 0, 1);
                                var tempPos = p5.Vector.lerp(this.startPos, this.endPos, lerpAmt);
                                this.positions[i] = tempPos;
                        }
                }

        }

        this.animate = function() {
                this.clicked = !this.clicked;
        }

        this.draw = function() {
                for (var i=0; i<this.positions.length; i++) {
                                image(lipsImage, this.positions[i].x, this.positions[i].y, lipsImage.width * .5, lipsImage.height * .5);
                }

                //image(lipsImage, this.pos.x, this.pos.y, lipsImage.width/2, lipsImage.height/2);
        }

};
