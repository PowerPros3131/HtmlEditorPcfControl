/// <reference types="powerapps-component-framework" />
import { IInputs, IOutputs } from "./generated/ManifestTypes";
export declare class HtmlEditorControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container;
    private notifyOutputChanged;
    private htmlContent;
    private context;
    private reactRoot;
    /**
     * Empty constructor.
     */
    constructor();
    /**
     * Used to initialize the control instance.
     */
    init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, _state: ComponentFramework.Dictionary, container: HTMLDivElement): void;
    /**
     * Called when any value in the property bag has changed.
     */
    updateView(context: ComponentFramework.Context<IInputs>): void;
    /**
     * Returns the output values.
     */
    getOutputs(): IOutputs;
    /**
     * Called when the control is to be removed from the DOM tree.
     */
    destroy(): void;
    /**
     * Renders the React component
     */
    private renderControl;
    /**
     * Event handler for when HTML content changes
     */
    private onHtmlChange;
}
//# sourceMappingURL=index.d.ts.map