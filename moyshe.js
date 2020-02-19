/*global THREE, AFRAME*/

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

AFRAME.registerComponent('cull-object', {
  schema : {
    ceiling : { default : 50 },
    floor : { default : -50 }
  },
  tick : function () {
    var y = this.el.getAttribute('position').y
    // console.log(y)
    if (y < this.data.floor || y > this.data.ceiling) {
      this.el.parentNode.removeChild(this.el);
    }
  }
})

AFRAME.registerComponent('make-shape', {
    schema : {
        primitive : { default : 'sphere' },
        color : { type : 'color',  default : '#EF2D5E' },
        xOffset : { type : 'number', default : 1 }
    },
    makeShape : function (e) {
      // This presumes we bind to this.data from the event listener method
    var data = this.data
        var sphereAmount = 1
        for (var i = 0; i < sphereAmount; i++) {
            var newEl = document.createElement('a-entity')
            newEl.setAttribute('geometry', 'primitive', data.primitive)
            newEl.setAttribute('cull-object', "")
          console.log("added", newEl)
            newEl.setAttribute('dynamic-body', 'mass: 0.1; shape: auto;')      
            // newEl.setAttribute('data-live', 5 + Math.random(10) * 20)
            newEl.classList.add("madeObject")
          // increas position variability
            var scale = getRandomArbitrary(1, 5)
            var randomPos = {x : data.xOffset + getRandomArbitrary(scale, scale*2), y : getRandomArbitrary(scale * 5, scale * 10)}
            newEl.setAttribute('material', 'color', new THREE.Color(data.color))
            newEl.setAttribute('position', `${randomPos.x} ${randomPos.y} -5`)
            newEl.setAttribute('scale', "0 0 0")
            scale *= 0.55
            newEl.setAttribute('animation__grow', `property: scale;
                                                  from: 0 0 0;
                                                  to: ${scale} ${scale} ${scale};
                                                  elasticity: 600;
                                                  easing: easeInOutElastic;
                                                  dur: 600`)
            this.el.sceneEl.appendChild(newEl)
        }
    },
    init : function () {
        // <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
        document.addEventListener('touchstart', this.makeShape.bind(this))
        document.addEventListener('click', this.makeShape.bind(this))
    }
})

const primitives = ['box', 'circle', 'cone', 'cylinder', 'dodecahedron', 'octahedron', 'plane', 'ring', 'sphere', 'tetrahedron', 'torus', 'torusKnot', 'triangle'
]

AFRAME.registerComponent('make-gui', {
    init : function () {
        var gui = new dat.GUI()
        var shapeData = this.el.components['make-shape'].data

        shapeData.clearObject = () => {
            var objects = document.querySelectorAll('.madeObject')

            objects.forEach(function (object) {
                object.parentNode.removeChild(object);
            })
            console.log(`Removed ${objects.length} object(s).`, objects)
        }
        gui.add(shapeData, 'primitive', primitives)
        gui.add(shapeData, 'xOffset', -5, 5, 0.1)
        gui.addColor(shapeData, 'color')
        gui.add(shapeData, 'clearObject');
    }
})