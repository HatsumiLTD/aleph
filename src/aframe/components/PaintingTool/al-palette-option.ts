AFRAME.registerComponent("al-palette-option", {
  schema: {
    optionIndex: { type: "number", default: 0 },
  },

  init: function () {
    var el = this.el;
    //var self = this;

    el.addEventListener(
      "mousedown",
      evt => {
        this.el.sceneEl.emit(
          "al-palette-option-selected",
          {
            aframeEvent: {
              detail: {
                optionIndex: this.data.optionIndex,
                evt: evt
              }
            }
          },
          false
        );
      }
    );
  }

});