// @ts-nocheck
AFRAME.registerComponent("al-painting-tool-audio", {
  schema: {
    enabled: { default: true }
  },

  init: function() {
    this.sfx_brushMasterVolume = 1;
    this.sfx_brushVolume = 0;
    this.sfx_oldbrushVolume = -1;

    this.group = new THREE.Group();
    this.el.setObject3D("group", this.group);
    this.makeSceneElements();
    this.clock = new THREE.Clock();
  },
  makeSceneElements: function() {
    const listener = this.el.sceneEl.audioListener;
    const audioLoader = new THREE.AudioLoader();
    // --
    const BackgroundMusic = new THREE.Audio(listener);
    audioLoader.load(
      "https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FConstellationshrt.mp3?v=1605092737200",
      function(buffer) {
        BackgroundMusic.setBuffer(buffer);
        BackgroundMusic.setLoop(true);
        BackgroundMusic.setVolume(0.8);
      }
    );
    const VoiceOverIntro = new THREE.Audio(listener);
    audioLoader.load(
      "https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FGoAlltheWay.mp3?v=1605095715762",
      function(buffer) {
        VoiceOverIntro.setBuffer(buffer);
        VoiceOverIntro.setLoop(false);
        VoiceOverIntro.setVolume(1.0);
      }
    );

    this.VRMode = false;
    this.el.sceneEl.addEventListener("enter-vr", function() {
      console.log("ENTERED VR");
      this.VRMode = true;
      BackgroundMusic.play();
      VoiceOverIntro.play();
    });
    this.el.sceneEl.addEventListener("exit-vr", function() {
      console.log("EXIT VR");
      this.VRMode = false;
      BackgroundMusic.stop();
      VoiceOverIntro.stop();
    });
  },
  // tick: function () {
  //     if (!this.data.enabled) return;
  //     console.log("audio tick");
  // },
  remove: function() {
    this.el.removeObject3D("group");
  }
});