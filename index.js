// const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const departmentArray = [];
const roleArray = [];
const employeeArray = [];

// const app = express();
// const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );

  
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
      {
        db.query('SELECT employee.first_name, employee.last_name, employee.id, role.title, department.name, role.salary FROM ((employee JOIN role ON employee.role_id = role.id) JOIN department ON role.department_id = department.id);',
        (err, results) => {
            if (err){
                console.info(err)
            } else {
                console.table(results)
            }
        })
      }
  
  const getAllRoles = () => 
      {
        db.query('SELECT role.title, role.id, department.id, role.salary FROM role JOIN department ON role.department_id = department.id;',
        (err, results) => {
            if (err){
                console.info(err)
            } else {
                console.table(results)
            }
        })
      }
  
  const getAllDepartments = () =>
      {
        db.query('SELECT * FROM department;', (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.table(results)          
            }
        })
      }

const primeArrays = () => {
    primeEmployees();
    primeRoles();
    primeDepartments();
}

const primeDepartments = () => {
    db.query('SELECT department.name FROM department', (err, results) => 
    {
        if (err){
            console.log(err)
        } else {
            for (let i = 0; i < results.length; i++) {
                departmentArray.push(results[i].name)              
            }
        }
    })
};

const primeRoles = () => {
    db.query('SELECT role.title FROM role', (err, results) => 
    {
        if (err){
            console.log(err)
        } else {
            for (let i = 0; i < results.length; i++) {
                roleArray.push(results[i].title)              
            }
        }
    })
}

const primeEmployees = () => {
    db.query('SELECT employee.first_name, employee.last_name FROM employee', (err, results) => 
    {
        if (err){
            console.log(err)
        } else {
            for (let i = 0; i < results.length; i++) {
                employeeArray.push(`${results[i].first_name} ${results[i].last_name}`)              
            }
        }
    })
}

const addDepartment = () => {
    inquirer.prompt(inquireObject.addDepartment)
    .then((data) => {
        
    })
}

const mainMenu = () => {
    inquirer.prompt(inquireObject.mainMenu)
    .then((data) => {
        if (data.mainMenu === "View all Departments"){
            getAllDepartments();
            mainMenu();
        } else if (data.mainMenu === "View all Roles"){
            getAllRoles();
            mainMenu();
        } else if (data.mainMenu === "View all Employees"){
            getAllEmployees();
            mainMenu();
        } else if (data.mainMenu === "Add a Department"){
            addDepartment();
        } else if (data.mainMenu === "Add a Role"){
            addRole();
        } else if (data.mainMenu === "Add an Employee"){
            addEmployee();
        } else if (data.mainMenu === "Update an Employee"){
            updateEmployee();
        }
    })
}






const init = () => {
primeArrays();
mainMenu();
}

init();


// Various Function Tests ----
// primeDepartments();
// console.log(departmentArray);
// getAllDepartments();
// getAllRoles();
// getAllEmployees();
