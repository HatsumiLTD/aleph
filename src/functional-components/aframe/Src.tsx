import { FunctionalComponent, h } from "@stencil/core";
import { ControlsType, DisplayMode, Orientation } from "../../enums";
import { AlNode } from "../../interfaces";

interface SrcProps extends FunctionalComponentProps {
  controlsType: ControlsType;
  debugDraw: boolean;
  displayMode: DisplayMode;
  dracoDecoderPath: string;
  paintingEnabled: boolean;
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
    displayMode,
    dracoDecoderPath,
    paintingEnabled,
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
      switch (displayMode) {
        case DisplayMode.MESH: {
          return (
            <a-entity
              id="model"
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
              al-painting-tool={`
                enabled: ${paintingEnabled};
                nodesNum: ${nodes.size};
                raycasterEnabled: ${paintingEnabled};
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
