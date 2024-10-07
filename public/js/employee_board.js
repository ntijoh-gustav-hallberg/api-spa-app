import { EmployeeCard } from "./employee_card.js";
import { ToggleEditFormEvent } from "./employee_form.js";

export class SearchEvent extends CustomEvent {
    constructor(search) {
        super("searchEvent",
            {
                bubbles: true,
                composed: true,
                detail: {search: search},
            });
    }
}

export class EmployeeBoard extends HTMLElement{
    #store;

    constructor(store) {
        super();
        this.#store = store.getInstance();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(this.#template())
        this.render()
    }

    connectedCallback() {
        document.querySelector("main").addEventListener("editEvent", this.#handleEdit.bind(this));
        document.querySelector("main").addEventListener("removeEvent", this.#handleRemove.bind(this));
        document.querySelector("main").addEventListener("searchEvent", this.#handleSearch.bind(this));
    }

    disconnectedCallback() {
        document.querySelector("main").removeEventListener("editEvent", this.#handleEdit.bind(this));
        document.querySelector("main").removeEventListener("removeEvent", this.#handleRemove.bind(this));
    }

    async render() {
        if (this.shadowRoot.querySelector("#employee-container").childNodes.length > 0) {
            this.shadowRoot.querySelector("#employee-container").innerHTML = "";
        }
        await this.#store.fetchEmployees();
        this.#store.getEmployees().forEach(employee => {
            const card = new EmployeeCard(employee);
            this.shadowRoot.querySelector("#employee-container").appendChild(card);
        });
    }

    async #handleEdit(e) {
        document.querySelector("main").dispatchEvent(new ToggleEditFormEvent(e.detail.employeeCard));
    }

    async #handleRemove(e) {
        await this.#store.removeEmployee(e.detail.employeeCard.id)
        e.detail.employeeCard.remove()
    }

    async #handleSearch(e) {
        const search = e.detail.search;
        if (this.shadowRoot.querySelector("#employee-container").childNodes.length > 0) {
            this.shadowRoot.querySelector("#employee-container").innerHTML = "";
        }
        await this.#store.fetchEmployees();
        this.#store.getEmployees().forEach(employee => {
            const isMatch = employee.name.toLowerCase().includes(search.toLowerCase());
            if (isMatch) {
                const card = new EmployeeCard(employee);
                this.shadowRoot.querySelector("#employee-container").appendChild(card);
            }
        });
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