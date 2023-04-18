INSERT INTO department (department_name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO rolename (title, salary, department_id)
VALUES
    ('Lead Engineer', 200000, 1),
    ('Software Engineer', 100000, 1),
    ('Accountant', 90000, 2),
    ('Account Manager', 130000, 2),
    ('Legal Team Lead', 150000, 3),
    ('Lawyer', 180000, 3),
    ('Salesperson', 80000, 4),
    ('Sales Manager', 110000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Victor', 'Yang', 1, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Nicole', 'Yang', 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Vincent', 'Yang', 3, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Max', 'Yang', 4, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Hubert', 'Chon', 5, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Shnozz', 'Berry', 6, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Andrew', 'Park', 7, 4);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Page', 'Jian', 8, 7);
