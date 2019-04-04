import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils } from "../utils";

interface AlEdgeState {
  selected: boolean;
  hovered: boolean;
  geometry: THREE.CylinderGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
}

interface AlEdgeObject extends AframeComponent {
  update(oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  elMouseDown(_event: CustomEvent): void;
  elRaycasterIntersected(_event: CustomEvent): void;
  elRaycasterIntersectedCleared(_event: CustomEvent): void;
}

export class AlEdge implements AframeRegistry {
  public static get Object(): AlEdgeObject {
    return {
      schema: {
        selected: { type: "boolean" },
        node2: { type: "vec3" },
        height: { type: "number" },
        radius: { type: "number" }
      },

      bindListeners(): void {
        this.elMouseDown = this.elMouseDown.bind(this);
        this.elRaycasterIntersected = this.elRaycasterIntersected.bind(this);
        this.elRaycasterIntersectedCleared = this.elRaycasterIntersectedCleared.bind(
          this
        );
        this.createMesh = this.createMesh.bind(this);
      },

      addListeners(): void {
        this.el.addEventListener("mousedown", this.elMouseDown, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected,
          { capture: false, once: false, passive: true }
        );
        this.el.addEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared,
          { capture: false, once: false, passive: true }
        );
      },

      removeListeners(): void {
        this.el.removeEventListener("mousedown", this.elMouseDown);
        this.el.removeEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected
        );
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared
        );
      },

      elMouseDown(_event: CustomEvent): void {
        ThreeUtils.waitOneFrame(() => {
          this.el.sceneEl.emit(AlEdgeEvents.SELECTED, { id: this.el.id }, true);
        });
      },

      elRaycasterIntersected(_event: CustomEvent): void {
        let state = this.state as AlEdgeState;
        state.hovered = true;
        this.el.sceneEl.emit(
          AlEdgeEvents.INTERSECTION,
          { id: this.el.id },
          true
        );
      },

      elRaycasterIntersectedCleared(_event: CustomEvent): void {
        let state = this.state as AlEdgeState;
        state.hovered = false;
        this.el.sceneEl.emit(AlEdgeEvents.INTERSECTION_CLEARED, {}, true);
      },

      createMesh() {
        const geometry = new THREE.CylinderGeometry(
          this.data.radius,
          this.data.radius,
          this.data.height,
          8,
          8,
          false
        );
        let material = new THREE.MeshBasicMaterial();
        material.depthTest = false;
        const mesh = new THREE.Mesh(geometry, material);

        this.state.geometry = geometry;
        this.state.material = material;
        this.state.mesh = mesh;

        this.el.setObject3D("mesh", mesh);
      },

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );
        this.bindListeners();
        this.addListeners();

        this.state = {
          selected: true,
          hovered: false
        } as AlEdgeState;
      },

      update(oldData): void {
        let state = this.state as AlEdgeState;
        state.selected = this.data.selected;

        // If height or radius has changed, create a new mesh
        if (
          oldData &&
          (oldData.radius !== this.data.radius ||
            oldData.height !== this.data.height)
        ) {
          this.createMesh();
          const mesh = this.state.mesh as THREE.Mesh;
          mesh.lookAt(ThreeUtils.objectToVector3(this.data.node2));
          //mesh.rotateX(60);
          //mesh.rotateY(60);
          // mesh.rotateZ(60);
        }
      },

      tickFunction(): void {
        let state = this.state as AlEdgeState;

        if (state.hovered) {
          state.material.color = new THREE.Color(Constants.edgeColors.hovered);
        } else if (state.selected) {
          state.material.color = new THREE.Color(Constants.edgeColors.selected);
        } else {
          state.material.color = new THREE.Color(Constants.edgeColors.normal);
        }
      },

      tick() {
        this.tickFunction();
      },

      remove(): void {
        this.removeListeners();
        this.el.removeObject3D("mesh");
      }
    } as AlEdgeObject;
  }

  public static get Tag(): string {
    return "al-edge";
  }
}

export class AlEdgeEvents {
  static SELECTED: string = "al-edge-selected";
  static INTERSECTION: string = "al-edge-intersection";
  static INTERSECTION_CLEARED: string = "al-edge-intersection-cleared";
}
