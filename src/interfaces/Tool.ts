import { ToolType } from "../enums/ToolType";

export interface Tool {
  id: number;
  type: ToolType;
  position: string;
  color: string;
  selectedColor: string;
  scale: string;
  maxMeshDistance: number;
  focusObject: string;
}