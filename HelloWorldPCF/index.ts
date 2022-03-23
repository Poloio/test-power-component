import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class HelloWorldPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private context: ComponentFramework.Context<IInputs>;
    private container: HTMLDivElement;

    //Callback when the code changed a bound or output property (maybe tells to reload de view or something)
    private notifyOutputChanged: () => void;
    //Flag to track if the component is in edit mode (?)
    private isEditMode: boolean;
    //Tracks event handler to destroy it when done
    private buttonClickHandler: EventListener;
    
    private name: string | null;


    
    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>, 
        notifyOutputChanged: () => void, 
        state: ComponentFramework.Dictionary,
        container:HTMLDivElement
        ) : void
    {
        //Track all things given by caller
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;
        this.isEditMode = false;
        this.buttonClickHandler = this.buttonClick.bind(this);

        //span element to hold the message (ts created html for display)
        const message = document.createElement("span");
        message.innerText = `Hello ${this.isEditMode ? "" : context.parameters.Name.raw}`;//IF in edit mode, text is empty

        //TextBox por edit mode
        const textbox = document.createElement("input");
        textbox.type = "text";
        textbox.style.display = this.isEditMode ? "block" : "none" //Show IF idEditMode == true
        if (context.parameters.Name.raw) {
            textbox.value = context.parameters.Name.raw;
        }

        //Wrap both elements in a div
        const messageContainer = document.createElement("div");
        messageContainer.appendChild(message);
        messageContainer.appendChild(textbox);

        //Button to toggle edit mode
        const editButton = document.createElement("button");
        editButton.textContent = this.isEditMode ? "Save" : "Edit";
        editButton.addEventListener("click", this.buttonClickHandler);

        //Put them all inside the overall control container
        this.container.appendChild(messageContainer);
        this.container.appendChild(editButton);
    }

    public buttonClick() {
        // Get controls (query for IDs if there are more than a few child elements)
        const textbox = this.container.querySelector("input")!;// <-- Exclamation symbol for null-checking!
        const message = this.container.querySelector("span")!;
        const editButton = this.container.querySelector("button")!;

        //IF switching to edit mode, copy span's text to the textbox
        if (!this.isEditMode) {
            textbox.value = this.name ?? "";//Coalesce null to an empty string
        } else if (textbox.value != this.name) {
            //IF exiting edit mode, copy name to span and notify the callback
            this.name = textbox.value;
            this.notifyOutputChanged();
        }

        this.isEditMode = !this.isEditMode; 
        message.innerText = `Hello ${this.isEditMode ? "" : this.name}`;

        textbox.style.display = this.isEditMode ? "inline" : "none";
        textbox.value = this.name ?? "";

        editButton.textContent = this.isEditMode ? "Save" : "Edit";
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
