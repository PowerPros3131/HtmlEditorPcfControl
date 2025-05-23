import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { HtmlEditorComponent } from "./HtmlEditorComponent";

export class HtmlEditorControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container!: HTMLDivElement;
    private notifyOutputChanged!: () => void;
    private htmlContent: string = "";
    private context!: ComponentFramework.Context<IInputs>;
    private reactRoot: ReactDOM.Root | null = null;

    /**
     * Empty constructor.
     */
    constructor() {}

    /**
     * Used to initialize the control instance.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        
        // Get the initial HTML content
        this.htmlContent = context.parameters.htmlInput?.raw ?? "";
        
        // Create root and render component
        this.reactRoot = ReactDOM.createRoot(this.container);
        this.renderControl();
    }

    /**
     * Called when any value in the property bag has changed.
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
        
        const newHtmlContent = context.parameters.htmlInput?.raw ?? "";
        
        if (this.htmlContent !== newHtmlContent) {
            this.htmlContent = newHtmlContent;
            this.renderControl();
        }
    }

    /**
     * Returns the output values.
     */
    public getOutputs(): IOutputs {
        return {
            htmlOutput: this.htmlContent
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree.
     */
    public destroy(): void {
        if (this.reactRoot) {
            this.reactRoot.unmount();
            this.reactRoot = null;
        }
    }
    
    /**
     * Renders the React component
     */
    private renderControl(): void {
        if (!this.reactRoot) return;
        
        this.reactRoot.render(
            React.createElement(
                HtmlEditorComponent,
                {
                    htmlContent: this.htmlContent,
                    onHtmlChange: this.onHtmlChange.bind(this),
                    disabled: this.context.mode.isControlDisabled
                }
            )
        );
    }
    
    /**
     * Event handler for when HTML content changes
     */
    private onHtmlChange(newHtmlContent: string): void {
        this.htmlContent = newHtmlContent;
        this.notifyOutputChanged();
    }
}