import { Constants } from "../../Constants";
import { DisplayMode } from "../../enums";
import { EventUtils } from "../../utils";
import { AlControlEvents } from "../../utils/AlControlEvents";
import { VolumetricLoader } from "../../utils/VolumetricLoader";
import { BaseComponent } from "./BaseComponent";

export class AlVolumeEvents {
  public static ERROR: string = "al-volume-error";
  public static LOADED: string = "al-volume-loaded";
  public static MODE_CHANGED: string = "al-volume-mode-changed";
}

interface AlVolumeState {
  bufferScene: THREE.Scene;
  bufferSceneTexture: THREE.WebGLRenderTarget;
  bufferSceneTextureHeight: number;
  bufferSceneTextureWidth: number;
  debounce: boolean;
  frameTime: number;
  loaded: boolean;
  lutHelper: AMI.LutHelper;
  prevRenderTime: number;
  renderTask: number;
  // tslint:disable-next-line: no-any
  stack: any;
  stackhelper: AMI.StackHelper | AMI.VolumeRenderHelper;
  volumePower: number;
}

interface AlVolumeComponent extends BaseComponent {
  // tslint:disable-next-line: no-any
  handleStack(stack: any): void;
  onInteraction(event: CustomEvent): void;
  onInteractionFinished(event: CustomEvent): void;
  renderBufferScene(): void;
  tickFunction(): void;
  createBufferTexture(): void;
}

export default AFRAME.registerComponent("al-volume", {
  schema: {
    displayMode: { type: "string" },
    isHighRes: { type: "boolean", default: false },
    isWebGl2: { type: "boolean" },
    slicesIndex: { type: "number" },
    slicesOrientation: { type: "string" },
    slicesWindowCenter: { type: "number" },
    slicesWindowWidth: { type: "number" },
    src: { type: "string" },
    srcLoaded: { type: "boolean" },
    volumeWindowCenter: { type: "number" },
    volumeWindowWidth: { type: "number" },
    controlsType: { type: "string" }
  },

  init(): void {
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS,
      this
    );

    this.loader = new VolumetricLoader();

    this.state = {
      bufferScene: new THREE.Scene(),
      bufferSceneTextureHeight: this.el.sceneEl.canvas.clientHeight,
      bufferSceneTextureWidth: this.el.sceneEl.canvas.clientWidth,
      debounce: false,
      frameTime: window.performance.now(),
      loaded: false,
      prevRenderTime: 0,
      renderTask: 0,
      volumePower: 5,
    } as AlVolumeState;

    this.bindMethods();
    this.addEventListeners();

    this.createBufferTexture();

    this.debouncedRenderBufferScene = EventUtils.debounce(
      this.renderBufferScene,
      Constants.minFrameMS
    ).bind(this);
  },

  bindMethods(): void {
    this.addEventListeners = this.addEventListeners.bind(this);
    this.createBufferTexture = this.createBufferTexture.bind(this);
    this.getVolumePower = this.getVolumePower.bind(this);
    this.handleStack = this.handleStack.bind(this);
    this.onInteraction = this.onInteraction.bind(this);
    this.onInteractionFinished = this.onInteractionFinished.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.renderBufferScene = this.renderBufferScene.bind(this);
    this.rendererResize = this.rendererResize.bind(this);
  },

  addEventListeners() {
    this.el.sceneEl.addEventListener(
      "rendererresize",
      this.rendererResize,
      false
    );

    this.el.sceneEl.addEventListener(
      AlControlEvents.INTERACTION,
      this.onInteraction,
      false
    );

    this.el.sceneEl.addEventListener(
      AlControlEvents.INTERACTION_FINISHED,
      this.onInteractionFinished,
      false
    );
  },

  removeEventListeners(): void {
    this.el.sceneEl.removeEventListener("rendererresize", this.rendererResize);

    this.el.sceneEl.removeEventListener(
      AlControlEvents.INTERACTION,
      this.onInteraction
    );

    this.el.sceneEl.removeEventListener(
      AlControlEvents.INTERACTION_FINISHED,
      this.onInteractionFinished
    );
  },

  createBufferTexture(): void {
    this.state.bufferSceneTexture = new THREE.WebGLRenderTarget(
      this.state.bufferSceneTextureWidth,
      this.state.bufferSceneTextureHeight,
      { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
    );
    (this.el.sceneEl
      .object3D as THREE.Scene).background = this.state.bufferSceneTexture.texture;
  },

  onInteraction(_event: CustomEvent): void {
    if (this.state.stackhelper && _event.detail.needsRender) {
      this.state.renderTask = 2;
    }
  },

  onInteractionFinished(_event: CustomEvent): void {
    if (this.state.stackhelper && _event.detail.needsRender) {
      this.state.renderTask = Math.pow(2, this.state.volumePower);
    }

    this.state.debounce = false;
  },

  getVolumePower(): number {
    // 128 steps for desktop (7), 32 steps for mobile (5)
    let power;

    if (AFRAME.utils.device.isMobile()) {
      power = 5;
    } else {
      power = 7;
    }

    return Math.pow(2, power + (this.data.isHighRes ? 1 : 0));
  },

  rendererResize(): void {
    const state = this.state as AlVolumeState;

    const needsResize =
      state.bufferSceneTextureWidth !== this.el.sceneEl.canvas.clientWidth ||
      state.bufferSceneTextureHeight !== this.el.sceneEl.canvas.clientHeight;

    if (needsResize && this.data.displayMode === DisplayMode.VOLUME) {
      state.bufferSceneTextureWidth = this.el.sceneEl.canvas.clientWidth;
      state.bufferSceneTextureHeight = this.el.sceneEl.canvas.clientHeight;

      this.createBufferTexture();
      this.state.renderTask = this.getVolumePower();
    }
  },

  renderBufferScene(): void {
    if (this.data.displayMode === DisplayMode.VOLUME) {
      this.state.stackhelper.steps = this.state.renderTask;

      const prev = window.performance.now();

      this.el.sceneEl.renderer.render(
        this.state.bufferScene,
        this.el.sceneEl.camera,
        this.state.bufferSceneTexture
      );

      const post = window.performance.now();

      this.state.prevRenderTime = post - prev;
      this.state.renderTask = 0;
    }
  },

  // tslint:disable-next-line: no-any
  handleStack(stack: any): void {
    const state = this.state as AlVolumeState;
    const el = this.el;

    state.stack = stack;

    switch (this.data.displayMode) {
      case DisplayMode.SLICES: {
        state.stackhelper = new AMI.StackHelper(state.stack);

        state.stackhelper.bbox.visible = false;
        state.stackhelper.border.color = Constants.colorValues.blue;
        break;
      }
      case DisplayMode.VOLUME: {
        // Get LUT Canvas
        const lutCanvases: HTMLElement = el.sceneEl.parentEl.querySelector(
          "#lut-canvases"
        );
        // Create the LUT Helper
        state.lutHelper = new AMI.LutHelper(lutCanvases);
        state.lutHelper.luts = AMI.LutHelper.presetLuts();
        state.lutHelper.lutsO = AMI.LutHelper.presetLutsO();
        state.stackhelper = new AMI.VolumeRenderHelper(state.stack);
        state.stackhelper.textureLUT = state.lutHelper.texture;
        state.stackhelper.steps = this.getVolumePower();
        break;
      }
      default: {
        break;
      }
    }

    // If a hot reload of the display, reset the mesh
    if (el.object3DMap.mesh) {
      el.removeObject3D("mesh");
    }

    // If slices mode, set stackhelper as the mesh
    if (this.data.displayMode === DisplayMode.SLICES) {
      el.setObject3D("mesh", this.state.stackhelper);
    } else {
      // Else place it in the buffer scene
      if (this.state.bufferScene.children.length) {
        this.state.bufferScene.remove(this.state.bufferScene.children[0]);
      }

      this.state.bufferScene.add(this.state.stackhelper);
    }

    if (!this.state.loaded) {
      el.sceneEl.emit(AlVolumeEvents.LOADED, state.stackhelper, false);
      this.state.loaded = true;
    }

    el.sceneEl.emit(AlVolumeEvents.MODE_CHANGED, state.stackhelper, false);

  },

  // tslint:disable-next-line: no-any
  update(oldData: any): void {
    const state = this.state;
    const el = this.el;

    if (!this.data.src) {
      return;
    }

    if (oldData && oldData.src !== this.data.src) {
      this.loader.load(this.data.src, el).then(stack => {
        this.handleStack(stack);
      });
    } else if (
      oldData &&
      oldData.displayMode !== this.data.displayMode &&
      state.stack
    ) {
      this.removeEventListeners();
      this.handleStack(state.stack);
      this.addEventListeners();

      if (this.data.displayMode === DisplayMode.VOLUME) {
        this.createBufferTexture();
        // allow some time for the stackhelper to reorient itself
        setTimeout(() => {
          this.state.renderTask = Math.pow(2, this.state.volumePower);
        }, 500);
      } else {
        (this.el.sceneEl.object3D as THREE.Scene).background = null;
      }
    }

    if (
      oldData &&
      oldData.controlsType &&
      oldData.controlsType !== this.data.controlsType
    ) {
      this.state.renderTask = Math.pow(2, this.state.volumePower);
    }

    if (
      oldData &&
      oldData.volumeWindowCenter &&
      oldData.volumeWindowCenter !== this.data.volumeWindowCenter
    ) {
      this.state.debounce = true;
      this.state.renderTask = Math.pow(2, this.state.volumePower);
    }

    if (
      oldData &&
      oldData.volumeWindowWidth &&
      oldData.volumeWindowWidth !== this.data.volumeWindowWidth
    ) {
      this.state.debounce = true;
      this.state.renderTask = Math.pow(2, this.state.volumePower);
    }
  },

  tickFunction(): void {
    if (!this.state.stackhelper) {
      return;
    }

    if (this.data.displayMode === DisplayMode.SLICES) {
      this.el.setObject3D("mesh", this.state.stackhelper);
    }

    if (this.state.renderTask > 0 && !this.state.debounce) {
      this.renderBufferScene();
    }
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.el.removeObject3D("mesh");
    this.removeEventListeners();

    (this.el.sceneEl.object3D as THREE.Scene).background = null;
  }
} as AlVolumeComponent);
