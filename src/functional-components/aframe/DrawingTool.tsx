import { FunctionalComponent, h } from "@stencil/core";
import { Constants } from "../../Constants";
import { ControlsType } from "../../enums";
import { AlNode } from "../../interfaces";
import { ThreeUtils } from "../../utils";

interface DrawingToolProps extends FunctionalComponentProps {
  nodes: Map<string, AlNode>;
}

export const DrawingTool: FunctionalComponent<DrawingToolProps> = (
  {
    nodes
  },
  _children
) =>
  (() => {
    window.nodes = nodes;
    return (
      <a-entity al-drawing-tool={`
        nodesNum: ${nodes.size}
      `} />
    );
  })();
