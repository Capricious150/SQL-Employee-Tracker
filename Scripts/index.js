const inquirer = require('inquirer');


const mainMenuArray = [
    "View all Departments",
    "View all Roles",
    "View all Employees",
    "Add a Department",
    "Add a Role",
    "Add an Employee",
    "Update Employeen Role"
];

const inquireObject = {
    mainMenu: [
        {
            type: 'list',
            name: "mainMenu",
            message: "Select an Option",
            choices: mainMenuArray
        }
],
    addDepartment: [
        {
            type: 'input',
            name: 'id',
            message: 'Enter Department ID'        
        },
        {
            type: 'input',
            name: 'name',
            message: 'Enter Department Name'
        }
],
    addRole: {

    },
    addEmployee: {

    },
    updateEmployee: {

    }
};