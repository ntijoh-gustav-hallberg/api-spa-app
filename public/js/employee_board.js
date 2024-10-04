import { EmployeeCard } from "./employee_card.js";

export class EmployeeBoard extends HTMLElement{
    #store;

    constructor(store) {
        super();
        this.#store = store.getInstance();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(this.#template())
        this.#init()
    }

    connectedCallback() {
        document.querySelector("main").addEventListener("editEvent", this.#handleEdit.bind(this));
        document.querySelector("main").addEventListener("removeEvent", this.#handleRemove.bind(this));
    }

    disconnectedCallback() {
        document.querySelector("main").removeEventListener("editEvent", this.#handleEdit.bind(this));
        document.querySelector("main").removeEventListener("removeEvent", this.#handleRemove.bind(this));
    }

    async #init() {
        await this.#store.fetchEmployees();
        this.#store.getEmployees().forEach(employee => {
            const card = new EmployeeCard(employee);
            this.shadowRoot.querySelector("#employee-container").appendChild(card);
        });
    }

    #handleEdit(e) {
        
    }

    #handleRemove(e) {
        e.detail.employeeCard.remove()
    }

    #template() {
        const template = document.createElement("template");
        template.innerHTML = `
        <style>
            #employee-container {
                display: grid;
                grid-template-columns: auto auto auto;
                z-index: 1;
            }
        </style>
            <div id="employee-container">

            </div>
        `
        return template.content.cloneNode(true);
    }
}
window.customElements.define('employee-board', EmployeeBoard);