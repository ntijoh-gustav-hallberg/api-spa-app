import { ToggleEditFormEvent } from "./employee_form.js";

export class EmployeeStore {
    static instance = null

    #baseUrl = "http://localhost:9292/api/employees";

    static getInstance() {
        if (!EmployeeStore.instance) {
            EmployeeStore.instance = new EmployeeStore();
        }
        return EmployeeStore.instance;
    }

    async fetchEmployees() {
        if(this.employees) {
            this.employees == null
        }
        const response = await fetch(this.#baseUrl);
        const json = await response.json();
        this.employees = json;
    }

    getEmployees() {
        return this.employees;
    }

    async removeEmployee(id) {
        const response = await fetch(`/api/employees/${id}`, {method: "delete"})
        if(!response.ok) {
            throw new Error("Response failed, status code: " + response.status);
        }
    }

    toggleEditForm() {
        document.querySelector("main").dispatchEvent(new ToggleEditFormEvent());
    }

    getEmployeeSearch(search) {
        return this.employees.find((employee) => employee.name.toLowerCase().includes(search.toLowerCase()));
    }
}