declare global {
  const THREE: typeof import("three");
  const MeshLineMaterial: any;
  const MeshLine: any;
  // const DrawingToolMeshLine: any;
  // const DrawingToolMeshLineMaterial: any;
  interface Window {
    drawingToolManager: any;
  }
}
export {};
