DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT, FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT, FOREIGN KEY (role_id) REFERENCES role(id),
    manager_id INT, FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT into department(name)
VALUES ('Sales'),
('Product Engineering'),
('Customer Support');

INSERT into role(title, salary, department_id)
VALUES("Sales Manager", 120000, 1),
("Lead Coordinator", 100000, 1),
("Inside Sales Representative", 45000, 1),
("Project Manager", 140000, 2),
("Senior Engineer", 120000, 2),
("Engineer", 100000, 2),
("Junior Engineer", 70000, 2),
("Support Manager", 70000, 3),
("Senior Agent", 45000, 3),
("Agent", 36000, 3);

INSERT into employee(first_name, last_name, role_id, manager_id)
VALUES("Sally", "Fields", 1, 1),
("David", "Styles", 2, 1),
("Greg", "Golphin", 3, 2),
("Amanda", "Bowman", 3, 2),
("Harry","Potter", 4, 4),
("Ron","Weasely", 5, 4),
("Ginny","Weasely", 6, 4),
("Seamus","Finnegan", 6, 4),
("Austin","Andrews", 7, 5),
("Kyle","Henriksen", 8, 10),
("Maria","Paterno", 9, 10),
("Tracye","Wilhelm", 10, 10),
("Joe","Dugan", 10, 10);