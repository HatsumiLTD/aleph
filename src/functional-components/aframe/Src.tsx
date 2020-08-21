import { FunctionalComponent, h } from "@stencil/core";
import { ControlsType, DisplayMode, Orientation } from "../../enums";

interface SrcProps extends FunctionalComponentProps {
  controlsType: ControlsType;
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
}

export const Src: FunctionalComponent<SrcProps> = (
  {
    cb,
    controlsType,
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
    volumeWindowWidth
  },
  _children
) =>
  (() => {
    if (!src) {
      return null;
    } else {
      if (window.drawingToolManager) {
        window.drawingToolManager.nodes = nodes;
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
                raycasterEnabled: ${drawingEnabled}
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
