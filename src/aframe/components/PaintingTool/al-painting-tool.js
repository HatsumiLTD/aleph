// @ts-nocheck
import { PaintingToolMeshLineMaterial } from "./PaintingToolMeshLine";
import { DecalElement, ShaderHolder } from "./PaintingToolManager";
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
  ADD_NODE: "al-add-node"
};
AFRAME.registerComponent("al-painting-tool", {
  schema: {
    enabled: { default: true },
    minFrameMS: { type: "number", default: 15 },
    minLineSegmentLength: { type: "number", default: 0.0001 },
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

    rightController.addEventListener(EVENTS.ABUTTONDOWN, evt => {
      paintingToolManager.NextPreset();

    });


    addEventListener('thumbstickmoved', function (evt) {
      paintingToolManager.changeCurrentWidth(evt.detail.y);
    });

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
  makeSceneElements: function () {
    // add a plane with 'shadow'----should be placed somewhere else when I have time
    var geometry = new THREE.PlaneGeometry(30, 30, 30);
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
    var backgroundSphere = new THREE.Mesh(new THREE.SphereGeometry(30, 10, 10), new THREE.MeshBasicMaterial({
      map: (new THREE.TextureLoader).load("https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FFinalHatsumiBackGround.png?v=1602267351065"),
    }));
    backgroundSphere.geometry.scale(-1, 1, 1);
    this.el.sceneEl.object3D.add(backgroundSphere);
    //add a background sphere-----
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
    // if (intersection) {
    //   this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume + 0.01, 0.0, 1.0);
    // } else {
    //   this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume - 0.1, 0.0, 1.0);
    // }
    if (!intersection) {
      this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume - 0.1, 0.0, 1.0);
      return;
    }

    if (this.state.lastIntersection) {

      const distance = this.state.lastIntersection.point.distanceTo(
        intersection.point
      );

      if (distance >= this.data.minLineSegmentLength) {
        this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume + 0.06, 0.0, 1.0);
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
      } else {
        this.sfx_brushVolume = THREE.Math.clamp(this.sfx_brushVolume - 0.1, 0.0, 1.0);
      }
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

    if (paintingToolManager.runAnimation(this.el.sceneEl, this.state.pointerDown)) {
      this.forceTouchUp();
      this.forceTouchDown();
    }
  },
  remove: function () {
    this.el.removeObject3D("group");
  }
});
