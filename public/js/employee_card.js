export class EditEvent extends CustomEvent {
    constructor(employeeCard) {
        super("editEvent",
            {
                bubbles: true,
                composed: true,
                detail: {employeeCard: employeeCard},
            });
    }
}
export class RemoveEvent extends CustomEvent {
    constructor(employeeCard) {
        super("removeEvent",
            {
                bubbles: true,
                composed: true,
                detail: {employeeCard: employeeCard},
            });
    }
}

export class EmployeeCard extends HTMLElement {
    constructor(employee) {
        super();
        this._name = employee.name;
        this._email = employee.email;
        this._phone = employee.phone;
        this._department_id = employee.department_id;
        this._img = employee.img;
        this._id = employee.id;

        this.attachShadow({mode: 'open'});
        this.render();
    }

    // Setters and Getters for properties to detect changes
    get name() {
        return this._name;
    }

    set name(newValue) {
        if (this._name !== newValue) {
            this._name = newValue;
            this.render(); // Re-render when the value changes
        }
    }

    get email() {
        return this._email;
    }

    set email(newValue) {
        if (this._email !== newValue) {
            this._email = newValue;
            this.render();
        }
    }

    get phone() {
        return this._phone;
    }

    set phone(newValue) {
        if (this._phone !== newValue) {
            this._phone = newValue;
            this.render();
        }
    }

    get department_id() {
        return this._department_id;
    }

    set department_id(newValue) {
        if (this._department_id !== newValue) {
            this._department_id = newValue;
            this.render();
        }
    }

    get img() {
        return this._img;
    }

    set img(newValue) {
        if (this._img !== newValue) {
            this._img = newValue;
            this.render();
        }
    }

    get id() {
        return this._id;
    }

    set id(newValue) {
        if (this._id !== newValue) {
            this._id = newValue;
            this.render();
        }
    }

    render() {
        // Clear current shadow DOM
        this.shadowRoot.innerHTML = '';

        // Append the updated template
        this.shadowRoot.appendChild(this.#template());
    }

    #template() {
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
          .employee-card {
             display: flex;
             background-color: #ccc;
             border: 1px solid #000;
             margin: 10px;
             padding: 10px;
             justify-content: space-between;
          }

          .employee-card h1,p {
             margin: 0;
             padding: 0;
          }

          .employee-card img {
             border: 2px solid #000;
             border-radius: 50%;
          }

          #info-div {
             display: flex;
             flex-direction: column;
             justify-content: space-between;
          }

          button {
             border: solid 1px; #000;
             border-radius: 5px;
          }

          #edit-button {
             background-color: lime;
          }

          #remove-button {
             background-color: red;
          }

          img {
             width: 150px;
             height: 150px;
          }
        </style>
        <div class='employee-card' data-id='id-${this.id}'>
          <div id="info-div">
             <div>
                <h1 class='name'>${this.name}</h1>
                <p class='email'>Email: ${this.email}</p>
                <p class='phone'>Phone number: ${this.phone}</p>
                <p class='department_id'>Department ID: ${this.department_id}</p>
             </div>
             <div>
                <button id="edit-button">Edit</button>
                <button id="remove-button">Remove</button>
             </div>
          </div>
          <img src='img/${this.img}.jpg'>
        </div>
        `;

        return template.content.cloneNode(true);
    }

    connectedCallback() {
        const editButton = this.shadowRoot.querySelector("#edit-button");
        const removeButton = this.shadowRoot.querySelector("#remove-button");

        editButton.addEventListener("click", () => {
            document.querySelector("main").dispatchEvent(new EditEvent(this));
        });

        removeButton.addEventListener("click", () => {
            document.querySelector("main").dispatchEvent(new RemoveEvent(this));
        });
    }

    disconnectCallback() {
        const editButton = this.shadowRoot.querySelector("#edit-button");
        const removeButton = this.shadowRoot.querySelector("#remove-button");

        editButton.removeEventListener("click", () => {
            document.querySelector("main").dispatchEvent(new EditEvent(this));
        });

        removeButton.removeEventListener("click", () => {
            document.querySelector("main").dispatchEvent(new RemoveEvent(this));
        });
    }
}
window.customElements.define('employee-card', EmployeeCard);
