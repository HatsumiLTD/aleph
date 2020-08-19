import { EventUtils } from "../../utils";

const EVENTS = {
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  RAYCASTER_INTERSECTED: "raycaster-intersected",
  RAYCASTER_CLEARED: "raycaster-intersected-cleared",
  ADD_NODE: "al-add-node"
};

AFRAME.registerComponent('al-drawing-tool', {
  schema: {
    enabled: { default: false },
    minFrameMS: { type: "number", default: 15 },
    minLineDistance: { type: "number", default: 0.05 }
  },

	init: function () {
    this.state = {
      pointerDown: false
    };

    // Use events to figure out what raycaster is listening so we don't have to
    // hardcode the raycaster.
    this.el.addEventListener(EVENTS.RAYCASTER_INTERSECTED, evt => {
      this.raycaster = evt.detail.el;
    });
    this.el.addEventListener(EVENTS.RAYCASTER_CLEARED, evt => {
      this.raycaster = null;
    });

    const canvas = this.el.sceneEl.canvas;

    canvas.addEventListener(EVENTS.MOUSEDOWN, evt => {
      this.state.pointerDown = true;
    }, false);

    canvas.addEventListener(EVENTS.MOUSEUP, evt => {
      this.state.pointerDown = false;
    }, false);

    this.debouncedGetIntersection = EventUtils.debounce(
      this.getIntersection,
      this.data.minFrameMS
    ).bind(this);
  },

  getIntersection: function () {
    if (!this.data.enabled || !this.state.pointerDown) {
      return;
    }
    const intersection = this.raycaster.components.raycaster.getIntersection(this.el)
    if (!intersection) { 
      return;
    }

    if (this.state.lastIntersection) {
      const distance = this.state.lastIntersection.point.distanceTo(intersection.point);

      if (distance >= this.data.minLineDistance) {
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
    if (!this.raycaster || !this.data.enabled) { return; }  // Not intersecting.

    this.debouncedGetIntersection();
  }
});
