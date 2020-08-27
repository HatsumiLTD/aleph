import { DrawingToolMeshLineMaterial } from "./DrawingToolMeshLine";
import { DecalElement, DrawingToolManager } from "./DrawingToolManager";
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

AFRAME.registerComponent("al-drawing-tool", {
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
        drawingToolManager.NextPreset();
      }
    );

    this.debouncedGetIntersection = AFRAME.utils.throttle(this.getIntersection, this.data.minFrameMS, this);
  },

  update: function(_oldData) {
    console.log("update");
    //console.log("nodeNum", this.data.nodesNum);
    //console.log("preset", this.data.preset);
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
    //this.el.sceneEl.emit("al-drawing-tool-needs-refresh");
  },

  makeLine: function() {
    if (!this.geometry) {
      return;
    }
    if (this.geometry.vertices.length <= 0) {
      return null;
    }
    const line = new DrawingToolMeshLine();
    line.setGeometry(this.geometry, function(p) {
      return p;
    });
    return new THREE.Mesh(line.geometry, drawingToolManager.LineMaterial);
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
    drawingToolManager.timer += drawingToolManager.animationSpeed;
    if (drawingToolManager.timer >= 1.0) drawingToolManager.timer -= 1.0;
    if (drawingToolManager.timer <= -1.0) drawingToolManager.timer += 1.0;
    //--------run timer---------
    //-------Update the line material------
    if (drawingToolManager.LineMaterial) {
      if (drawingToolManager.LineMaterial.name != "No custom Shader") {
        // var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
        // this.Material.uniforms.colour.value = mcolour;//_BrushVariablesInput.mainColour;
        if (drawingToolManager.nodes.length &&
          drawingToolManager.LineMaterial.uniforms.pressures &&
          drawingToolManager.LineMaterial.uniforms.time
          ) {
          drawingToolManager.LineMaterial.uniforms.pressures.value = drawingToolManager.GetPressure();
          drawingToolManager.LineMaterial.uniforms.time.value = drawingToolManager.timer; //timer;
          drawingToolManager.LineMaterial.needsUpdate = true;
        }
      }
    }
    //-------Update the line material------
    //-------Update the decal objects(BillboardObjects)------
    if (drawingToolManager.BillboardObjects.length > 0) {
      drawingToolManager.BillboardObjects.forEach(function(obj) {
        obj.UpdateDelta(worldPos, drawingToolManager.timer);
      });
    }
    //-------Update the decal objects(BillboardObjects)------
  },

  // loop through the points to create a line geometry
  getGeometry: function() {
    if (!drawingToolManager.nodes) {
      return;
    }
    const nodes = drawingToolManager.nodes;
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
    console.log("add decals");
    if(!drawingToolManager.paintDecals)return;
    const nodes = drawingToolManager.nodes;
    if (drawingToolManager.spacing < 0) {
      var counter = 0;
      for (var j = 0; j < nodes.length; j++) {
        if (counter-- == 0) {
          var _DecalElement = new DecalElement(drawingToolManager.ObjectsMaterial, nodes[j], drawingToolManager);//createDecal(nodes[j]);
          if (DecalElement.mesh) {
            this.group.add(_DecalElement.mesh);
            drawingToolManager.BillboardObjects.push(_DecalElement);
            counter = -drawingToolManager.spacing;
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
        for (var i = 0; i <= drawingToolManager.spacing; i++) {
          var perc =
            parseFloat(i) / parseFloat(drawingToolManager.spacing + 1.0);
          var lerpedpos = new THREE.Vector3();
          var _direction = direction.clone();
          lerpedpos.addVectors(
            vec3,
            _direction.multiplyScalar(distance * perc)
          );
          nodes[j].position = lerpedpos;
          var _DecalElement = new DecalElement(drawingToolManager.ObjectsMaterial, nodes[j], drawingToolManager);//createDecal(nnodes[j]);
          if (_DecalElement.mesh) {
            this.group.add(_DecalElement.mesh);
            drawingToolManager.BillboardObjects.push(_DecalElement);
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
    // drawingToolManager.ObjectsMaterial.dispose();
  }
});
