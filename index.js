// Dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Creating 3 empty arrays.
// They will later be populated using the "prime" functions below
// EG: primeRoles()
const departmentArray = [];
const roleArray = [];
const employeeArray = [];

// Database Connection to SQL.
// UPDATE USER AND PASSWORD TO MATCH YOUR SQL PROFILE OR WHOLE CODEBASE WILL FAIL!!
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );

// A quick array to serve as the choices for my Main Menu in inquirer
// Needs to be initialized outside of the inquireObject, as it's referenced therein
  const mainMenuArray = [
      "View all Departments",
      "View all Roles",
      "View all Employees",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update Employeen Role",
      "Salary Budget Utilization",
      "Quit"
  ];
 
// This object forms the basis for ALL of my inquire prompts. It is 80 lines of code, spanning from 40 - 120
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
      ],
      budgetUtilization: [
          {
              type: 'list',
              name: 'departmentBudget',
              message: 'Which department would you like to view the salary budget for?',
              choices: departmentArray
          }
      ]
  };

// DB select function.
// Relatively straight forward, this one joins all three of the tables from my database to return
// Employee Name, ID, Role, Department, and Salary
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
      };

// Another DB select function.
// This one is simpler than the last, only joining the role and department tables to return
// Role title, role ID, department name, and role salary
// This one was written as an async function, more to test how it works than anything else.
// Functionally it's the same as the others, except instead of returning to Main Menu as part of the function,
// That is done in a .then() later in my code
  const getAllRoles = async () => 
      {
        console.log("=================")
        db.query('SELECT role.title, role.id, department.name, role.salary FROM role JOIN department ON role.department_id = department.id;',
        (err, results) => {
            if (err){
                console.info(err)
            } else {
                console.table(results)
            }
        })
      };
  
// The simple DB select function
// This one just returns ALL from the department table.
// This, like the others, logs the information using console.table (see the dependency above)
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
      };

// This function should only fire once, during initialization. It runs all three "primeArray"
// functions, which follow on the lines below
const primeArrays = () => {
    primeEmployees();
    primeRoles();
    primeDepartments();
};

// The first of my "prime Array" functions. Sets the length of departmentArray to 0 to empty it,
// Then uses a for loop against a database query to populate the arrays with the names of the departments.
// These arrays are used for the inquirer prompts.
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

// The second "prime Array" function, identical to the above, except it populates "roleArray"
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
};

// The third and final "prime Array" function, identical to the above, except it populates the "employeeArray"
// With both first and last names
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
};

// A simple INSERT function. Uses the name of the department from the Inquirer prompt
// as department.name. The ID isi an autoincrement, and isn't needed
const addDepartment = () => {
    inquirer.prompt(inquireObject.addDepartment)
    .then((data) => {
        db.query(`INSERT INTO department(name) 
        VALUES ('${data.name}');`,);
        primeDepartments();
        mainMenu();
    })
};

// Another INSERT function. Again uses the choices from the inquirer prompt to
// create a new row on the role table.
// This is the first function where I use a FOR LOOP to match the user selection to a row on the database
// Which will be further explained in the comments for "updateEmployee()"
const addRole = () => {
    inquirer.prompt(inquireObject.addRole)
    .then((data) => {
        let idInt;
        for (let i = 0; i < departmentArray.length; i++) {
            if (data.roleDepartment === departmentArray[i]){
                idInt = i + 1;
                break
            }
        }

        db.query(`INSERT INTO role(title, salary, department_id)
        VALUES ('${data.name}', ${data.salary}, ${idInt});`,);
        primeRoles();
        mainMenu();
    })
};

// Final INSERT function. Behaves identically to the previous one, save that it uses two ID Integer variables.
// For a breakdown on how those are used, refer to the comments for the "updateEmployee()" function, below.
const addEmployee = () => {
    inquirer.prompt(inquireObject.addEmployee)
    .then((data) => {
        let idInt;
        let idInt2;

        for (let i = 0; i < roleArray.length; i++) {
            if (data.employeeRole === roleArray[i]){
                idInt = i + 1;
                break
            }            
        }

        for (let i = 0; i < employeeArray.length; i++){
            if (data.employeeManager === employeeArray[i]){
                idInt2 = i + 1;
                break
            }
        }
        db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES ('${data.fName}','${data.lName}',${idInt}, ${idInt2});`,);
        primeEmployees();
        mainMenu();
    })
};

// A very simple UPDATE function, which uses a FOR LOOP to match items on the company_db database
// with items from the employeeArray and roleArray.
// Once it's matched those, and assigned the relevent IDs to the variables "idInt" and "idInt2" respectively,
// It updates the role_id in Role to match the selection by the user, where the employee ID does the same
const updateEmployee = () => {
    inquirer.prompt(inquireObject.updateEmployee)
    .then((data)=> {
        let idInt;
        let idInt2;

        for (let i = 0; i < employeeArray.length; i++) {
            if (data.employeeSelect === employeeArray[i]){
                idInt = i + 1;
                break
            }
        }

        for (let i = 0; i < roleArray.length; i++){
            if (data.employeeRole === roleArray[i]){
                idInt2 = i + 1;
                break
            }
        }
        db.query(`UPDATE employee SET role_id = ${idInt2} WHERE id = ${idInt};`,)
        mainMenu();
    })
};

// This was a bit more complicated, but mostly because I wanted to further play with using async functions.
// This time, I wanted to test how an async would work with a FOR LOOP.
// I use the same method as I did in the three functions preceding this one, but make the DB Query AWAIT
// the FOR LOOP function resolving. Apart from that, it's a simple SELECT query that provides the SUM
// of salaries WHERE department = the user's selection.
const budgetFunction = () => {
    inquirer.prompt(inquireObject.budgetUtilization)
    .then((data) => {
        let idInt;
        const setIdInt = async () => {
        for (let i = 0; i < departmentArray.length; i++) {
            if (data.departmentBudget === departmentArray[i]){
                idInt = i + 1
                break;
            }
        }
    }
        
        setIdInt().then(
        db.query(`SELECT department.name, SUM(salary) AS total_salaries
        FROM employee JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE department.id = ${idInt}`, 
        (err, results) => {
            if (err){
                console.log(err)
            } else {
                console.table(results)
            }
        }))
        mainMenu();
    })
};

// This is a function that quits the application. It's called by choosing "Quit" in 
// The Main Menu prompt from inquirer
const laterHaters = () => process.exit();

// This is the workhorse function that allows inquirer to run. 
// Every option except for "Quit" will ultimately return the user to the main menu, as will my "init()" function
// It uses a simple series of "IF" "ELSE IF" functions to read the user's selection and fire off the
// associated function from above. As previously noted, I wrote my "getAllRoles()" function as an async
// function, so here that SPECIFIC function also has a .then() which calls mainMenu()
// It ends with a linebreak to the console, so the menu doesn't mess with the tables returned by the 
// View All functions.
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
        } else if (data.mainMenu === "Salary Budget Utilization"){
            budgetFunction();
        } else if (data.mainMenu === "Quit"){
            laterHaters();
        }
    })
    console.log(`\n =================`)
}

// This is the function that starts the application. It primes the arrays, using the single occurance of the
// primeArrays() function, and then launches the main menu. Because primeArrays isn't async, it's theoretically
// possible that a user could reference an array before it's done being built, but that would require them to
// choose an option literally within milliseconds, or for the arrays to be staggeringly long.
const init = () => {
primeArrays();
mainMenu();
}

// Wow, 400 lines! Anyway, this is the function "init()" being called at the beginning of the application running.
init();