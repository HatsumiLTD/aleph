import { FunctionalComponent, h } from "@stencil/core";
import { ControlsType, DisplayMode, Orientation } from "../../enums";

interface SrcProps extends FunctionalComponentProps {
  controlsType: ControlsType;
  debugDraw: boolean;
  displayMode: DisplayMode;
  dracoDecoderPath: string;
  drawingEnabled: boolean;
  envMapPath: string;
  graphEnabled: boolean;
  nodes: Map<string, AlNode>;
  orientation: Orientation;
  slicesIndex: number;
  src: string;
  srcLoaded: boolean;
  volumeSteps: number;
  volumeWindowCenter: number;
  volumeWindowWidth: number;
  vrEnabled: boolean;
}

export const Src: FunctionalComponent<SrcProps> = (
  {
    cb,
    controlsType,
    debugDraw,
    displayMode,
    dracoDecoderPath,
    drawingEnabled,
    envMapPath,
    graphEnabled,
    nodes,
    orientation,
    slicesIndex,
    src,
    srcLoaded,
    volumeSteps,
    volumeWindowCenter,
    volumeWindowWidth,
    vrEnabled
  },
  _children
) =>
  (() => {
    if (!src) {
      return null;
    } else {
      if (window.drawingToolManager) {
        window.drawingToolManager.nodes = Array.from(nodes).map(x => x[1]);
        window.drawingToolManager.Reset();
      }

      switch (displayMode) {
        case DisplayMode.MESH: {
          return (
            <a-entity
              id="al-drawing-tool"
              data-raycastable
              al-node-spawner={`
                graphEnabled: ${graphEnabled};
                vrEnabled: ${vrEnabled};
              `}
              al-gltf-model={`
                src: url(${src});
                dracoDecoderPath: ${dracoDecoderPath};
              `}
              al-cube-env-map={`
                path: ${envMapPath ? envMapPath : ""};
              `}
              al-drawing-tool={`
                enabled: ${drawingEnabled};
                nodesNum: ${nodes.size};
                raycasterEnabled: ${drawingEnabled};
                stylingEnabled: ${!debugDraw};
              `}
              position="0 0 0"
              scale="1 1 1"
              ref={ref => cb(ref)}
            />
          );
        }
        case DisplayMode.SLICES: {
          return (
            <a-entity
              id="target-entity"
              data-raycastable
              al-node-spawner={`
                graphEnabled: ${graphEnabled};
                vrEnabled: ${vrEnabled};
              `}
              al-volume={`
                controlsType: ${controlsType};
                displayMode: ${displayMode};
                slicesIndex: ${slicesIndex};
                slicesOrientation: ${orientation};
                src: ${src};
                srcLoaded: ${srcLoaded};
                volumeSteps: ${volumeSteps};
                volumeWindowCenter: ${volumeWindowCenter};
                volumeWindowWidth: ${volumeWindowWidth};
              `}
              position="0 0 0"
              ref={ref => cb(ref)}
            />
          );
        }
        // This is seperate from the slice entity as it will store the volume render,
        // preventing long load times when switching mode
        // Node spawner is on the bounding box in
        // volume mode; as the "volume" is in a different scene
        case DisplayMode.VOLUME: {
          return (
            <a-entity
              id="target-entity"
              al-volume={`
                controlsType: ${controlsType};
                displayMode: ${displayMode};
                slicesIndex: ${slicesIndex};
                slicesOrientation: ${orientation};
                src: ${src};
                srcLoaded: ${srcLoaded};
                volumeSteps: ${volumeSteps};
                volumeWindowCenter: ${volumeWindowCenter};
                volumeWindowWidth: ${volumeWindowWidth};
              `}
              position="0 0 0"
              ref={ref => cb(ref)}
            />
          );
        }
        default: {
          return;
        }
      }
    }
  })();
