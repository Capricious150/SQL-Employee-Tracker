const inquirer = require('inquirer');

const departmentArray = [];
const roleArray = [];
const employeeArray = [];

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
            name: 'name',
            message: 'Enter Department Name'
        }
    ],
    addRole: [
        {
            type: 'input',
            name: 'name',
            message: 'Enter Role Name'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary. Format: 100000 // 80000 // 240000 // etc.'
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'Which department is this role being added to?',
            choices: departmentArray
        }
    ],
    addEmployee: [
        {
            type: 'input',
            name: 'fName',
            message: 'Enter the first name of the employee'
        },
        {
            type: 'input',
            name: 'lName',
            message: 'Enter the last name of the employee'
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is the role of this employee?',
            choices: roleArray
        }
    ],
    updateEmployee: [
        {
            type: 'list',
            name: 'employeeSelect',
            message: 'Which employee are you updating?',
            choices: employeeArray
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is the new role of this employee?',
            choices: roleArray
        }
    ]
};

const getAllEmployees = () =>
    fetch('/employees', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
          },
    })

const getAllRoles = () => 
    fetch('/roles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
          },
    })

const getAllDepartments = () =>
    fetch('/departments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
          },
    })