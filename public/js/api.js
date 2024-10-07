import { EmployeeBoard, SearchEvent } from "./employee_board.js";
import { EmployeeStore } from "./employee_store.js";
import { EmployeeForm, ToggleNewFormEvent } from "./employee_form.js";

function index() {
   const employeeBoard = new EmployeeBoard(EmployeeStore);
   document.querySelector("main").appendChild(employeeBoard);
   const employeeForm = new EmployeeForm(EmployeeStore);
   document.querySelector("body").appendChild(employeeForm);
}

function toggleNewForm() {
   document.querySelector("main").dispatchEvent(new ToggleNewFormEvent());
}

function search(e) {
   document.querySelector("main").dispatchEvent(new SearchEvent(e.target.value));
}

document.querySelector("#search-bar").addEventListener("keyup", search)

window.toggleNewForm = toggleNewForm;

index();