const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const departmentArray = [];
const roleArray = [];
const employeeArray = [];

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
      "Update Employeen Role",
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
          },
          {
              type: 'list',
              name: 'employeeManager',
              message: 'Who is this the manager of this employee?',
              choices: employeeArray
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
        console.log("=================")
        db.query('SELECT employee.first_name, employee.last_name, employee.id, role.title, department.name, role.salary FROM ((employee JOIN role ON employee.role_id = role.id) JOIN department ON role.department_id = department.id);',
        (err, results) => {
            if (err){
                console.info(err)
            } else {
                console.table(results)
            }
        })
        mainMenu();
      }
  
  const getAllRoles = async () => 
      {
        console.log("=================")
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
        console.log("=================")
        db.query('SELECT * FROM department;', (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.table(results)          
            }
        })
        mainMenu();
      }

const primeArrays = () => {
    primeEmployees();
    primeRoles();
    primeDepartments();
}

const primeDepartments = () => {
    departmentArray.length = 0;
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
    roleArray.length = 0;
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
    employeeArray.length = 0;
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
        db.query(`INSERT INTO department(name) 
        VALUES ('${data.name}');`,);
        primeDepartments();
        mainMenu();
    })
};

const addRole = () => {
    inquirer.prompt(inquireObject.addRole)
    .then((data) => {
        let idInt;
        for (let i = 0; i < departmentArray.length; i++) {
            if (data.roleDepartment === departmentArray[i]){
                idInt = i + 1;
            }
        }

        db.query(`INSERT INTO role(title, salary, department_id)
        VALUES ('${data.name}', ${data.salary}, ${idInt});`,);
        primeRoles();
        mainMenu();
    })
}

const addEmployee = () => {
    inquirer.prompt(inquireObject.addEmployee)
    .then((data) => {
        let idInt;
        let idInt2;

        for (let i = 0; i < roleArray.length; i++) {
            if (data.employeeRole === roleArray[i]){
                idInt = i + 1;
            }            
        }

        for (let i = 0; i < employeeArray.length; i++){
            if (data.employeeManager === employeeArray[i]){
                idInt2 = i + 1;
            }
        }
        db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES ('${data.fName}','${data.lName}',${idInt}, ${idInt2});`,);
        primeEmployees();
        mainMenu();
    })
};


const updateEmployee = () => {
    inquirer.prompt(inquireObject.updateEmployee)
    .then((data)=> {
        let idInt;
        let idInt2;

        for (let i = 0; i < employeeArray.length; i++) {
            if (data.employeeSelect === employeeArray[i]){
                idInt = i + 1;
            }
        }

        for (let i = 0; i < roleArray.length; i++){
            if (data.employeeRole === roleArray[i]){
                idInt2 = i + 1;
            }
        }
        db.query(`UPDATE employee SET role_id = ${idInt2} WHERE id = ${idInt};`,)
        mainMenu();
    })
}

const mainMenu = () => {
    inquirer.prompt(inquireObject.mainMenu)
    .then((data) => {
        if (data.mainMenu === "View all Departments"){
            getAllDepartments();
        } else if (data.mainMenu === "View all Roles"){
            getAllRoles().then(mainMenu());
        } else if (data.mainMenu === "View all Employees"){
            getAllEmployees();
        } else if (data.mainMenu === "Add a Department"){
            addDepartment();
        } else if (data.mainMenu === "Add a Role"){
            addRole();
        } else if (data.mainMenu === "Add an Employee"){
            addEmployee();
        } else if (data.mainMenu === "Update Employeen Role"){
            updateEmployee();
        }
    })
    console.log(`\n =================`)
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
