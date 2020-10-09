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
        this.VRMode = false;
        this.el.sceneEl.addEventListener("enter-vr", function () {
            console.log("ENTERED VR");
            this.VRMode = true;
        });
        this.el.sceneEl.addEventListener("exit-vr", function () {
            console.log("EXIT VR");
            this.VRMode = false;
        });
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
        canvas.addEventListener(EVENTS.MOUSEDOWN, evt => {
            this.state.pointerDown = true;
            this.state.firstpointerDownIntersection = -999;
        }, false);
        canvas.addEventListener(EVENTS.MOUSEUP, evt => {
            this.state.pointerDown = false;
            this.state.firstpointerDownIntersection = -999;
            paintingToolManager.ResetCurrentBrush();
        }, false);

        // vr controller listeners
        const rightController = document.getElementById("right-controller");
        this.el.addEventListener(EVENTS.MOUSEDOWN, evt => {
            console.log("trigger down");
            this.state.firstpointerDownIntersection = -999;
            this.state.pointerDown = true;
        });
        this.el.addEventListener(EVENTS.MOUSEUP, evt => {
            console.log("trigger up");
            this.state.pointerDown = false;
            this.state.firstpointerDownIntersection = -999;
            paintingToolManager.ResetCurrentBrush();
        });

        rightController.addEventListener(EVENTS.ABUTTONDOWN, evt => {
            paintingToolManager.NextPreset();
        });
        rightController.addEventListener(EVENTS.BBUTTONDOWN, evt => {
            paintingToolManager.PrevPreset();
        });
        //experimental, change brush size with on axis event
        // this.el.sceneEl.addEventListener(EVENTS.ADD_NODE,  evt => {
        //     console.log("Node placed");
        //    this.runAnimation();
        // }, false);

        this.CurrentWidth = 1.0;
        rightController.addEventListener('changeBrushSizeAbs', function (evt) {
            if (evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0 || self.previousAxis === evt.detail.axis[1]) { return; }
            var delta = evt.detail.axis[1] / 300;
            var value = THREE.Math.clamp(self.el.getAttribute('brush').size - delta, 0.0, 1.0);
            this.CurrentWidth += value*0.1;
            this.CurrentWidth = THREE.Math.clamp(this.CurrentWidth, 0.1, 1.0);
            this.changeCurrentWidth(this.CurrentWidth);
        });
        //experimental, change brush colour with on axis event
        this.CurrentColourHue = 0.0;
        rightController.addEventListener('changeBrushSizeAbs', function (evt) {
            if (evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0 || self.previousAxis === evt.detail.axis[1]) { return; }
            var delta = evt.detail.axis[0] / 300;
            var value = THREE.Math.clamp(self.el.getAttribute('brush').size - delta, 0.0, 1.0);
            this.CurrentColourHue += value;
            this.CurrentColourHue = THREE.Math.clamp(this.CurrentColourHue, 0.1, 100.0);
            var newColour = String("hsl(" + this.CurrentColourHue + "," + 90 + "%" + "," + 70 + "%" + ")");
            this.changeCurrentColour(new THREE.Color(newColour));
        });

        this.debouncedGetIntersection = AFRAME.utils.throttle(this.getIntersection, this.data.minFrameMS, this);
        // vr controller listeners
        this.group = new THREE.Group();
        this.el.setObject3D("group", this.group);
        this.makeSceneElements();
        this.clock = new THREE.Clock();
    },
    update: function (_oldData) {
        console.log("update");
        if (!this.data.enabled) {
            return;
        }
        this.geometry = this.getGeometry();
        paintingToolManager.UpdateBrush(this.group, this.geometry);
        this.addDecals();
    },
    forceTouchUp: function () {
        this.state.pointerDown = false;
        this.state.firstpointerDownIntersection = -999;
        paintingToolManager.ResetCurrentBrush();
    },
    changeCurrentColour: function (_colour) {
        paintingToolManager.currentMaterialCache.colour = _colour;
    },
    //_width should be a normal float 0.0 to 1.0
    changeCurrentWidth: function (_width) {
        var _scaler = 0.01;
        paintingToolManager.currentMaterialCache.lineWidth = _width * _scaler;
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
            map: (new THREE.TextureLoader).load("https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FHatsumiBackGrounds_13.jpg?v=1601458890388"),
        }));
        backgroundSphere.geometry.scale(-1, 1, 1);
        this.el.sceneEl.object3D.add(backgroundSphere);
        //add a background sphere-----
    },
    getIntersection: function () {
        if (!this.data.enabled || !this.state.pointerDown) {
            return;
        }
        const intersection = this.raycaster.components.raycaster.getIntersection(this.el);
        if (!intersection) {
            return;
        }
        if (this.state.lastIntersection) {
            const distance = this.state.lastIntersection.point.distanceTo(intersection.point);
            if (distance >= this.data.minLineSegmentLength) {
                this.el.sceneEl.emit(EVENTS.ADD_NODE, {
                    aframeEvent: {
                        detail: {
                            intersectedEl: this.el,
                            intersection: intersection
                        }
                    }
                }, false);
                this.state.lastIntersection = intersection;
            }
        }
        else {
            this.state.lastIntersection = intersection;
        }
    },
    tick: function () {
        //console.log("tick");
        if (this.data.raycasterEnabled &&
            this.raycaster &&
            (this.state.firstpointerDownIntersection < 2 || this.VRMode)) {
            this.debouncedGetIntersection();
        }
        else {
            if (this.state.firstpointerDownIntersection > -999)
                this.state.firstpointerDownIntersection++;
        } // Not intersecting.


        this.runAnimation();
    },
    runAnimation: function(){
         ////get camera position--------
         var scene = this.el.sceneEl;
         var cameraEl = scene.camera;
         var worldPos = new THREE.Vector3();
         worldPos.setFromMatrixPosition(cameraEl.matrixWorld);
         // ////get camera position--------
        //--------run timer---------
        var delta = this.clock.getDelta() * 20.0;
        paintingToolManager.timer += delta * paintingToolManager.animationSpeed;
        if (paintingToolManager.timer >= 1.0)
            paintingToolManager.timer -= 1.0;
        if (paintingToolManager.timer <= -1.0)
            paintingToolManager.timer += 1.0;
        //--------run timer---------
        // //-------Update the line materials------
        //------need to find some way to pass pressuers into the mesh line (probably with vertext), not this way.
        if (this.state.pointerDown) {
            var lineLength = (paintingToolManager.NodeRangeEnding - paintingToolManager.NodeRangeBegining) / (paintingToolManager.geoCount-1);
            if (lineLength > 1.0)
                this.forceTouchUp();
            paintingToolManager.currentMaterialCache.lineLength = THREE.Math.clamp(lineLength * 0.9, 0.01, 1.0);
            // paintingToolManager.currentMaterialCache.pressures = paintingToolManager.GetPressure();
            //console.log(paintingToolManager.materialsCache.length + ":paintingToolManager.materialsCache[i].lineLength: " + paintingToolManager.currentMaterialCache.lineLength);
        }
        //------need to find some way to pass pressuers into the mesh line (probably with vertext), not this way.
        for (var i = 0; i < paintingToolManager.materialsCache.length; i++) {
            if (paintingToolManager.materialsCache[i].lineMaterial) {
                if (paintingToolManager.materialsCache[i].lineMaterial.name != "No custom Shader") {
                    if (paintingToolManager.materialsCache[i].lineMaterial.uniforms.time) {
                        var _time =  (paintingToolManager.timer + paintingToolManager.materialsCache[i].startTime) % 1.0;
                        paintingToolManager.materialsCache[i].lineMaterial.uniforms.time.value = _time;
                        paintingToolManager.materialsCache[i].lineMaterial.uniforms.lineWidth.value = paintingToolManager.materialsCache[i].lineWidth;
                        //paintingToolManager.materialsCache[i].lineMaterial.uniforms.color.value = new THREE.Color(Math.random(), Math.random(), Math.random() );
                        paintingToolManager.materialsCache[i].lineMaterial.uniforms.lengthNormal.value = paintingToolManager.materialsCache[i].lineLength;
                        // if(paintingToolManager.materialsCache[i].lineMaterial.uniforms.pressures)
                        //   paintingToolManager.materialsCache[i].lineMaterial.uniforms.pressures.value = paintingToolManager.materialsCache[i].pressures;
                        paintingToolManager.materialsCache[i].lineMaterial.needsUpdate = true;
                    }
                }
                else {
                    paintingToolManager.materialsCache[i].lineMaterial.uniforms.color.value = paintingToolManager.materialsCache[i].colour;
                    paintingToolManager.materialsCache[i].lineMaterial.uniforms.lineWidth.value = paintingToolManager.materialsCache[i].lineWidth;
                    paintingToolManager.materialsCache[i].lineMaterial.uniforms.lengthNormal.value = paintingToolManager.materialsCache[i].lineLength;
                    paintingToolManager.materialsCache[i].lineMaterial.needsUpdate = true;
                }
            }
        }
        //-------Update the decal objects(BillboardObjects)------
        if (paintingToolManager.BillboardObjects.length > 0) {
            paintingToolManager.BillboardObjects.forEach(function (obj) {
                obj.UpdateDelta(worldPos, paintingToolManager.timer);
            });
        }
        //-------Update the decal objects(BillboardObjects)------
    },
    // loop through the points to create a line geometry
    getGeometry: function () {
        if (!paintingToolManager.nodes) {
            return;
        }
        const nodes = paintingToolManager.nodes;
        const geometry = new THREE.Geometry();
        //get a node range to read from.
        paintingToolManager.NodeRangeEnding = paintingToolManager.nodes.length + 1;
        //add some drawingdistance from body if in VR mode
        var drawingdistance = true;//!this.VRMode;disabled for now
        var int_counter = 0;
        nodes.forEach(function (node) {
            if (int_counter > paintingToolManager.NodeRangeBegining &&
                int_counter < paintingToolManager.NodeRangeEnding) {
                const position = AFRAME.utils.coordinates.parse(node.position);
                if (drawingdistance) {
                    //add some drawingdistance from body
                    var _position = new THREE.Vector3(position.x, position.y, position.z);
                    var norml = paintingToolManager.stringToVector3(node.normal); //should be "ThreeUtils.stringToVector3(node.normal)", but I cannot find how to call it
                    _position.add(norml.multiplyScalar(0.01));
                    geometry.vertices.push(_position);
                    //add some drawingdistance from body
                }
                else {
                    geometry.vertices.push(position);
                }
            }
            int_counter++;
        });
        return geometry;
    },
    addDecals: function () {
        console.log("add decals");
        if (!paintingToolManager.paintDecals)
            return;
        const nodes = paintingToolManager.nodes;
        if (paintingToolManager.spacing < 0) {
            var counter = 0;
            for (var j = paintingToolManager.NodeRangeBegining; j < nodes.length; j++) {
                if (counter-- == 0) {
                    var vec3 = AFRAME.utils.coordinates.parse(nodes[j].position);
                    var originalPos = nodes[j].position;
                    nodes[j].position = vec3;
                    var _DecalElement = new DecalElement(paintingToolManager.ObjectsMaterial, nodes[j], paintingToolManager);
                    if (_DecalElement.mesh && !nodes[j].nodeAttached) {
                        this.group.add(_DecalElement.mesh);
                        paintingToolManager.BillboardObjects.push(_DecalElement);
                        nodes[j].nodeAttached = true;
                    }
                    counter = -paintingToolManager.spacing;
                    nodes[j].position = originalPos;
                }
            }
        }
        else {
            for (var j = paintingToolManager.NodeRangeBegining; j < nodes.length; j++) {
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
                    if (!nodes[j].nodeAttached) {
                        var perc = parseFloat(i) / parseFloat(paintingToolManager.spacing + 1.0);
                        var lerpedpos = new THREE.Vector3();
                        var _direction = direction.clone();
                        lerpedpos.addVectors(vec3, _direction.multiplyScalar(distance * perc));
                        nodes[j].position = lerpedpos;
                        var _DecalElement = new DecalElement(paintingToolManager.ObjectsMaterial, nodes[j], paintingToolManager); //createDecal(nnodes[j]);
                        if (_DecalElement.mesh) {
                            this.group.add(_DecalElement.mesh);
                            paintingToolManager.BillboardObjects.push(_DecalElement);
                            nodes[j].nodeAttached = true;
                        }
                    }
                }
                nodes[j].position = originalPos;
            }
        }
    },
    remove: function () {
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
