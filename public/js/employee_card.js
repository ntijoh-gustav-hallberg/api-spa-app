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
        this.name = employee.name;
        this.email = employee.email;
        this.phone = employee.phone;
        this.department_id = employee.department_id;
        this.department_label = employee.department_label;
        this.img = employee.img;
        this.id = employee.id;
 
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this.#template());
 
    }
 
    #template() {
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
         .employee-card {
            display: flex;
            background-color: var(--primary-color);
            border: 1px solid var(--secondary-color);
            margin: 10px;
            padding: 10px;
            justify-content: space-between;
            color: var(--text-color);
         }

         .employee-card h1,p {
            margin: 0;
            padding: 0;
         }

         .employee-card img {
            border: 2px solid var(--secondary-color);
            border-radius: 50%;
         }

         #info-div {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
         }

         button {
            color: var(--text-color);
            border: solid 2px var(--secondary-color);
            border-radius: 5px;
            padding: 7.5px;
         }

         #edit-button {
            background-color: var(--cta-color);
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
                <p class='department_id'>Department: ${this.department_label}</p>
             </div>
             <div>
                <button id="edit-button">Edit</button>
                <button id="remove-button">Remove</button>
             </div>
          </div>
          <img src='img/${this.img}.jpg'>
        </div>
        `;
 
        return template.content.cloneNode(true)
    }
 
    connectedCallback() {
        const editButton = this.shadowRoot.querySelector("#edit-button");
        const removeButton = this.shadowRoot.querySelector("#remove-button")
 
        editButton.addEventListener("click", () => {
            document.querySelector("main").dispatchEvent(new EditEvent(this));
        })
 
        removeButton.addEventListener("click", () => {
            document.querySelector("main").dispatchEvent(new RemoveEvent(this));
        })
    }
 
    disconnectCallback() {
        const editButton = this.shadowRoot.querySelector("#edit-button");
        const removeButton = this.shadowRoot.querySelector("#remove-button")
 
        editButton.addEventListener("click", () => {
            document.dispatchEvent(new EditEvent(this));
        })
 
        removeButton.addEventListener("click", () => {
            document.dispatchEvent(new RemoveEvent(this));
        })
    }
}
window.customElements.define('employee-card', EmployeeCard);