import { FunctionalComponent, h } from "@stencil/core";

interface VRControlsProps extends FunctionalComponentProps {}

export const VRControls: FunctionalComponent<VRControlsProps> = _children =>
  (() => {
    return (
      <a-entity id="controllers" visible="false">
        <a-entity
          laser-controls="hand: left; model: false"
          raycaster="objects: nill; far: 0.;"
          line="opacity: 0.0"
          id="left-controller"
        >
          <a-entity>
            {/* outer circle starting from bottom and third button on the clockwise  */}
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 0"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.14 0 0.08"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 1"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.16 0 -0.00"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 2"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.14 0 -0.08"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 3"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.09 0 -0.14"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 4"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.01 0 -0.16"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 5"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.08 0 -0.14"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 6"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.13 0 -0.09"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 7"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.16 0 -0.01"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 8"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.13 0 0.07"
              color="#000000"
            ></a-cylinder>

            {/* bottom three buttons (clockwise)  */}
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 9"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.07 0 0.13"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 10"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="0.00 0 0.15"
              color="#000000"
            ></a-cylinder>
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 11"
              data-raycastable
              scale="0.028 0.01 0.028"
              position="-0.08 0 0.13"
              color="#000000"
            ></a-cylinder>

            {/* inner bottom and goes clockwise round  */}
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 12"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="0.00 0.011 0.079"
              rotation="0 90 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 13"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="-0.04 0.011 0.069"
              rotation="0 58 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 14"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="-0.066 0.011 0.038"
              rotation="0 31 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 15"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="-0.079 0.011 0.0"
              rotation="0 0 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 16"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="-0.068 0.011 -0.04"
              rotation="0 -25.8 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 17"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="-0.04 0.011 -0.07"
              rotation="0 -59.20 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 18"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="0.00 0.011 -0.079"
              rotation="0 90 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 19"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="0.04 0.011 -0.068"
              rotation="0 58 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 20"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="0.07 0.011 -0.041"
              rotation="0 31 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 21"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="0.079 0.011 0.0"
              rotation="0 0 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 22"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="0.068 0.011 0.038"
              rotation="0 -25.8 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 23"
              segments-radial="6"
              data-raycastable
              scale="0.024 0.021 0.017"
              position="0.04 0.011 0.069"
              rotation="0 -59.2 0"
              color="crimson"
            ></a-cylinder>

            {/* center buttons  */}
            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 24"
              segments-radial="3"
              data-raycastable
              scale="0.036 0.025 0.023"
              position="0.006 0.0 0.023"
              rotation="0 -167.82 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 25"
              segments-radial="3"
              data-raycastable
              scale="0.036 0.025 0.023"
              position="-0.023 0.0 -0.009"
              rotation="0 70 0"
              color="crimson"
            ></a-cylinder>

            <a-cylinder
              visible="false"
              al-palette-option="optionIndex: 26"
              segments-radial="3"
              data-raycastable
              scale="0.036 0.025 0.023"
              position="0.019 0.0 -0.017"
              rotation="0 -51.01 0"
              color="crimson"
            ></a-cylinder>

            <a-gltf-model
              src="url(https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2Fnew-palette-transparent.glb?v=1605025292884)"
              position="0 0 0"
            ></a-gltf-model>
          </a-entity>
        </a-entity>
        <a-entity
          laser-controls="hand: right"
          raycaster="objects: [data-raycastable];"
          sound="src: url(https://cdn.glitch.com/2455c8e2-7d7f-4dcf-9c98-41176d86971f%2FPaintBrushSoundLoop.wav?v=1605086943786); positional: true; loop: true;"
          id="right-controller"
        />
      </a-entity>
    );
  })();
