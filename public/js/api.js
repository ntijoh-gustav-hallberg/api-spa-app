class EmployeeCard extends HTMLElement {
   constructor(name, email, phone, department_id, img, id) {
       super();
       this.name = name;
       this.email = email;
       this.phone = phone;
       this.department_id = department_id;
       this.img = img;
       this.id = id;

       this.attachShadow({mode: 'open'});
       this.shadowRoot.appendChild(this.template().content.cloneNode(true));

   }

   template() {
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

       return template
   }

   connectedCallback() {
      const editButton = this.shadowRoot.querySelector("#edit-button");
      const removeButton = this.shadowRoot.querySelector("#remove-button")

      editButton.addEventListener("click", () => {
         toggleForm("edit-employee-form");
         showEmployeeData(this.id)
      })

      removeButton.addEventListener("click", () => {
         removeEmployee(this.id)
      })
   }

   disconnectCallback() {
   }
}
window.customElements.define('employee-card', EmployeeCard);

let employeeList = [];

const innerEditForm = document.querySelector("#edit-employee-form form");
const innerNewForm = document.querySelector("#new-employee-form form");
const searchForm = document.querySelector("#search-bar");
const formName = document.querySelector("#edit-form-name");
const formEmail = document.querySelector("#edit-form-email");
const formPhone = document.querySelector("#edit-form-phone");
const formDepartment = document.querySelector("#edit-form-dep-id");
let img = "";

async function buildEmployee() {
   const response = await fetch("/api/employees");
   if(!response.ok) {
      throw new Error("Response failed, status code: " + response.status);
   }

   const data = await response.json();

   data.forEach(e => {
      const element = new EmployeeCard(e.name, e.email, e.phone, e.department_id, e.img, e.id);
      document.querySelector('#employee-container').appendChild(element);
      employeeList.push(element);
   });
}

function clearEmployeeCards() {
   const employeeContainer = document.querySelector("#employee-container")

   employeeContainer.innerHTML = "";
}

function refreshEmployeeCards() {
   clearEmployeeCards();
   buildEmployee();
}

function toggleForm(formID) {
   const form = document.querySelector(`#${formID}`);

   if(form.style.display === "block") {
      form.style.display = "none"
      form.style.overflow = "hidden"
   } else {
      form.style.display = "block"
      form.style.overflow = "auto"
   }
}

async function createNewEmployee() {
   const formNewName = document.querySelector("#new-form-name");
   const formNewEmail = document.querySelector("#new-form-email");
   const formNewPhone = document.querySelector("#new-form-phone");
   const formNewDepartment = document.querySelector("#new-form-dep-id");
   const formNewImg = document.querySelector("#new-form-img");
   const formData = new FormData()

   formData.append('file', formNewImg.files[0])

   const uploadResponse = await fetch("/api/uploadImage", {method: "post", body: formData});

   if(!uploadResponse.ok) {
      throw new Error("Upload failed, status code: " + uploadResponse.status);
   }

   const response = await fetch('/api/employees/', {method: "post", body: JSON.stringify({name: formNewName.value, email: formNewEmail.value, phone: formNewPhone.value, department_id: formNewDepartment.value, img: formNewImg.files[0].name.split(".")[0]})})

   if(!response.ok) {
      throw new Error("Response failed, status code: " + response.status);
   }

   refreshEmployeeCards();
}

async function showEmployeeData(id) {
   innerEditForm.action = `/api/employees/${id}`

   const response = await fetch(`/api/employees/${id}`, {method: "get"})
   if(!response.ok) {
      throw new Error("Response failed, status code: " + response.status);
   }

   const data = await response.json();

   formName.value = data.name;
   formEmail.value = data.email;
   formPhone.value = data.phone;
   formDepartment.value = data.department_id;
   img = data.img;
}

async function removeEmployee(id) {
   const response = await fetch(`/api/employees/${id}`, {method: "delete"})
   if(!response.ok) {
      throw new Error("Response failed, status code: " + response.status);
   }

   refreshEmployeeCards();
}

innerEditForm.addEventListener("submit", async (e) => {
   e.preventDefault();

   const response = await fetch(innerEditForm.action, {method: "post", body: JSON.stringify({name: formName.value, email: formEmail.value, phone: formPhone.value, department_id: formDepartment.value, img: img})})

   if(!response.ok) {
      throw new Error("Response failed, status code: " + response.status);
   }

   refreshEmployeeCards();
})

innerNewForm.addEventListener("submit", (e) => {
   e.preventDefault();

   createNewEmployee();
})

searchForm.addEventListener("keyup", (e) => {
   employeeList.forEach((element) => {
      const name = element.shadowRoot.querySelector("h1").textContent;
      const isMatch = name.toLowerCase().includes(e.target.value.toLowerCase());
      if (isMatch) {
         element.style.display = "block"
      }
      else {
         element.style.display = "none"
      }
   });

   e.preventDefault();
})