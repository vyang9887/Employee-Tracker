const inquirer = require('inquirer');
const mysql = require('mysql2');

var allRoles = [];
var allEmp = [];
var allDepts = [];

const db = mysql.createConnection ({ // establishing credentials with mySql every time db is called
    host: 'localhost',
    user: 'root',
    password: 'BisonsAssIsMine!',
    database: 'employees_db'
});

db.query('SELECT * FROM rolename;', function (err, data) {
    for(var i = 0; i < data.length; i++){
        allRoles.push(data[i].title);
    }  
})

db.query('SELECT * FROM employee;', function (err, data) {
    for(var i = 0; i < data.length; i++){
        let currentName = `${data[i].first_name} ${data[i].last_name}`;          
        allEmp.push(currentName);
    }

})

db.query('SELECT * FROM department;', function (err, data) {
    for(var i = 0; i < data.length; i++){
        allDepts.push(data[i].department_name);
    }
})

const questions =  { //array of objects containing all questions used for inquirer
    menu: [
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Role', 'Add Department']
        },
    ],
    newEmp: [
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter the new employee\'s first name.',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter the new employee\'s last name.',
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select the new employee\'s role.',
            choices: allRoles,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select the new employee\'s manager.',
            choices: allEmp,
        },
        
    ],
    updateEmp: [
        {
            type: 'list',
            name: 'update',
            message: 'Please select which employee to update.',
            choices: allEmp,
        },
    ],
    updatedEmp: [
        {
            type: 'input',
            name: 'firstName',
            message: 'Update this employee\'s first name.',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Update this employee\'s last name.',
        },
        {
            type: 'list',
            name: 'role',
            message: 'Update this employee\'s role.',
            default: allRoles,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Update this employee\'s manager.',
            default: allEmp,
        }
    ],
    newRole: [
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role that you would like to add.',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role.',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Choose the department this role belongs to.',
            choices: allDepts,
        },
    ],
    newDept: [
        {
            type: 'input',
            name: 'department',
            message: 'Enter the name of the department that you would like to add.',
        },
    ]
}

function mainMenu() { //main menu function. Inquirer prompt with vast switch statement
    console.log(`=======================================
               Main Menu
=======================================`)
    inquirer.prompt(questions.menu).then((res) => {
        switch(res.menu){
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Departments':
                viewDepts();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            }
        });
    };

function addEmployee(){ //function to add new employee
    inquirer.prompt(questions.newEmp).then((res) => {
        let searchQuery = 'SELECT * FROM rolename where title = "' + res.role + '";';
        var roleID;
        var managerName = res.manager.split(" ");
        var managerID = assignManager(managerName[1]);
        let newName = `${res.firstName} ${res.lastName}`;

        db.query(searchQuery, function (err, data) {
            roleID = data[0].id;

            db.query('INSERT INTO employee SET ?', { 
                first_name: res.firstName, 
                last_name: res.lastName,
                role_id: roleID,
                manager_id: managerID,
            });
        });
        
        allEmp.push(newName);
        console.log('Added successfully');
        mainMenu();
    });
};

function assignManager(manager) { //assigns the employee id number as new hire's manager
    let searchQuery = 'SELECT * FROM employee where last_name = "' + manager + '";';
    db.query(searchQuery, function (err, data) {
        return data[0].id;
    });
};

function addRole(){ //function to add new role
    inquirer.prompt(questions.newRole).then((res) => {
        let searchQuery = 'SELECT * FROM department where department_name = "' + res.department + '";';
        var deptID;

        db.query(searchQuery, function (err, data) {
            deptID = data[0].id;
            db.query('INSERT INTO rolename SET ?', { 
                title: res.title, 
                salary: res.salary,
                department_id: deptID,
            });
        });

        allRoles.push(res.title); 
        console.log('Added successfully');
        mainMenu();
    })
}

function addDepartment(){ //function to add new department
    inquirer.prompt(questions.newDept).then((res) => {
        db.query('INSERT INTO department SET ?', { 
            department_name: res.department,
        });
        allDepts.push(res.department); 
        console.log('Added successfully');
        mainMenu();
    })
}

function viewEmployees() { //shows all employees
    console.log(`=======================================
    View All Employees
=======================================`)
    db.query('SELECT employee.id AS Employee_ID, CONCAT (employee.first_name, " ", employee.last_name) AS Employee_Name, rolename.title AS Job_Title, department.department_name AS Department, rolename.salary AS Salary, employee.manager_id FROM employee JOIN rolename on rolename.id = employee.role_id JOIN Department ON rolename.department_id = department.id ORDER BY employee.id ASC;', function (err, data) { // ID's, first, last, titles, deparment, salaries, manager
        console.table(data);
    })
    return mainMenu();
}

function viewRoles() { //shows all roles
    console.log(`======================================= 
          View All Roles
=======================================`)
    db.query('SELECT * FROM rolename;', function (err, data) {
        
        console.table(data);
    })
    return mainMenu();
}
      
function viewDepts() { //shows all departments
    console.log(`=======================================
          View All Departments
=======================================`)
    db.query('SELECT * FROM department;', function (err, data) {
        console.table(data);
    })
    return mainMenu();
}

function init() { //initializes the application
    console.log(`
   _____________________________________________________________________________________
  |   _______ .___  ___. .______    __        ______   ____    ____  _______  _______   |
  |  |   ____||   |/   | |   _  |  |  |      /  __  |  |   |  /   / |   ____||   ____|  |
  |  |  |__   |  |  /  | |  |_)  | |  |     |  |  |  |  |   |/   /  |  |__   |  |__     |
  |  |   __|  |  | /|  | |   ___/  |  |     |  |  |  |   |_    _/   |   __|  |   __|    |
  |  |  |____ |  |  |  | |  |      |  |----.|  '--'  |     |  |     |  |____ |  |____   |
  |  |_______||__|  |__| | _|      |_______| |______/      |__|     |_______||_______|  |
  |                                                                                     |
  | .___  ___.      ___      .__   __.      ___       _______  _______ .______          |
  | |   |/   |     /   |     |  | /  |     /   |     /  _____||   ____||   _  |         |
  | |  |  /  |    /  ^  |    |   /   |    /  ^  |   |  |  __  |  |__   |  |_)  |        |
  | |  | /|  |   /  /_|  |   |   .   |   /  /_|  |  |  | |_ | |   __|  |      /         |
  | |  |  |  |  /  _____  |  |  / |  |  /  _____  | |  |__| | |  |____ |  ||  |----.    |
  | |__|  |__| /__/     |__| |__| |__| /__/     |__| |______| |_______|| _| |._____|    |
  |_____________________________________________________________________________________| 
  
`);
    mainMenu();
}

init()