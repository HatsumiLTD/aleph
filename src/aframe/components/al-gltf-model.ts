const AlGltfModelEvents = {
  LOADED: "al-model-loaded",
  ERROR: "al-model-error"
};

AFRAME.registerComponent("al-gltf-model", {
  schema: {
    src: { type: "model", default: "" },
    dracoDecoderPath: { type: "string", default: "" }
  },

  init() {
    this.bindMethods();
    this.addEventListeners();
    this.model = null;

    this.loader = new (THREE as any).GLTFLoader();
    this.dracoLoader = new (THREE as any).DRACOLoader();
    this.dracoLoader.setDecoderPath(this.data.dracoDecoderPath);
    this.loader.setDRACOLoader(this.dracoLoader);
  },

  bindMethods() {},

  addEventListeners() {},

  removeEventListeners() {},

  update(oldData) {
    const self = this;
    const el = this.el;
    const src = this.data.src;

    if (oldData && oldData.src !== src) {
      this.remove();

      this.loader.load(
        src,
        function gltfLoaded(gltfModel) {
          self.model = gltfModel.scene || gltfModel.scenes[0];
          self.model.animations = gltfModel.animations;
          // The "mesh" is actually a whole GLTF scene
          el.setObject3D("mesh", self.model);
          //FOR DEBUGGING_______please remove for production
          // self.model.children[0].position.set(0,0,-2.5);
          // self.model.position.set(0,0,0);
          //FOR DEBUGGING_______please remove for production

          el.sceneEl.emit(
            AlGltfModelEvents.LOADED,
            {
              format: "gltf",
              model: self.model
            },
            false
          );
        },
        undefined /* onProgress */,
        function gltfFailed(error) {
          const message =
            error && error.message
              ? error.message
              : "Failed to load glTF model";
          console.warn(message);
          el.sceneEl.emit(
            AlGltfModelEvents.ERROR,
            {
              format: "gltf",
              src
            },
            false
          );
        }
      );
    }
  },

  remove() {
    if (!this.model) {
      return;
    }
    this.removeEventListeners();
    this.el.removeObject3D("mesh");
  }
});
