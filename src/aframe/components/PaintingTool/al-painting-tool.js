// @ts-nocheck
import { PaintingToolMeshLineMaterial } from "./PaintingToolMeshLine";
import { DecalElement, PaintingToolManager } from "./PaintingToolManager";
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
    minLineSegmentLength: { type: "number", default: 0.05 },
    nodesNum: { type: "number" },
    dirty: { type: "string" },
    preset: { type: "number" },
    raycasterEnabled: { type: "boolean" }
  },

  init: function() {
    this.state = {
      pointerDown: false
    };

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
      },
      false
    );

    canvas.addEventListener(
      EVENTS.MOUSEUP,
      evt => {
        this.state.pointerDown = false;
      },
      false
    );

    // vr controller listeners
    const rightController = document.getElementById("right-controller");

    this.el.addEventListener(
      EVENTS.MOUSEDOWN,
      evt => {
        //console.log("trigger down");
        this.state.pointerDown = true;
      }
    );

    this.el.addEventListener(
      EVENTS.MOUSEUP,
      evt => {
        //console.log("trigger up");
        this.state.pointerDown = false;
      }
    );

    rightController.addEventListener(
      EVENTS.ABUTTONDOWN,
      evt => {
        paintingToolManager.NextPreset();
      }
    );

    this.debouncedGetIntersection = AFRAME.utils.throttle(this.getIntersection, this.data.minFrameMS, this);
    
    console.log("add skybox");
    
    // add a plane with 'shadow'----should be placed somewhere else when I have time
    //add a background sphere-----
    var backgroundSphere = new THREE.Mesh(new THREE.SphereGeometry(30, 10, 10), new THREE.MeshBasicMaterial({
        map: (new THREE.TextureLoader).load("https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FHatsumiBackGrounds_13.jpg?v=1601458890388"),
    }));
    backgroundSphere.geometry.scale(-1, 1, 1);
    this.el.sceneEl.object3D.add(backgroundSphere);
    //add a background sphere-----
  },

  update: function(_oldData) {
    //console.log("nodeNum", this.data.nodesNum);
    //console.log("preset", this.data.preset);
    console.log("update");
    if (!this.data.enabled) {
      return;
    }
    this.group = new THREE.Group();
    this.el.setObject3D("group", this.group);
    this.geometry = this.getGeometry();
    this.makeLine();
    const linethreemesh = this.makeLine();
    if (linethreemesh != null) {
      this.group.add(linethreemesh);
    }
    this.addDecals();
    //this.el.sceneEl.emit("al-painting-tool-needs-refresh");
  },

  makeLine: function() {
    if (!this.geometry) {
      return;
    }
    if (this.geometry.vertices.length <= 0) {
      return null;
    }
    const line = new PaintingToolMeshLine();
    line.setGeometry(this.geometry, function(p) {
      return p;
    });
    return new THREE.Mesh(line.geometry, paintingToolManager.LineMaterial);
  },

  getIntersection: function() {
    //console.log("get intersection");
    if (!this.data.enabled || !this.state.pointerDown) {
      return;
    }
    const intersection = this.raycaster.components.raycaster.getIntersection(
      this.el
    );
    if (!intersection) {
      return;
    }

    if (this.state.lastIntersection) {
      const distance = this.state.lastIntersection.point.distanceTo(
        intersection.point
      );

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
    } else {
      this.state.lastIntersection = intersection;
    }
  },

  tick: function() {
    //console.log("tick");

    if (this.data.raycasterEnabled && this.raycaster) {
      this.debouncedGetIntersection();
    } // Not intersecting.
    ////get camera position--------
    var scene = this.el.sceneEl;
    var cameraEl = scene.camera;
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(cameraEl.matrixWorld);
    // ////get camera position--------

    //--------run timer---------
    paintingToolManager.timer += paintingToolManager.animationSpeed;
    if (paintingToolManager.timer >= 1.0) paintingToolManager.timer -= 1.0;
    if (paintingToolManager.timer <= -1.0) paintingToolManager.timer += 1.0;
    //--------run timer---------
    //-------Update the line material------
    if (paintingToolManager.LineMaterial) {
      if (paintingToolManager.LineMaterial.name != "No custom Shader") {
        // var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
        // this.Material.uniforms.colour.value = mcolour;//_BrushVariablesInput.mainColour;
        if (paintingToolManager.nodes.length &&
          paintingToolManager.LineMaterial.uniforms.pressures &&
          paintingToolManager.LineMaterial.uniforms.time
          ) {
          paintingToolManager.LineMaterial.uniforms.pressures.value = paintingToolManager.GetPressure();
          paintingToolManager.LineMaterial.uniforms.time.value = paintingToolManager.timer; //timer;
          paintingToolManager.LineMaterial.needsUpdate = true;
        }
      }
    }
    //-------Update the line material------
    //-------Update the decal objects(BillboardObjects)------
    if (paintingToolManager.BillboardObjects.length > 0) {
      paintingToolManager.BillboardObjects.forEach(function(obj) {
        obj.UpdateDelta(worldPos, paintingToolManager.timer);
      });
    }
    //-------Update the decal objects(BillboardObjects)------
  },

  // loop through the points to create a line geometry
  getGeometry: function() {
    if (!paintingToolManager.nodes) {
      return;
    }
    const nodes = paintingToolManager.nodes;
    //console.log("get geometry");
    const geometry = new THREE.Geometry();
    //console.log(nodes);
    nodes.forEach(function(node) {
      // console.log(node.Position);
      const position = AFRAME.utils.coordinates.parse(node.position);
      geometry.vertices.push(position);
    });
    return geometry;
  },

  addDecals: function() {
    if(!paintingToolManager.paintDecals)return;
    const nodes = paintingToolManager.nodes;
    if (paintingToolManager.spacing < 0) {
      var counter = 0;
      for (var j = 0; j < nodes.length; j++) {
        if (counter-- == 0) {
          var _DecalElement = new DecalElement(paintingToolManager.ObjectsMaterial, nodes[j], paintingToolManager);//createDecal(nodes[j]);
          if (DecalElement.mesh) {
            this.group.add(_DecalElement.mesh);
            paintingToolManager.BillboardObjects.push(_DecalElement);
            counter = -paintingToolManager.spacing;
          }
        }
      }
    } else {
      for (var j = 0; j < nodes.length; j++) {
        var vec3 = AFRAME.utils.coordinates.parse(nodes[j].position);
        vec3 = new THREE.Vector3(vec3.x, vec3.y, vec3.z);

        var vec3target = AFRAME.utils.coordinates.parse(nodes[j].position);
        vec3target = new THREE.Vector3(vec3target.x, vec3target.y, vec3target.z);

        if (j + 1 < nodes.length) {
          vec3target = AFRAME.utils.coordinates.parse(nodes[j + 1].position);
          vec3target = new THREE.Vector3(vec3target.x, vec3target.y, vec3target.z);
        }
        var distance = vec3.distanceTo(vec3target);
        var direction = new THREE.Vector3();
        direction.subVectors(vec3target, vec3).normalize();
        var originalPos = nodes[j].position;
        //console.log("originalPos", originalPos);
        for (var i = 0; i <= paintingToolManager.spacing; i++) {
          var perc =
            parseFloat(i) / parseFloat(paintingToolManager.spacing + 1.0);
          var lerpedpos = new THREE.Vector3();
          var _direction = direction.clone();
          lerpedpos.addVectors(
            vec3,
            _direction.multiplyScalar(distance * perc)
          );
          nodes[j].position = lerpedpos;
          var _DecalElement = new DecalElement(paintingToolManager.ObjectsMaterial, nodes[j], paintingToolManager);//createDecal(nnodes[j]);
          if (_DecalElement.mesh) {
            this.group.add(_DecalElement.mesh);
            paintingToolManager.BillboardObjects.push(_DecalElement);
          }
        }
        nodes[j].position = originalPos;
      }
    }
  },
  remove: function() {
    this.el.removeObject3D("group");

    // for (var i = this.group.children.length - 1; i >= 0; i--) {
    //   this.group.remove(this.group.children[i]);
    // }
    // this.BillboardObjects = [];
    // this.refreshBrush = 2;

    // this.LineMaterial.dispose();
    // paintingToolManager.ObjectsMaterial.dispose();
  }
});
