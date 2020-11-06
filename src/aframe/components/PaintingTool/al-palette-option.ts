// @ts-nocheck
AFRAME.registerComponent("al-palette-option", {
  schema: {
    optionIndex: { type: "number", default: 0 }
  },

  init: function() {
    var el = this.el;
    //var self = this;

    el.addEventListener("mousedown", evt => {
      var event = new CustomEvent("al-palette-option-selected", {
        detail: {
          optionIndex: this.data.optionIndex,
          evt: evt
        }
      });
      document.dispatchEvent(event);
    });
  }
});
