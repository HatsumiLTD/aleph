// @ts-nocheck
import { PaintingToolMeshLineMaterial } from "./PaintingToolMeshLine";
import { DecalElement, ShaderHolder } from "./PaintingToolManager";
import { Color, Vector2, Vector3 } from "three";
//import "./THREE.MeshLine";

// import { EventUtils } from "../../utils";
// import { MeshLine, MeshLineMaterial } from "threejs-meshline";

const EVENTS = {
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  TRIGGERDOWN: "triggerdown",
  TRIGGERUP: "triggerup",
  ABUTTONDOWN: "abuttondown",
  BBUTTONDOWN: "bbuttondown",
  RAYCASTER_INTERSECTED: "raycaster-intersected",
  RAYCASTER_CLEARED: "raycaster-intersected-cleared",
  ADD_NODE: "al-add-node",
  UPDATE_BRUSH_NODE: "al-update-brush-node"
};
AFRAME.registerComponent("al-painting-tool", {
  schema: {
    enabled: { default: true },
    minFrameMS: { type: "number", default: 15 },
    minLineSegmentLength: { type: "number", default: 0.005 },
    minBrushSegmentLength: { type: "number", default: 0.00005 },
    nodesNum: { type: "number" },
    dirty: { type: "string" },
    preset: { type: "number" },
    raycasterEnabled: { type: "boolean" }
  },

  init: function () {
    this.state = {
      pointerDown: false,
      firstpointerDownIntersection: 0
    };

    this.sfx_brushMasterVolume = 0.6;
    this.sfx_brushVolume = 0;
    this.sfx_oldbrushVolume = -1;
    this.sfx_Startedbrush = false;
    // Use events to figure out what raycaster is listening so we don't have to
    // hardcode the raycaster.
    this.el.addEventListener(EVENTS.RAYCASTER_INTERSECTED, evt => {
      //console.log("raycaster intersected");
      this.raycaster = evt.detail.el;
    });
    this.el.addEventListener(EVENTS.RAYCASTER_CLEARED, evt => {
      //console.log("raycaster cleared");
      this.raycaster = null;
    });

    const canvas = this.el.sceneEl.canvas;

    canvas.addEventListener(
      EVENTS.MOUSEDOWN,
      evt => {
        this.state.pointerDown = true;
        this.state.firstpointerDownIntersection = -999;
      },
      false
    );

    canvas.addEventListener(
      EVENTS.MOUSEUP,
      evt => {
        this.state.pointerDown = false;
        this.state.firstpointerDownIntersection = -999;
        paintingToolManager.ResetCurrentBrush();
      },
      false
    );

    // vr controller listeners
    const rightController = document.getElementById("right-controller");
    this.VRMode = false;
    this.el.sceneEl.addEventListener("enter-vr", function () {
      console.log("ENTERED VR");
      this.VRMode = true;
      // if (!this.sfx_Startedbrush) {
      rightController.components.sound.playSound();
      // this.sfx_Startedbrush = true;
      // }
    });
    this.el.sceneEl.addEventListener("exit-vr", function () {
      console.log("EXIT VR");
      this.VRMode = false;
    });
    this.el.addEventListener(EVENTS.MOUSEDOWN, evt => {
      //console.log("trigger down");
      this.state.pointerDown = true;
      this.state.firstpointerDownIntersection = -999;
      paintingToolManager.ResetCurrentBrush();
      if (!this.sfx_Startedbrush) {
        rightController.components.sound.playSound();
        this.sfx_Startedbrush = true;
      }
    });

    this.el.addEventListener(EVENTS.MOUSEUP, evt => {
      //console.log("trigger up");
      this.state.pointerDown = false;
      this.state.firstpointerDownIntersection = -999;
      paintingToolManager.ResetCurrentBrush();
    });

    // rightController.addEventListener(EVENTS.ABUTTONDOWN, evt => {
    //   paintingToolManager.NextPreset();
    // });


    // addEventListener('thumbstickmoved', function (evt) {
    //   paintingToolManager.changeCurrentWidth(evt.detail.y);
    // });

    this.debouncedGetIntersection = AFRAME.utils.throttle(
      this.getIntersection,
      this.data.minFrameMS,
      this
    );
    this.tick = AFRAME.utils.throttleTick(this.tick, 20, this);

    this.group = new THREE.Group();
    this.el.setObject3D("group", this.group);
    this.makeSceneElements();
    this.clock = new THREE.Clock();
    paintingToolManager.parentGroup = this.group;
    console.log("add skybox");

  },
  forceTouchUp: function () {
    this.state.pointerDown = false;
    this.state.firstpointerDownIntersection = -999;
    paintingToolManager.ResetCurrentBrush();
  },
  forceTouchDown: function () {
    this.state.pointerDown = true;
    this.state.firstpointerDownIntersection = -999;
    paintingToolManager.ResetCurrentBrush();
  },
  addParticleArray: function (animated, blendingMode, colourHue, colourHueRandom, colourLum, feildSize, amount, width, maxSize) {
    const colors = new Float32Array(amount * 3);
    const sizes = [];
    const vertices = [];
    const color = new THREE.Color(0xffffff);
    for (let i = 0; i < amount; i++) {
      var perc = Math.random();//parseFloat(i) / parseFloat(amount + 1.0);
      let _random = 0.1 + Math.random();
      let center = new Vector2(Math.sin(6.284 * perc) * width * feildSize.x * _random, Math.cos(6.284 * perc) * width * feildSize.z * _random);
      const x = center.x;
      const z = center.y - 0.8;//match model position
      const y = Math.random() * width * feildSize.y;
      vertices.push(x, y, z);
      //--
      let cen = new Vector3(0, y, - 0.8);
      let pos = new Vector3(x, y, z);
      let distance = cen.distanceTo(pos);
      let distanceNorm = distance / width;
      let size = (distanceNorm * maxSize);
      sizes.push(size);

      color.setHSL(colourHue + colourHueRandom * Math.random(), 0.9, colourLum);

      color.toArray(colors, i * 3);

    }
    const _geometry = new THREE.BufferGeometry();
    _geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    _geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    _geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    if (animated == false) {
      let _ParticelShaderHolder = new ShaderHolder("ParticelDot");
      const _Mmaterial = new THREE.ShaderMaterial({
        uniforms: {
          opacity: { type: "f", value: 0.6 }
        },
        vertexShader: _ParticelShaderHolder.vertexShader,
        fragmentShader: _ParticelShaderHolder.fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: true,
        blending: blendingMode
      });
      let _points = new THREE.Points(_geometry, _Mmaterial);
      this.el.sceneEl.object3D.add(_points);
    } else {
      let _points = new THREE.Points(_geometry, this.particlesMaterial);
      this.el.sceneEl.object3D.add(_points);
    }
  },
  addHatsumiLogoElement: function (texture, amount) {
    const width = 50;
    const vertices = [];
    for (let i = 0; i < amount; i++) {
      let perc = Math.random();//parseFloat(i) / parseFloat(amount + 1.0);
      let _random = Math.random();
      let center = new Vector2(Math.sin(6.284 * perc) * 50 + (width * _random), Math.cos(6.284 * perc) * 50 + (width * _random));
      const x = center.x;
      const z = center.y - 0.8;//match model position
      const y = Math.random() * width * 0.5;
      vertices.push(x, y, z);
    }

    const _geometry = new THREE.BufferGeometry();
    _geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({
      transparent: true,
      map: texture,
      alphaMap: texture,
      // sizeAttenuation: false,
      size: 20
    });
    let _points = new THREE.Points(_geometry, material);
    this.el.sceneEl.object3D.add(_points);
  },
  makeSceneElements: function () {
    // add a plane with 'shadow'----should be placed somewhere else when I have time
    var geometry = new THREE.PlaneGeometry(12, 12, 12);
    var _ShaderHolder = new ShaderHolder("ShadedDot");
    var loader = new THREE.TextureLoader();
    var mcolour = new THREE.Color(0, 0, 0.1);
    var uniforms = {
      opacity: { type: "f", value: 0.6 },
      color: { type: "c", value: mcolour }
    };
    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: _ShaderHolder.vertexShader,
      fragmentShader: _ShaderHolder.fragmentShader,
      transparent: true
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, 0);
    plane.rotateX(-Math.PI * 0.5);
    plane.updateMatrixWorld();
    this.el.sceneEl.object3D.add(plane);
    // add a plane with 'shadow'----should be placed somewhere else when I have time
    //add a background sphere-----
    var backgroundSphere = new THREE.Mesh(new THREE.SphereGeometry(100, 6, 6), new THREE.MeshBasicMaterial({
      map: (new THREE.TextureLoader).load("https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FFinalHatsumiBackGround.png?v=1602267351065"),
      color: new THREE.Color(0.25, 0.25, 0.25),
    }));
    backgroundSphere.geometry.scale(-1, 1, 1);
    this.el.sceneEl.object3D.add(backgroundSphere);
    //add a background sphere-----
    //---add some plants to the scene----(bad idea)
    // const gltfLoader = new THREE.GLTFLoader();
    // gltfLoader.load('https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FPlantsTest.glb?v=1605289238491', (gltf) => {
    //   const root = gltf.scene;
    //   root.position.set(-2, 0, 0);
    //   this.el.sceneEl.object3D.add(root);
    // });
    //---add some plants to the scene----(bad idea)
    var _CameraworldPos = new THREE.Vector3();
    var cameraEl = this.el.sceneEl.camera;
    _CameraworldPos.setFromMatrixPosition(cameraEl.matrixWorld);

    let textureA = (new THREE.TextureLoader).load("https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FHatsumi_logo_0.png?v=1605293414505");
    let textureB = (new THREE.TextureLoader).load("https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FHatsumi_logo_1.png?v=1605293414603");
    let textureC = (new THREE.TextureLoader).load("https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FHatsumi_logo_2.png?v=1605293414686");
    // this.addHatsumiLogoElement(textureA, 20);
    // this.addHatsumiLogoElement(textureB, 20);
    // this.addHatsumiLogoElement(textureC, 20);
    const HatsumiLogoElementScale = 10;
    for (let i = 0; i < 40; i++) {
      let _geometry = new THREE.PlaneGeometry(HatsumiLogoElementScale, HatsumiLogoElementScale, 2);
      let texts = [textureA, textureB, textureC],
        textsToUse = texts[Math.floor(Math.random() * texts.length)];
      let _material = new THREE.MeshBasicMaterial({
        map: textsToUse,
        // useMap: 1,
        alphaMap: textsToUse,
        useAlphaMap: true,
        transparent: true,
        opacity: 0.05,
        // alphaTest: 0.1,
        // lineWidth: _BrushVariablesInput.maxlineWidth,
        depthTest: false,
        depthWrite: false,
      });
      let mesh = new THREE.Mesh(_geometry, _material);
      this.el.sceneEl.object3D.add(mesh);
      let width = 80;
      var perc = Math.random();//parseFloat(i) / parseFloat(amount + 1.0);
      let _random = Math.random();
      let center = new Vector2(Math.sin(6.284 * perc) * (width), Math.cos(6.284 * perc) * (width));
      const x = center.x;
      const z = center.y - 0.8;//match model position
      const y = Math.random() * width;

      mesh.position.set(x, y, z);
      let cameraworldPos = AFRAME.utils.coordinates.parse(_CameraworldPos);
      mesh.lookAt(cameraworldPos);
    }
    //add particles to scene------------
    this.particlesMaterialDelta = 1.0;
    let _ParticelShaderHolder = new ShaderHolder("AnimatedParticelDot");
    this.particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        opacity: { type: "f", value: 0.4 },
        time: { type: "f", value: 1.0 }
      },
      vertexShader: _ParticelShaderHolder.vertexShader,
      fragmentShader: _ParticelShaderHolder.fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: true,
      blending: THREE.AdditiveBlending
    });
    //ground
    let amount = 5000;
    let width = 50;
    let maxSize = 5.0;
    let colourLum = 0.3;
    let feildSize = new Vector3(2.0, 0.01, 2.0);
    let animated = false;
    this.addParticleArray(animated, THREE.AdditiveBlending, 0.5, 0.2, colourLum, feildSize, amount, width, maxSize);
    //body
    amount = 500;
    width = 2.0;
    maxSize = 0.1;
    colourLum = 0.7;
    feildSize = new Vector3(1, 2, 1.0);
    animated = true;
    this.addParticleArray(animated, THREE.AdditiveBlending, 0, 0.2, colourLum, feildSize, amount, width, maxSize);
    //add particles to scene------------
  },
  getIntersection: function () {
    //console.log("get intersection");
    if (!this.data.enabled || !this.state.pointerDown) {
      this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume - 0.1, 0.0, 1.0);
      return;
    }
    const intersection = this.raycaster.components.raycaster.getIntersection(
      this.el
    );

    if (!intersection) {
      this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume - 0.1, 0.0, 1.0);
      return;
    }

    if (this.state.lastIntersection) {

      const distance = this.state.lastIntersection.point.distanceTo(
        intersection.point
      );
      //--
      if (distance >= this.data.minLineSegmentLength) {
        this.el.sceneEl.emit(
          EVENTS.ADD_NODE,
          {
            aframeEvent: {
              detail: {
                intersectedEl: this.el,
                intersection: intersection
              }
            }
          },
          false
        );
        this.state.lastIntersection = intersection;
      }
      //--
      if (distance >= this.data.minBrushSegmentLength) {
        //change the size of the brush based on ray intersection distance
        paintingToolManager.changeCurrentWidthDirectly(intersection.distance);
        //change the size of the brush based on ray intersection distance
        this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume + 0.06, 0.0, 1.0);
        const nodeSpawnedEvent = new CustomEvent(EVENTS.UPDATE_BRUSH_NODE, {
          detail: {
            intersectedEl: this.el,
            intersection: intersection
          }
        });
        document.dispatchEvent(nodeSpawnedEvent);
      } else {
        this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume - 0.1, 0.0, 1.0);
      }
      //--
    } else {
      this.state.lastIntersection = intersection;
    }
  },

  tick: function (t, dt) {
    if (this.data.raycasterEnabled &&
      this.raycaster &&
      (this.state.firstpointerDownIntersection < 2)) {
      this.getIntersection();//debouncedGetIntersection();
    } else {
      if (this.state.firstpointerDownIntersection > -999)
        this.state.firstpointerDownIntersection++;
    }

    if (this.sfx_oldbrushVolume != this.sfx_brushVolume) {
      const rightController = document.getElementById("right-controller");
      rightController.components.sound.pool.children[0].setVolume(this.sfx_brushVolume * this.sfx_brushMasterVolume);
      this.sfx_oldbrushVolume = this.sfx_brushVolume;
    }
    if (paintingToolManager.updateLineLength(this.state.pointerDown)) {
      this.forceTouchUp();
      this.forceTouchDown();
    }
    paintingToolManager.runAnimation(this.el.sceneEl, this.state.pointerDown);
    this.particlesMaterialDelta += 0.001;
    if (this.particlesMaterialDelta > 1.0) this.particlesMaterialDelta -= 1.0;
    if (this.particlesMaterial) {
      this.particlesMaterial.uniforms.time.value = this.particlesMaterialDelta;
      this.particlesMaterial.needsUpdate = true;
    }
  },
  remove: function () {
    this.el.removeObject3D("group");
  }
});
