export class ToggleEditFormEvent extends CustomEvent {
    constructor(that) {
        super("toggleEditFormEvent",
            {
                bubbles: true,
                composed: true,
                detail: {that: that}
            });
        }
}
export class ToggleNewFormEvent extends CustomEvent {
    constructor() {
        super("toggleNewFormEvent",
            {
                bubbles: true,
                composed: true,
            });
    }
}

export class EmployeeForm extends HTMLElement {
    #store;

    constructor(store) {
        super();
        this.#store = store.getInstance();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this.#template());
        this.form = this.shadowRoot.querySelector(".toggleble-form");
        this.innerForm = this.form.querySelector("form");
        this.nameInput = this.form.querySelectorAll("input[type=text]")[0];
        this.emailInput = this.form.querySelectorAll("input[type=text]")[1];
        this.phoneInput = this.form.querySelector("input[type=tel]");
        this.departmentIdInput = this.form.querySelector("input[type=number]");
        this.fileInput = this.form.querySelector("#file-input");
        this.fileInputLabel = this.form.querySelector("#file-label");
        this.that = null
    }

    connectedCallback() {
        document.querySelector("main").addEventListener("toggleEditFormEvent", this.#toggleEditForm.bind(this))
        document.querySelector("main").addEventListener("toggleNewFormEvent", this.#toggleNewForm.bind(this))
        this.shadowRoot.querySelector(".close-button").addEventListener("click", this.#toggleEditForm.bind(this))
        this.form.addEventListener("submit", this.#postForm.bind(this))
    }

    disconnectedCallback() {
        document.querySelector("main").removeEventListener("toggleEditFormEvent", this.#toggleEditForm.bind(this))
    }

    async #postForm(e) {
        if (this.fileInput.type == "file") {
            this.#postNewForm(e);
        } else {
            this.#postEditForm(e);
        }
    }

    async #postEditForm(e) {
        e.preventDefault();

        if (!this.that) {
            return;
        }

        const response = await fetch(this.innerForm.action, {method: "post", body: JSON.stringify({name: this.nameInput.value, email: this.emailInput.value, phone: this.phoneInput.value, department_id: this.departmentIdInput.value, img: this.fileInput.value})})
        
        if(!response.ok) {
            throw new Error("Response failed, status code: " + response.status);
        }

        this.that.name = this.nameInput.value;
        this.that.email = this.emailInput.value;
        this.that.phone = this.phoneInput.value;
        this.that.departmentId = this.departmentIdInput.value;

        this.#toggleEditForm(e).bind(this);
    }
 
    #toggleEditForm(e) {
        this.fileInput.type= "hidden";
        this.fileInputLabel.style.display = "none";

        if (this.form.style.display === "block") {
            this.form.style.display = "none";
            this.form.style.overflow = "hidden";
        }
        else {
            this.that = e.detail.that;
            const id = e.detail.that.id;
            const name = e.detail.that.name;
            const email = e.detail.that.email;
            const phone = e.detail.that.phone;
            const departmentId = e.detail.that.department_id;
            const img = e.detail.that.img;

            this.nameInput.value = name;
            this.emailInput.value = email;
            this.phoneInput.value = phone;
            this.departmentIdInput.value = parseInt(departmentId);
            this.fileInput.value = img

            this.innerForm.action = "/api/employees/" + id;
            this.form.style.display = "block";
            this.form.style.overflow = "auto";
        }
    }

    async #postNewForm(e) {
        e.preventDefault();

        const formData = new FormData()
        formData.append('file', this.fileInput.files[0])

        const uploadResponse = await fetch("/api/uploadImage", {method: "post", body: formData});

        if(!uploadResponse.ok) {
            throw new Error("Upload failed, status code: " + uploadResponse.status);
        }

        const response = await fetch('/api/employees/', {method: "post", body: JSON.stringify({name: this.nameInput.value, email: this.emailInput.value, phone: this.phoneInput.value, department_id: this.departmentIdInput.value, img: this.fileInput.files[0].name.split(".")[0]})})

        if(!response.ok) {
            throw new Error("Response failed, status code: " + response.status);
        }

        document.querySelector("employee-board").render();

        this.#toggleNewForm().bind(this);
    }

    #toggleNewForm() {
        this.fileInput.type= "file";
        this.fileInputLabel.style.display = "block";

        if (this.form.style.display === "block") {
            this.form.style.display = "none";
            this.form.style.overflow = "hidden";
        }
        else {
            this.innerForm.action = "/api/employees/";
            this.form.style.display = "block";
            this.form.style.overflow = "auto";
        }
    }

    #template() {
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
            :host {
                --main-bg-color: #000022;
                --primary-color: #312c4a;
                --secondary-color: #463f59;
                --tertiary-color: #685e74;
                --cta-color: #897c8f;
                --text-color: white;
            }

            .toggleble-form {
                display: none;
                overflow: hidden;
                width: 50%;
                top: 25%;
                left: 25%;
                position: absolute;
                z-index: 2;
                background-color: var(--secondary-color);
                border: solid 2px var(--tertiary-color);
                border-radius: 10px;
                padding: 10px;
            }

            .toggleble-form form {
                padding-top: 10px;
                display: flex;
                flex-direction: column;
            }

            .toggleble-form label {
                color: var(--text-color);
                padding-top: 10px;
                padding-bottom: 5px;
                font-size: 16px;
            }

            .toggleble-form input {
                padding: 5px;
                border: solid 2px var(--secondary-color);
                border-radius: 5px;
            }

            .toggleble-form input[type="submit"] {
                background-color: var(--cta-color);
                color: var(--text-color);
                border: solid 2px var(--secondary-color);
                border-radius: 5px;
            }

            .toggleble-form .close-button {
                background-color: var(--cta-color);
                padding: 5px;
                border: solid 2px var(--secondary-color);
                border-radius: 5px;
                font-size: 20px;
                color: var(--text-color);
            }
        </style>

        <div class="toggleble-form" id="new-employee-form">
            <button class="close-button">X</button>
            <form method="post" action="/api/employees/" Content-Type="multipart/form-data">
                <label for="name">Name: </label>
                <input type="text" placeholder="name" name="name" id="new-form-name" value="" required>
                <label for="email">Email: </label>
                <input type="text" placeholder="email" name="email" id="new-form-email" value="" required>
                <label for="phone">Phone: </label>
                <input type="tel" placeholder="phone number" name="phone" id="new-form-phone" value="" required>
                <label for="departmentID">DepartmentID: </label>
                <input type="number" placeholder="department ID" name="departmentID" id="new-form-dep-id" value="" required>
                <label id="file-label" for="image">Image: </label>
                <input id="file-input" type="file" placeholder="image" name="image" id="new-form-img" accept=".jpg" required>
                <input type="submit" value="save">
            </form>
        </div>
        `;
 
        return template.content.cloneNode(true)
    }
}
window.customElements.define('employee-form', EmployeeForm);