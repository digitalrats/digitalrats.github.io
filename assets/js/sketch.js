var allParticles = [];
var maxSplitCount = 3;

function Particle(x, y, splitCount) {
	
  this.splitCount = splitCount;
  this.age = 0;
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.splitCount, 0, maxSplitCount, 5, 2));
	
  this.move = function() {
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    
    if (this.age % 10 == 0 && this.splitCount > 0) {
			allParticles.push(new Particle(this.pos.x, this.pos.y, this.splitCount - 1));
			this.splitCount -= 1;
    }
		
		this.age++;
  }
}


function setup() {
  var cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.style('display', 'block');  
	colorMode(HSB, 360);
} 

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(1);
  
	
  for (let i = allParticles.length - 1; i > -1; i--) {
    allParticles[i].move();
		
    if (allParticles[i].vel.mag() < 0.01) {
      allParticles.splice(i, 1);
    }
  }
	
	if (allParticles.length > 0) {
    
		let delaunay = Delaunator.from(
			allParticles.map(function(pt) {return [pt.pos.x, pt.pos.y];})
    );
    
    let data = delaunay.triangles;

		strokeWeight(0.5);
		
		let distThresh = 75;
		
    for (let i = 0; i < data.length; i += 3) {
      let particle1 = allParticles[data[i]];
      let particle2 = allParticles[data[i + 1]];
      let particle3 = allParticles[data[i + 2]];
			
      if (particle1.pos.dist(particle2.pos) > distThresh ||
				  particle2.pos.dist(particle3.pos) > distThresh ||
				  particle1.pos.dist(particle3.pos) > distThresh) {
        continue;
      }
			
			let particleColor = color(165 + particle1.age * 1.5, 360, 360);
			
      noFill();
			
			stroke(particleColor);
			
			triangle(
				particle1.pos.x, particle1.pos.y, 
				particle2.pos.x, particle2.pos.y, 
				particle3.pos.x, particle3.pos.y);
		}
	}
}


function mouseDragged() {
  allParticles.push(new Particle(mouseX - windowWidth/2, mouseY-windowHeight/2, maxSplitCount));
}
