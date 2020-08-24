/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  AlAngle,
  AlEdge as AlEdge1,
  AlGraph,
  AlNode as AlNode1,
} from './interfaces';
import {
  AlAngle as AlAngle1,
  AlEdge,
  AlNode,
} from './interfaces/index.js';
import {
  ControlsType,
  DisplayMode,
  Orientation,
  Units,
} from './enums/index.js';
import {
  ControlsType as ControlsType1,
  DisplayMode as DisplayMode2,
  Material,
  Orientation as Orientation1,
  Units as Units1,
} from './enums';
import {
  DisplayMode as DisplayMode1,
} from './enums/DisplayMode';

export namespace Components {
  interface AlAngleEditor {
    'angle': [string, AlAngle];
  }
  interface AlConsole {
    'graph': string | null;
    'tabSize': number;
  }
  interface AlControlPanel {
    'angles': Map<string, AlAngle> | null;
    'boundingBoxEnabled': boolean;
    'consoleTabEnabled': boolean;
    'controlsType': ControlsType;
    'displayMode': DisplayMode;
    'drawingEnabled': boolean;
    'edges': Map<string, AlEdge> | null;
    'graphEnabled': boolean;
    'graphTabEnabled': boolean;
    'nodes': Map<string, AlNode> | null;
    'orientation': Orientation;
    'selected': string | null;
    'settingsTabEnabled': boolean;
    'slicesBrightness': number;
    'slicesContrast': number;
    'slicesIndex': number;
    'slicesMaxIndex': number;
    'srcTabEnabled': boolean;
    'tabContentHeight': string | null;
    'units': Units;
    'url': string | null;
    'urls': Map<string, string> | null;
    'volumeBrightness': number;
    'volumeContrast': number;
    'volumeSteps': number;
    'volumeStepsHighEnabled': boolean;
  }
  interface AlEdgeEditor {
    'edge': [string, AlEdge];
  }
  interface AlGraphEditor {
    'angles': Map<string, AlAngle> | null;
    'drawingEnabled': boolean;
    'edges': Map<string, AlEdge> | null;
    'graphEnabled': boolean;
    'graphVisible': boolean;
    'node': [string, AlNode];
    'nodes': Map<string, AlNode> | null;
    'selected': string | null;
    'units': Units;
  }
  interface AlGraphSettings {
    'drawingEnabled': boolean;
    'graphEnabled': boolean;
    'graphVisible': boolean;
    'units': Units;
  }
  interface AlNodeEditor {
    'node': [string, AlNode];
  }
  interface AlNodeList {
    'nodes': Map<string, AlNode> | null;
    'selected': string | null;
  }
  interface AlSettings {
    'displayMode': DisplayMode;
    'orientation': Orientation;
    'slicesBrightness': number;
    'slicesContrast': number;
    'slicesIndex': number;
    'slicesMaxIndex': number;
    'volumeBrightness': number;
    'volumeContrast': number;
    'volumeSteps': number;
    'volumeStepsHighEnabled': boolean;
  }
  interface AlTabs {
    /**
    * Get the currently selected tab.
    */
    'getSelected': () => Promise<string>;
    /**
    * Get a specific tab by the value of its `tab` property or an element reference.
    * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
    */
    'getTab': (tab: any) => Promise<any>;
    /**
    * Select a tab by the value of its `tab` property or an element reference.
    * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
    */
    'select': (tab: any) => Promise<boolean>;
  }
  interface AlUrlPicker {
    'url': string | null;
    'urls': Map<string, string> | null;
  }
  interface AlViewControls {
    'boundingBoxEnabled': boolean;
    'controlsType': ControlsType;
  }
  interface AlViewer {
    'clearGraph': () => Promise<void>;
    'deleteAngle': (angleId: string) => Promise<void>;
    'deleteEdge': (edgeId: string) => Promise<void>;
    'deleteNode': (nodeId: string) => Promise<void>;
    'dracoDecoderPath': string | null;
    'envMapPath': string | null;
    'height': string;
    'load': (src: string, displayMode?: DisplayMode) => Promise<void>;
    'recenter': () => Promise<void>;
    'resize': () => Promise<void>;
    'selectNode': (nodeId: string) => Promise<void>;
    'setBoundingBoxEnabled': (visible: boolean) => Promise<void>;
    'setControlsEnabled': (enabled: boolean) => Promise<void>;
    'setControlsType': (type: ControlsType) => Promise<void>;
    'setDisplayMode': (displayMode: DisplayMode) => Promise<void>;
    'setDrawingEnabled': (enabled: boolean) => Promise<void>;
    /**
    * Creates or updates an edge in the graph
    */
    'setEdge': (edge: [string, AlEdge]) => Promise<void>;
    'setGraph': (graph: AlGraph) => Promise<void>;
    'setGraphEnabled': (enabled: boolean) => Promise<void>;
    'setMaterial': (material: Material) => Promise<void>;
    'setNode': (node: [string, AlNode]) => Promise<void>;
    'setOrientation': (orientation: Orientation) => Promise<void>;
    'setSceneDistance': (distance: number) => Promise<void>;
    'setSlicesIndex': (index: number) => Promise<void>;
    'setUnits': (units: Units) => Promise<void>;
    'setVolumeBrightness': (brightness: number) => Promise<void>;
    'setVolumeContrast': (contrast: number) => Promise<void>;
    'setVolumeSteps': (steps: number) => Promise<void>;
    'vrEnabled': boolean;
    'width': string;
  }
}

declare global {


  interface HTMLAlAngleEditorElement extends Components.AlAngleEditor, HTMLStencilElement {}
  var HTMLAlAngleEditorElement: {
    prototype: HTMLAlAngleEditorElement;
    new (): HTMLAlAngleEditorElement;
  };

  interface HTMLAlConsoleElement extends Components.AlConsole, HTMLStencilElement {}
  var HTMLAlConsoleElement: {
    prototype: HTMLAlConsoleElement;
    new (): HTMLAlConsoleElement;
  };

  interface HTMLAlControlPanelElement extends Components.AlControlPanel, HTMLStencilElement {}
  var HTMLAlControlPanelElement: {
    prototype: HTMLAlControlPanelElement;
    new (): HTMLAlControlPanelElement;
  };

  interface HTMLAlEdgeEditorElement extends Components.AlEdgeEditor, HTMLStencilElement {}
  var HTMLAlEdgeEditorElement: {
    prototype: HTMLAlEdgeEditorElement;
    new (): HTMLAlEdgeEditorElement;
  };

  interface HTMLAlGraphEditorElement extends Components.AlGraphEditor, HTMLStencilElement {}
  var HTMLAlGraphEditorElement: {
    prototype: HTMLAlGraphEditorElement;
    new (): HTMLAlGraphEditorElement;
  };

  interface HTMLAlGraphSettingsElement extends Components.AlGraphSettings, HTMLStencilElement {}
  var HTMLAlGraphSettingsElement: {
    prototype: HTMLAlGraphSettingsElement;
    new (): HTMLAlGraphSettingsElement;
  };

  interface HTMLAlNodeEditorElement extends Components.AlNodeEditor, HTMLStencilElement {}
  var HTMLAlNodeEditorElement: {
    prototype: HTMLAlNodeEditorElement;
    new (): HTMLAlNodeEditorElement;
  };

  interface HTMLAlNodeListElement extends Components.AlNodeList, HTMLStencilElement {}
  var HTMLAlNodeListElement: {
    prototype: HTMLAlNodeListElement;
    new (): HTMLAlNodeListElement;
  };

  interface HTMLAlSettingsElement extends Components.AlSettings, HTMLStencilElement {}
  var HTMLAlSettingsElement: {
    prototype: HTMLAlSettingsElement;
    new (): HTMLAlSettingsElement;
  };

  interface HTMLAlTabsElement extends Components.AlTabs, HTMLStencilElement {}
  var HTMLAlTabsElement: {
    prototype: HTMLAlTabsElement;
    new (): HTMLAlTabsElement;
  };

  interface HTMLAlUrlPickerElement extends Components.AlUrlPicker, HTMLStencilElement {}
  var HTMLAlUrlPickerElement: {
    prototype: HTMLAlUrlPickerElement;
    new (): HTMLAlUrlPickerElement;
  };

  interface HTMLAlViewControlsElement extends Components.AlViewControls, HTMLStencilElement {}
  var HTMLAlViewControlsElement: {
    prototype: HTMLAlViewControlsElement;
    new (): HTMLAlViewControlsElement;
  };

  interface HTMLAlViewerElement extends Components.AlViewer, HTMLStencilElement {}
  var HTMLAlViewerElement: {
    prototype: HTMLAlViewerElement;
    new (): HTMLAlViewerElement;
  };
  interface HTMLElementTagNameMap {
    'al-angle-editor': HTMLAlAngleEditorElement;
    'al-console': HTMLAlConsoleElement;
    'al-control-panel': HTMLAlControlPanelElement;
    'al-edge-editor': HTMLAlEdgeEditorElement;
    'al-graph-editor': HTMLAlGraphEditorElement;
    'al-graph-settings': HTMLAlGraphSettingsElement;
    'al-node-editor': HTMLAlNodeEditorElement;
    'al-node-list': HTMLAlNodeListElement;
    'al-settings': HTMLAlSettingsElement;
    'al-tabs': HTMLAlTabsElement;
    'al-url-picker': HTMLAlUrlPickerElement;
    'al-view-controls': HTMLAlViewControlsElement;
    'al-viewer': HTMLAlViewerElement;
  }
}

declare namespace LocalJSX {
  interface AlAngleEditor extends JSXBase.HTMLAttributes<HTMLAlAngleEditorElement> {
    'angle'?: [string, AlAngle];
    'onDeleteAngle'?: (event: CustomEvent<any>) => void;
    'onSaveAngle'?: (event: CustomEvent<any>) => void;
  }
  interface AlConsole extends JSXBase.HTMLAttributes<HTMLAlConsoleElement> {
    'graph'?: string | null;
    'onGraphSubmitted'?: (event: CustomEvent<any>) => void;
    'tabSize'?: number;
  }
  interface AlControlPanel extends JSXBase.HTMLAttributes<HTMLAlControlPanelElement> {
    'angles'?: Map<string, AlAngle> | null;
    'boundingBoxEnabled'?: boolean;
    'consoleTabEnabled'?: boolean;
    'controlsType'?: ControlsType;
    'displayMode'?: DisplayMode;
    'drawingEnabled'?: boolean;
    'edges'?: Map<string, AlEdge> | null;
    'graphEnabled'?: boolean;
    'graphTabEnabled'?: boolean;
    'nodes'?: Map<string, AlNode> | null;
    'orientation'?: Orientation;
    'selected'?: string | null;
    'settingsTabEnabled'?: boolean;
    'slicesBrightness'?: number;
    'slicesContrast'?: number;
    'slicesIndex'?: number;
    'slicesMaxIndex'?: number;
    'srcTabEnabled'?: boolean;
    'tabContentHeight'?: string | null;
    'units'?: Units;
    'url'?: string | null;
    'urls'?: Map<string, string> | null;
    'volumeBrightness'?: number;
    'volumeContrast'?: number;
    'volumeSteps'?: number;
    'volumeStepsHighEnabled'?: boolean;
  }
  interface AlEdgeEditor extends JSXBase.HTMLAttributes<HTMLAlEdgeEditorElement> {
    'edge'?: [string, AlEdge];
    'onDeleteEdge'?: (event: CustomEvent<any>) => void;
    'onSaveEdge'?: (event: CustomEvent<any>) => void;
  }
  interface AlGraphEditor extends JSXBase.HTMLAttributes<HTMLAlGraphEditorElement> {
    'angles'?: Map<string, AlAngle> | null;
    'drawingEnabled'?: boolean;
    'edges'?: Map<string, AlEdge> | null;
    'graphEnabled'?: boolean;
    'graphVisible'?: boolean;
    'node'?: [string, AlNode];
    'nodes'?: Map<string, AlNode> | null;
    'selected'?: string | null;
    'units'?: Units;
  }
  interface AlGraphSettings extends JSXBase.HTMLAttributes<HTMLAlGraphSettingsElement> {
    'drawingEnabled'?: boolean;
    'graphEnabled'?: boolean;
    'graphVisible'?: boolean;
    'onDrawingEnabledChanged'?: (event: CustomEvent<any>) => void;
    'onGraphEnabledChanged'?: (event: CustomEvent<any>) => void;
    'onUnitsChanged'?: (event: CustomEvent<any>) => void;
    'units'?: Units;
  }
  interface AlNodeEditor extends JSXBase.HTMLAttributes<HTMLAlNodeEditorElement> {
    'node'?: [string, AlNode];
    'onDeleteNode'?: (event: CustomEvent<any>) => void;
    'onSaveNode'?: (event: CustomEvent<any>) => void;
  }
  interface AlNodeList extends JSXBase.HTMLAttributes<HTMLAlNodeListElement> {
    'nodes'?: Map<string, AlNode> | null;
    'onSelectedChanged'?: (event: CustomEvent<any>) => void;
    'selected'?: string | null;
  }
  interface AlSettings extends JSXBase.HTMLAttributes<HTMLAlSettingsElement> {
    'displayMode'?: DisplayMode;
    'onDisplayModeChanged'?: (event: CustomEvent<any>) => void;
    'onOrientationChanged'?: (event: CustomEvent<any>) => void;
    'onSlicesBrightnessChanged'?: (event: CustomEvent<any>) => void;
    'onSlicesContrastChanged'?: (event: CustomEvent<any>) => void;
    'onSlicesIndexChanged'?: (event: CustomEvent<any>) => void;
    'onVolumeBrightnessChanged'?: (event: CustomEvent<any>) => void;
    'onVolumeContrastChanged'?: (event: CustomEvent<any>) => void;
    'onVolumeStepsChanged'?: (event: CustomEvent<any>) => void;
    'onVolumeStepsHighEnabledChanged'?: (event: CustomEvent<any>) => void;
    'orientation'?: Orientation;
    'slicesBrightness'?: number;
    'slicesContrast'?: number;
    'slicesIndex'?: number;
    'slicesMaxIndex'?: number;
    'volumeBrightness'?: number;
    'volumeContrast'?: number;
    'volumeSteps'?: number;
    'volumeStepsHighEnabled'?: boolean;
  }
  interface AlTabs extends JSXBase.HTMLAttributes<HTMLAlTabsElement> {
    /**
    * Emitted when the navigation has finished transitioning to a new component.
    */
    'onIonTabsDidChange'?: (event: CustomEvent<{
      tab: string;
    }>) => void;
    /**
    * Emitted when the navigation is about to transition to a new component.
    */
    'onIonTabsWillChange'?: (event: CustomEvent<{
      tab: string;
    }>) => void;
  }
  interface AlUrlPicker extends JSXBase.HTMLAttributes<HTMLAlUrlPickerElement> {
    'onUrlChanged'?: (event: CustomEvent<any>) => void;
    'url'?: string | null;
    'urls'?: Map<string, string> | null;
  }
  interface AlViewControls extends JSXBase.HTMLAttributes<HTMLAlViewControlsElement> {
    'boundingBoxEnabled'?: boolean;
    'controlsType'?: ControlsType;
    'onBoundingBoxEnabledChanged'?: (event: CustomEvent<any>) => void;
    'onControlsTypeChanged'?: (event: CustomEvent<any>) => void;
    'onRecenter'?: (event: CustomEvent<any>) => void;
  }
  interface AlViewer extends JSXBase.HTMLAttributes<HTMLAlViewerElement> {
    'dracoDecoderPath'?: string | null;
    'envMapPath'?: string | null;
    'height'?: string;
    /**
    * Fires whenever the internal state changes passing an object describing the state.
    */
    'onChanged'?: (event: CustomEvent<any>) => void;
    /**
    * Fires when an object is loaded passing either the object or a stackhelper for volumetric data.
    */
    'onLoaded'?: (event: CustomEvent<any>) => void;
    'vrEnabled'?: boolean;
    'width'?: string;
  }

  interface IntrinsicElements {
    'al-angle-editor': AlAngleEditor;
    'al-console': AlConsole;
    'al-control-panel': AlControlPanel;
    'al-edge-editor': AlEdgeEditor;
    'al-graph-editor': AlGraphEditor;
    'al-graph-settings': AlGraphSettings;
    'al-node-editor': AlNodeEditor;
    'al-node-list': AlNodeList;
    'al-settings': AlSettings;
    'al-tabs': AlTabs;
    'al-url-picker': AlUrlPicker;
    'al-view-controls': AlViewControls;
    'al-viewer': AlViewer;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


