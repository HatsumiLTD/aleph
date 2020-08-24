declare global {
  const THREE: typeof import("three");
  const MeshLineMaterial: any;
  const MeshLine: any;
  interface Window { drawingToolManager: any; }
}
window.drawingToolManager = window.drawingToolManager || {};
export {};
