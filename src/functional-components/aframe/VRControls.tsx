import { FunctionalComponent, h } from "@stencil/core";

interface VRControlsProps extends FunctionalComponentProps {
}

export const VRControls: FunctionalComponent<VRControlsProps> = (
  _children
) =>
  (() => {
      return (
        <a-entity id="controllers">
          <a-entity
            laser-controls="hand: left"
            raycaster="objects: [data-raycastable];"
            id="left-controller"
          />
          <a-entity
            laser-controls="hand: right"
            raycaster="objects: [data-raycastable];"
            id="right-controller"
          />
        </a-entity>
      );
  })();
