import { debounce } from "../../utils";
import { MeshLine, MeshLineMaterial } from "threejs-meshline";

const EVENTS = {
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  RAYCASTER_INTERSECTED: "raycaster-intersected",
  RAYCASTER_CLEARED: "raycaster-intersected-cleared",
  ADD_NODE: "al-add-node"
};

AFRAME.registerComponent("al-drawing-tool", {
  schema: {
    enabled: { default: true },
    minFrameMS: { type: "number", default: 15 },
    minLineSegmentLength: { type: "number", default: 0.05 },
    nodesNum: { type: "number" }
  },

	init: function () {
    this.state = {
      pointerDown: false
    };

    // Use events to figure out what raycaster is listening so we don't have to
    // hardcode the raycaster.
    this.el.addEventListener(EVENTS.RAYCASTER_INTERSECTED, evt => {
      console.log("raycaster intersected");
      this.raycaster = evt.detail.el;
    });
    this.el.addEventListener(EVENTS.RAYCASTER_CLEARED, evt => {
      console.log("raycaster cleared");
      this.raycaster = null;
    });

    const canvas = this.el.sceneEl.canvas;

    canvas.addEventListener(EVENTS.MOUSEDOWN, evt => {
      this.state.pointerDown = true;
    }, false);

    canvas.addEventListener(EVENTS.MOUSEUP, evt => {
      this.state.pointerDown = false;
    }, false);

    this.debouncedGetIntersection = debounce(
      this.getIntersection,
      this.data.minFrameMS
    ).bind(this);

    this.materialsHolder = new MaterialsHolder();
  },

  update: function (_oldData) {
    console.log(this.data.nodesNum);
    this.group = new THREE.Group();
    this.setupMaterials();
    this.el.setObject3D('group', this.group);
    this.geometry = this.getGeometry();
    this.makeLine();
  },

  makeLine: function () {
    if (this.geometry.vertices.length <= 0) return null;
    const line = new MeshLine();
    line.setGeometry(this.geometry, function (p) { return p; });
    return new THREE.Mesh(line.geometry, this.LineMaterial);
  },

  getIntersection: function () {
    console.log("get intersection");
    if (!this.data.enabled || !this.state.pointerDown) {
      return;
    }
    const intersection = this.raycaster.components.raycaster.getIntersection(this.el)
    if (!intersection) { 
      return;
    }

    if (this.state.lastIntersection) {
      const distance = this.state.lastIntersection.point.distanceTo(intersection.point);

      if (distance >= this.data.minLineSegmentLength) {
        this.el.sceneEl.emit(EVENTS.ADD_NODE, {aframeEvent: {
          detail: {
            intersectedEl: this.el,
            intersection: intersection
          }
        }}, false);

        this.state.lastIntersection = intersection;
      }
    } else {
      this.state.lastIntersection = intersection;
    }
  },

  tick: function () {

    // console.log("tick");

    if (!this.raycaster || !this.data.enabled) { return; }  // Not intersecting.

    this.debouncedGetIntersection();

    const linethreemesh = this.makeLine();
    if (linethreemesh != null) {
      this.group.add(linethreemesh);
    }
  },

  // loop through the points to create a line geometry
  getGeometry: function () {
    const geometry = new THREE.Geometry();
    const nodes = Array.from(window.nodes);
    nodes.forEach(function (node) {
      // console.log(node.Position);
      const position = AFRAME.utils.coordinates.parse(node[1].position);
      geometry.vertices.push(position);
    });
    return geometry;
  },

  setupMaterials: function () {
    //var materials = _BrushVariablesInput.materials.split(",");
    //var textures = _BrushVariablesInput.texture.split(",");
    const preset = jsonpreset.remembered.Base["0"];
    this.LineMaterial = this.materialsHolder.makeMaterial(preset, "Brush.png", "LineTexturedMaterial");
    //ObjectsMaterial = materialsHolder.makeMaterial(_BrushVariablesInput, textures[1], materials[1]);
  },

  remove: function () {
    this.el.removeObject3D('group');

    // for (var i = this.group.children.length - 1; i >= 0; i--) {
    //   this.group.remove(this.group.children[i]);
    // }
    // this.BillboardObjects = [];
    // this.refreshBrush = 2;

    // this.LineMaterial.dispose();
    // this.ObjectsMaterial.dispose();
  }
});

const jsonpreset = {
  "preset": "Base",
  "closed": false,
  "remembered": {
    "Base": {
      "0": {
        "lineType": 0,
        "mainColour": {
          r: 17,
          g: 81,
          b: 65
        },
        "decalColour": {
          r: 16,
          g: 77,
          b: 72,
          a: 15
        },
        "lineColour":  {
          r: 11,
          g: 67,
          b: 50,
          a: 77
        },
        "paintDecals": true,
        "paintLine": false,
        "texture": "Brush.png,perlin.png",
        "textureAlt": "null",
        "materials": "LineTexturedMaterial,AnimatedMaterial",
        "objects": "plain",
        "animationSpeed": 0.005,
        "animationSpeedAlt": 0,
        "facing": "Camera",
        "spacing": 0,
        "maxelementWidth": 0.5000000000000003,
        "jitter": 5,
        "rotation": 0,
        "rotationjitter": 0,
        "repeatingAmount": 0,
        "maxlineWidth": 0.20000000000000004,
        "dynamicSpeedSize": 0,
        "dynamicSpeedOpacity": 0,
        "dynamicSpeedSpecial": 0,
        "dynamicPressureSize": 0,
        "dynamicPressureOpacity": 0,
        "dynamicPressureSpecial": 0
      }
    },
    "Test": {
      "0": {
        "lineType": 40,
        "mainColour": 16777215,
        "decalColour": 16777215,
        "lineColour": 16777215,
        "paintDecals": true,
        "paintLine": false,
        "texture": "Brush.png,perlin.png,",
        "textureAlt": "null",
        "materials": "LineTexturedMaterial,AnimatedMaterial",
        "objects": "plain",
        "animationSpeed": 0.009000000000000001,
        "animationSpeedAlt": 0,
        "facing": "Camera",
        "spacing": 10,
        "maxelementWidth": 0.4,
        "jitter": 0,
        "rotation": 0,
        "rotationjitter": 6.28,
        "repeatingAmount": 40,
        "maxlineWidth": 0.10000000000000059,
        "dynamicSpeedSize": 0,
        "dynamicSpeedOpacity": 0,
        "dynamicSpeedSpecial": 0,
        "dynamicPressureSize": 0,
        "dynamicPressureOpacity": -58,
        "dynamicPressureSpecial": 0
      }
    },
    "shapes": {
      "0": {
        "lineType": 0,
        "mainColour": 14132059,
        "decalColour": 16777215,
        "lineColour": 16777215,
        "paintDecals": true,
        "paintLine": false,
        "texture": "Brush.png,rock.png",
        "textureAlt": "null",
        "materials": "LineTexturedMaterial,rock",
        "objects": "lsphere",
        "animationSpeed": 0,
        "animationSpeedAlt": 0,
        "facing": "Body",
        "spacing": 2,
        "maxelementWidth": 0.4,
        "jitter": 4,
        "rotation": 0.6,
        "rotationjitter": 1.69,
        "repeatingAmount": 0,
        "maxlineWidth": 0.20000000000000004,
        "dynamicSpeedSize": 0,
        "dynamicSpeedOpacity": 0,
        "dynamicSpeedSpecial": 0,
        "dynamicPressureSize": 0,
        "dynamicPressureOpacity": 0,
        "dynamicPressureSpecial": 0
      }
    },
    "Rotational": {
      "0": {
        "lineType": 121,
        "mainColour": 16777215,
        "decalColour": 3853633,
        "lineColour": 2964998,
        "paintDecals": true,
        "paintLine": true,
        "texture": "bark.jpg,leaf.png",
        "textureAlt": "null",
        "materials": "LineTexturedMaterial2,leaf",
        "objects": "plain",
        "animationSpeed": 0.005,
        "animationSpeedAlt": 0,
        "facing": "Line",
        "spacing": 6,
        "maxelementWidth": 0.40000000000000036,
        "jitter": 4,
        "rotation": 1.3,
        "rotationjitter": 3.22,
        "repeatingAmount": 121,
        "maxlineWidth": 0.1,
        "dynamicSpeedSize": 0,
        "dynamicSpeedOpacity": 0,
        "dynamicSpeedSpecial": 0,
        "dynamicPressureSize": 0,
        "dynamicPressureOpacity": 0,
        "dynamicPressureSpecial": 0
      }
    },
    "Fire": {
      "0": {
        "lineType": 11,
        "mainColour": 16777215,
        "decalColour": 15875646,
        "lineColour": 16777215,
        "paintDecals": true,
        "paintLine": false,
        "texture": "Brush.png,perlin.png,",
        "textureAlt": "null",
        "materials": "LineTexturedMaterial,AnimatedMaterial",
        "objects": "plain",
        "animationSpeed": 0.009000000000000001,
        "animationSpeedAlt": 0,
        "facing": "Camera",
        "spacing": 5,
        "maxelementWidth": 0.5000000000000001,
        "jitter": 1.04,
        "rotation": 0,
        "rotationjitter": 0.37,
        "repeatingAmount": 11,
        "maxlineWidth": 0.10000000000000081,
        "dynamicSpeedSize": 0,
        "dynamicSpeedOpacity": 0,
        "dynamicSpeedSpecial": 0,
        "dynamicPressureSize": 0,
        "dynamicPressureOpacity": -58,
        "dynamicPressureSpecial": 0
      }
    },
    "PaintStroke": {
      "0": {
        "lineType": 5,
        "mainColour": 1077992,
        "decalColour": 16777215,
        "lineColour": 16777215,
        "paintDecals": false,
        "paintLine": true,
        "texture": "Brush.png,perlin.png,",
        "textureAlt": "null",
        "materials": "LineTexturedMaterial,AnimatedMaterial",
        "objects": "plain",
        "animationSpeed": 0.009000000000000001,
        "animationSpeedAlt": 0,
        "facing": "Camera",
        "spacing": 0,
        "maxelementWidth": 0.4,
        "jitter": 0,
        "rotation": 0,
        "rotationjitter": 0,
        "repeatingAmount": 5,
        "maxlineWidth": 0.4000000000000008,
        "dynamicSpeedSize": 0,
        "dynamicSpeedOpacity": 0,
        "dynamicSpeedSpecial": 0,
        "dynamicPressureSize": 0,
        "dynamicPressureOpacity": -58,
        "dynamicPressureSpecial": 0
      }
    }
  },
  "folders": {
    "animation": {
      "preset": "Default",
      "closed": true,
      "folders": {}
    },
    "elements": {
      "preset": "Default",
      "closed": true,
      "folders": {}
    },
    "line": {
      "preset": "Default",
      "closed": true,
      "folders": {}
    },
    "dynamics": {
      "preset": "Default",
      "closed": true,
      "folders": {}
    }
  }
}

class DrawingToolManager {
  constructor(assetsPath) {
//     var coordinates = AFRAME.utils.coordinates;
//     this.line;
// var geometry;
    /**
     * @constructs BrushVariablesEditorInputs
     * This holds the properties of the brush stroke(whats shown to the user), and is edited by the designers
     * @param {Object} n The properties.
     * @param {String} n.lineType Line, Dotted line, Multi line, Crossed line, Object line, Decaled line, Decales.
     * @param {THREE.Color} n.mainColour the main colour.
     * @param {THREE.Color} n.decalColour the decals colour.
     * @param {THREE.Color} n.lineColour the line colour.
     * @param {String[]} n.texture names of main texture.
     * @param {String[]} n.textureAlt names of Alt texture.
     * @param {String[]} n.materials names of materials.
     * @param {String[]} n.objects names of objects (meshes).
     * @param {Float} n.animationSpeed animation Speed.
     * @param {Float} n.animationSpeedAlt animationAlt Speed.
     * @param {Float} n.facing the direction the object faces
     * @param {Float} n.spacing spacing of brush dots or objects.
     * @param {Float} n.maxlineWidth Max size of the width of the line
     * @param {Float} n.maxelementWidth Max size of the width of the elements
     * @param {Float} n.jitter the jitter position amount of other brush elements.
     * @param {Float} n.rotation the rotation of the main texture.
     * @param {Float} n.rotationjitter the rotation jitter.
     * @param {Float} n.repeatingAmount Repeating Texture Amount(0 for stretch)
     * @param {Float} n.dynamicSpeedSize the amount speed effects size
     * @param {Float} n.dynamicSpeedOpacity the amount speed effects opacity.
     * @param {Float} n.dynamicSpeedSpecial the amount a special variable is effected.
     * @param {Float} n.dynamicPressureSize the amount pressure effects size
     * @param {Float} n.dynamicPressureOpacity the amount pressure effects opacity.
     * @param {Float} n.dynamicPressureSpecial the amount a special variable is effected.
     */

    this.assetsPath = assetsPath;
    this.paintLine = true;
    this.paintDecals = true;
    this.lineType = "null";
    this.mainColour = new THREE.Color();
    this.texture = "Brush.png,perlin.png";
    this.textureAlt = "null";
    this.materials = "LineTexturedMaterial,AnimatedMaterial";
    this.objects = "plain";
    this.animationSpeed = 0.05;
    this.animationSpeedAlt = 0.0;
    this.facing = "Camera";
    this.spacing = 0.0;
    this.maxlineWidth = 1.0;
    this.maxelementWidth = 1.0;
    this.jitter = 0.0;
    this.rotation = 0.0;
    this.rotationjitter = 0.0;
    this.repeatingAmount = 0.0;
    this.dynamicSpeedSize = 0.0;
    this.dynamicSpeedOpacity = 0.0;
    this.dynamicSpeedSpecial = 0.0;
    this.dynamicPressureSize = 0.0;
    this.dynamicPressureOpacity = 0.0;
    this.dynamicPressureSpecial = 0.0;

    this.decalColour = new THREE.Color();
    this.lineColour = new THREE.Color();
    this.BillboardObjects = [];
    //---testing geometry vars----
    this.segmentCount = 60;
    this.radius = 2;
    this.height = 5;
    this.coils = 4;
    //---testing geometry vars----
    //----
    this.timer = 0.0;
    this.group = new THREE.Group();

    this.refreshBrush = 2;
    
    this.materialsHolder = new MaterialsHolder();
    this.shaderHolder = new ShaderHolder();
 
    var materials = this.materials.split(",");
    var textures = this.texture.split(",");
    this.LineMaterial = this.materialsHolder.makeMaterial(this, this.assetsPath+textures[0], materials[0]);
    this.ObjectsMaterial = this.materialsHolder.makeMaterial(this, this.assetsPath+textures[1], materials[1]);
  }
  
  // reset manager
  Reset() {
    for (var i = this.group.children.length - 1; i >= 0; i--) {
        this.group.remove(this.group.children[i]);
    }
    this.BillboardObjects = [];
    this.refreshBrush = 2;

    this.LineMaterial.dispose();
    this.ObjectsMaterial.dispose();
  }

}

//var _BrushVariablesInput = new BrushVariablesEditorInputs();//for the editor

class BrushInputs {
    /**
     * @constructs BrushInputs
     * This is the data passed from the user to this brushstroke
     * @param {Object} n The properties.
     * @param {THREE.Color} n.colour the user colour selected.
     * @param {Float} n.size the user size selected.
     * @param {THREE.Vector3} n.position the user painted position
     * @param {THREE.Vector4} n.normalDistance the user painted normal and distance from body mesh
     * @param {Float} n.speed the user painted speed
     * @param {Float} n.presure the user painted presure
     */
    constructor(n = {}) {
        this.colour = n.colour;
        this.size = n.size;
        this.position = n.position;
        this.normalDistance = n.normalDistance;
        this.speed = n.speed;
        this.presure = n.presure;
    }
};

/**
   * @constructs makeMaterial this should be where we create ALL materials
   * @param {String} textureName the main texture name
   * @param {String} materialName the material name we use to ID it
   */
class MaterialsHolder {
 
  constructor () {

  }
    
  makeMaterial(_BrushVariablesInput, _textureName, _materialName) {
        if (_materialName == "LineTexturedMaterial") {
            var _ShaderHolder = new ShaderHolder("LineMaterial");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            mcolour.lerp (lcolour, 0.5 );
            return new MeshLineMaterial({
                color: mcolour,
                map: texture,
                useMap: 1,
                alphaMap: texture,
                useAlphaMap: true,
                transparent: true,
                opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                depthTest: false,
                depthWrite: true,
                blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "LineTexturedMaterial2") {
            var _ShaderHolder = new ShaderHolder("LineMaterial");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.lineColour.r, _BrushVariablesInput.lineColour.g, _BrushVariablesInput.lineColour.b);
            mcolour.lerp (lcolour, 0.5 );
            return new MeshLineMaterial({
                color: mcolour,
                map: texture,
                useMap: 1,
                //alphaTest: 0.5,
                // alphaMap: texture,
                // useAlphaMap: true,
                // transparent: true,
                // opacity: 1,
                lineWidth: _BrushVariablesInput.maxlineWidth,
                // depthTest: false,
                // depthWrite: true,
                // blending: THREE.AdditiveBlending,//NormalBlending,
                repeat: new THREE.Vector2(_BrushVariablesInput.repeatingAmount + 1.0, 1),
                fragmentShader: _ShaderHolder.fragmentShader
            });
        }
        if (_materialName == "AnimatedMaterial") {
            var _ShaderHolder = new ShaderHolder("AnimatedMaterial");
            var loader = new THREE.TextureLoader();
            var texture = loader.load(_textureName, function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
            });
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            mcolour.lerp (lcolour, 0.5 );
            var uniforms = {
                map: { type: "t", value: texture },
                opacity: { type: "f", value: 1.0 },
                time: { type: "f", value: 1.0 },
                colour: { type: "c", value: mcolour }
            };
            return new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: true,
                depthTest: false
            });
        }
        if (_materialName == "rock") {
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            mcolour.lerp (lcolour, 0.5 );
            return new THREE.MeshBasicMaterial({
                color: mcolour,
                map: texture,
                name: "No custom Shader",
            });
        }

        if (_materialName == "leaf") {
            var _ShaderHolder = new ShaderHolder("TransparentCutout");
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            // var newcolour = new THREE.Color(0xffffff);
            // //if (_BrushVariablesInput.mainColour.r) {
            // newcolour.r = _BrushVariablesInput.mainColour.r;
            // newcolour.g = _BrushVariablesInput.mainColour.g;
            // newcolour.b = _BrushVariablesInput.mainColour.b;
            var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
            var lcolour = new THREE.Color(_BrushVariablesInput.decalColour.r, _BrushVariablesInput.decalColour.g, _BrushVariablesInput.decalColour.b);
            mcolour.lerp (lcolour, 0.5 );
            var uniforms = {
                map: { type: "t", value: texture },
                colour: { type: "c", value: mcolour },
                threshhold: { type: "f", value: 0.9 },
            };
            return new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: _ShaderHolder.vertexShader,
                fragmentShader: _ShaderHolder.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: true,
                depthTest: true,
                name: "No custom Shader",
            });
        }

        if (_textureName == "" || _textureName == "null") {
            return new THREE.MeshBasicMaterial({
                color: 0xffffff,
                name: "No custom Shader",
            });
        } else {
            var texture = new THREE.TextureLoader().load(_textureName);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            return new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: texture,
                name: "No custom Shader",
                alphaMap: texture,
                depthWrite: false,
                depthTest: true,
                transparent: true,
            });
        }

    }
  }



  /**
   * @constructs ShaderHolder this should be where we load ALL shaders
   * @param {String} _name the shadername
   */
class ShaderHolder {
  constructor (_name) {
    THREE.ShaderChunk['basevertext'] = [
      'varying vec2 vUV;',
      'varying vec3 zdist;',
      'varying vec3 wrldpos;',
      'void main(void) {',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '  vUV = uv;',
      '  wrldpos = gl_Position.xyz;',
      '  zdist = -(modelViewMatrix * vec4(gl_Position.xyz, 1.)).xyz;',
      '}'
  ].join('\r\n');

  THREE.ShaderChunk['basefragmentVars'] = [
      'varying vec2 vUV;',
      'uniform sampler2D map;',
      'uniform vec3 colour;',
      'uniform float threshhold;',
      'varying vec3 zdist;',
      'varying vec3 wrldpos;',
      'uniform float time;',
      ' '
  ].join('\r\n');

  THREE.ShaderChunk['baseLinefragmentVars'] = [
      '',
      THREE.ShaderChunk.fog_pars_fragment,
      THREE.ShaderChunk.logdepthbuf_pars_fragment,
      '',
      'uniform sampler2D map;',
      'uniform sampler2D alphaMap;',
      'uniform float useMap;',
      'uniform float useAlphaMap;',
      'uniform float useDash;',
      'uniform float dashArray;',
      'uniform float dashOffset;',
      'uniform float dashRatio;',
      'uniform float visibility;',
      'uniform float alphaTest;',
      'uniform vec2 repeat;',
      'uniform float time;',
      '',
      'varying vec2 vUV;',
      'varying vec4 vColor;',
      'varying float vCounters;',
      '',
  ].join('\r\n');


  this.vertexShader = [
      THREE.ShaderChunk.basevertext,
  ].join('\n');
  this.fragmentShader = [
      THREE.ShaderChunk.basefragmentVars,
      'void main() {',
      'vec4 tex = texture2D(map,vec2(vUV.x ,vUV.y));',
      'gl_FragColor =vec4(tex.rgb, alph);',
      '}'
  ].join('\n');

  if (_name == "AnimatedMaterial") {
  this.fragmentShader = [
      THREE.ShaderChunk.basefragmentVars,
      'float snoise(vec3 uv, float res){ vec3 s = vec3(1e0, 1e2, 1e3);uv *= res;vec3 uv0 = floor(mod(uv, res))*s;vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;vec3 f = fract(uv); f = f*f*(3.0-2.0*f);vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);vec4 r = fract(sin(v*1e-1)*1e3);float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);return mix(r0, r1, f.z)*2.-1.;}',
      'void main() {',
      'float off_y = -time;',
      // sample
      ' vec2 uv = vUV;',
      ' vec3 col = vec3(1.0,1.0,1.0);',
      'vec2 p = vUV - vec2(0.5, 0.5);',
      'float flameDisplacement = max(0.0, (zdist.z)+sin(time * .6242*2.0 + (p.y * 5.0)) * 0.3 * pow(uv.y - 0.1, 1.5));',
      'p.x += flameDisplacement;',
      'p.x += p.x / pow((1.0 - p.y), 0.97);', // teardrop shaping

      'float color = 3.0 - (3.*length(2.*p));',
      'vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);',
      'for(int i = 0; i < 1; i++){',
      'float power = pow(2.0, float(2+i));',
      'float sintime = time*((5.0-wrldpos.z)*0.9);//abs(sin(time * 3.141));',
      'color += (1.5 / power) * snoise(coord + vec3(0.,-sintime*.05, sintime*.01), power*6.);',
      '}',
      'float alph = clamp( (1.0-zdist.z)* color * ((5.0-wrldpos.z)*0.2),0.0,1.);',
      'if(alph <0.1){discard;}',
      'if(color <0.1){discard;}',
      'float g = clamp(pow(max(color,0.),2.)*0.4,0.0,1.0);',
      'float b = clamp(pow(max(color,0.),3.)*0.15,0.0,1.0);',
      'vec3 _col = colour * vec3(clamp(color,0.0,1.0), g, b );',
      // 'vec3 _col = vec3(1.0,1.0,1.0);',
      'gl_FragColor =vec4(_col.rgb, alph);',

      '}'
  ].join('\n');
}
  if (_name == "TransparentCutout") {
      this.fragmentShader = [
          THREE.ShaderChunk.basefragmentVars,
          'void main() {',
          ' vec4 tex = texture2D(map,vec2(vUV.x ,vUV.y));',
          ' if(tex.a<threshhold) discard;',
          'gl_FragColor = vec4(tex.rgb * colour.rgb, tex.a);',
          '}'
      ].join('\n');
  }

  if (_name == "LineMaterial") {
      this.fragmentShader = [
          THREE.ShaderChunk.baseLinefragmentVars,
          'void main() {',
          '',
          THREE.ShaderChunk.logdepthbuf_fragment,
          '',
          '    vec4 c = vColor;',
          '    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );',
          '    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;',
          '    if( c.a < alphaTest ) discard;',
          '    if( useDash == 1. ){',
          '        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));',
          '    }',
          '    gl_FragColor = c;',
          '    gl_FragColor.a *= step(vCounters, visibility);',
          '',
          THREE.ShaderChunk.fog_fragment,
          '}'
      ].join('\n');
  }

  }
}

