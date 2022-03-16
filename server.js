const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'company_db'
    },
    console.log(`Connected to the courses_db database.`)
  );

app.use(express.static("Scripts"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/departments', (req, res) => {
    console.info(`GET request against /departments received`)
    db.query('SELECT department.name FROM department;', (err, results) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            console.log(results)
            res.json(results)
        }
    })
});

app.get('/roles', (req, res) => {
    console.info(`GET request against /roles received`);
    db.query('SELECT role.title, role.id, department.id, role.salary FROM role JOIN department ON role.department_id = department.id;'),
    (err, results) => {
        if (err){
            console.info(err)
            res.json(err)
        } else {
            console.info(results)
            res.json(results)
        }
    }
});

app.get('/employees', (req, res) => {
    console.info(`GET request against /employees received`)
    db.query('SELECT employee.first_name, employee.last_name, employee.id, role.title, department.name, role.salary FROM ((employee JOIN role ON employee.role_id = role.id) JOIN department ON role.department_id = department.id);'),
    (err, results) => {
        if (err){
            console.info(err)
            res.json(err)
        } else {
            console.info(results)
            res.json(results)
        }
    }
});

app.get('*', (req, res) => {
    console.info(`404! Bad GET received.`);
    res.send(`404! Bad GET received`);
})


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});