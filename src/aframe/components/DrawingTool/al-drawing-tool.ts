// import { EventUtils } from "../../utils";
import { MeshLine } from "threejs-meshline";

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
    nodesNum: { type: "number" },
    timestamp: { type: "string" },
    raycasterEnabled: { type: "boolean" }
  },

  init: function() {
    console.log("init");
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

    this.debouncedGetIntersection = AFRAME.utils.throttle(this.getIntersection, this.data.minFrameMS, this);
  },

  update: function(_oldData) {
    console.log("nodeNum", this.data.nodesNum);
    this.group = new THREE.Group();
    this.setupMaterials();
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
    const line = new MeshLine();
    line.setGeometry(this.geometry, function(p) {
      return p;
    });
    return new THREE.Mesh(line.geometry, this.LineMaterial);
  },

  getIntersection: function() {
    console.log("get intersection");
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
    if (this.LineMaterial) {
      if (this.LineMaterial.name != "No custom Shader") {
        // var mcolour = new THREE.Color(_BrushVariablesInput.mainColour.r, _BrushVariablesInput.mainColour.g, _BrushVariablesInput.mainColour.b);
        // this.Material.uniforms.colour.value = mcolour;//_BrushVariablesInput.mainColour;
        if (drawingToolManager.nodes)
          this.LineMaterial.uniforms.pressures.value = drawingToolManager.GetPressure();
        this.LineMaterial.uniforms.time.value = drawingToolManager.timer; //timer;
        this.LineMaterial.needsUpdate = true;
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
    console.log("get geometry");
    const geometry = new THREE.Geometry();
    nodes.forEach(function(node) {
      // console.log(node.Position);
      const position = AFRAME.utils.coordinates.parse(node.position);
      geometry.vertices.push(position);
    });
    return geometry;
  },

  setupMaterials: function() {
    drawingToolManager.SetupMaterials();
    this.LineMaterial = drawingToolManager.LineMaterial;
    this.ObjectsMaterial = drawingToolManager.ObjectsMaterial;
  },

  addDecals: function() {
    const nodes = drawingToolManager.nodes;
    if (drawingToolManager.spacing < 0) {
      var counter = 0;
      for (var j = 0; j < nodes.length; j++) {
        if (counter-- == 0) {
          var _DecalElement = new DecalElement(this.ObjectsMaterial, nodes[j], drawingToolManager);//createDecal(nodes[j]);
          this.group.add(_DecalElement.mesh);
          drawingToolManager.BillboardObjects.push(_DecalElement);
          counter = -drawingToolManager.spacing;
        }
      }
    } else {
      for (var j = 0; j < nodes.length; j++) {
        var vec3 = nodes[j].position.clone();
        var vec3target = nodes[j].position.clone();
        if (j + 1 < nodes.length) vec3target = nodes[j + 1].position.clone();
        var distance = vec3.distanceTo(vec3target);
        var direction = new THREE.Vector3();
        direction.subVectors(vec3target, vec3).normalize();
        var originalPos = nodes[j].position;
        for (var i = 0; i <= drawingToolManager.spacing; i++) {
          var perc =
            parseFloat(i) / parseFloat(drawingToolManager.spacing + 1.0);
          var lerpedpos = new THREE.Vector3();
          var _direction = direction.clone();
          lerpedpos.addVectors(
            vec3,
            _direction.multiplyScalar(distance * perc)
          );
          nodes[j].Position = lerpedpos;
          var _DecalElement = new DecalElement(this.ObjectsMaterial, nodes[j], drawingToolManager);//createDecal(nnodes[j]);
          this.group.add(_DecalElement.mesh);
          drawingToolManager.BillboardObjects.push(_DecalElement);
        }
        nodes[j].Position = originalPos;
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
    // this.ObjectsMaterial.dispose();
  }
});
