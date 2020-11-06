import { FunctionalComponent, h } from "@stencil/core";

interface VRControlsProps extends FunctionalComponentProps {}

export const VRControls: FunctionalComponent<VRControlsProps> = _children =>
  (() => {
    return (
      <a-entity id="controllers" visible="false">
        <a-entity
          laser-controls="hand: left; model: false"
          raycaster="objects: [data-raycastable];"
          id="left-controller"
        >
          <a-entity>
            <a-cylinder
              al-palette-option="optionIndex: 0"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.14 0 0.08"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 1"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.16 0 -0.00"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 2"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.14 0 -0.08"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 3"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.09 0 -0.14"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 4"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.01 0 -0.16"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 5"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.08 0 -0.14"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 6"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.13 0 -0.09"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 7"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.16 0 -0.01"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 8"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.13 0 0.07"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 9"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.07 0 0.13"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 10"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.00 0 0.15"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              al-palette-option="optionIndex: 11"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.08 0 0.13"
              color="#000000"
            ></a-cylinder>
            <a-gltf-model
              src="url(https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2Fhatsumi-palette.glb?v=1598617782328)"
              position="0 0 0"
            ></a-gltf-model>
          </a-entity>
        </a-entity>
        <a-entity
          laser-controls="hand: right"
          raycaster="objects: [data-raycastable];"
          id="right-controller"
        />
      </a-entity>
    );
  })();
