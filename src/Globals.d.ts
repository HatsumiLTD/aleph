declare global {
  const THREE: typeof import("three");
  const MeshLineMaterial: any;
  const MeshLine: any;
  // const PaintingToolMeshLine: any;
  // const PaintingToolMeshLineMaterial: any;
  interface Window {
    paintingToolManager: any;
  }
}
export {};
