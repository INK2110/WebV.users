CREATE TABLE Role (
	roleId INT PRIMARY KEY,
	roleName VARCHAR(30) NOT NULL 
);
CREATE TABLE Department (
	departmentId INT PRIMARY KEY,
	departmentName VARCHAR(100) NOT NULL 
);

CREATE TABLE Teams(
	teamId INT PRIMARY KEY,
	teamName VARCHAR(100) NOT NULL,
	departmentId INT,
	FOREIGN KEY (departmentId) REFERENCES Department(departmentId)
);

CREATE TABLE Users (
	usersId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	firstName VARCHAR(100) NOT NULL, 
	userLastName VARCHAR(100),
	passWord TEXT NOT NULL,
	usersEmail VARCHAR(100) NOT NULL UNIQUE,
	teamId INT NOT NULL,
	roleId INT NOT NULL,
	phoneNumber VARCHAR(10),
	ispasswordchange BOOLEAN DEFAULT FALSE,
	createAt TIMESTAMP,
	FOREIGN KEY (teamId) REFERENCES Teams(teamId),
	FOREIGN KEY (roleId) REFERENCES Role(roleId)
);

CREATE TABLE Status(
	statusId INT PRIMARY KEY,
	statusState VARCHAR(20) NOT NULL
);

CREATE TABLE Category(
	categoryId INT PRIMARY KEY,
	categoryName VARCHAR(50) NOT NULL
);

CREATE TABLE ServiceLevelAgreement (
	priorityId INT PRIMARY KEY,
	priorityLevel VARCHAR(30),
	responseTime INT,
	resolveTime INT, 
	description TEXT 
);

CREATE TABLE Problem (
	problemId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	createBy INT NOT NULL,
	title VARCHAR(255),
	description TEXT,
	categoryId INT NOT NULL,
	createAt TIMESTAMP,
	statusId INT NOT NULL,
	departmentId INT NOT NULL,
	priorityId INT NOT NULL,
	location VARCHAR(100) NOT NULL,
	comment TEXT
	FOREIGN KEY (createBy) REFERENCES Users(usersId),
	FOREIGN KEY (categoryId) REFERENCES Category(categoryId),
	FOREIGN KEY (statusId) REFERENCES Status(statusId),
	FOREIGN KEY (departmentId) REFERENCES Department(departmentId),
	FOREIGN KEY (priorityId) REFERENCES ServiceLevelAgreement(priorityId)
);

CREATE TABLE Attachment ( 
	fileId INT PRIMARY KEY ,
	problemId INT NOT NULL,
	fileName VARCHAR(255) NOT NULL,
	filePath TEXT NOT NULL,
	uploadedBy INT NOT NULL,
	uploadedAt TIMESTAMP,
	FOREIGN KEY (problemId) REFERENCES Problem(problemId),
	FOREIGN KEY (uploadedBy) REFERENCES Users(usersId)
);

CREATE TABLE ProblemUpdate (
	updateId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	problemId INT NOT NULL,
	oldStatus INT,
	newStatus INT, 
	priorityId INT NOT NULL,
	updatedBy INT NOT NULL,
	updateAt TIMESTAMP NOT NULL,
	comment TEXT,
	FOREIGN KEY (problemId) REFERENCES Problem(problemId),
	FOREIGN KEY (oldStatus) REFERENCES Status(statusId),
	FOREIGN KEY (newStatus) REFERENCES Status(statusId),
	FOREIGN KEY (priorityId) REFERENCES ServiceLevelAgreement(priorityId),
	FOREIGN KEY (updatedBy) REFERENCES Users(usersId)
);

CREATE TABLE WorkAssignment (
    problemId INT NOT NULL,
    usersId INT NOT NULL,
    assignAt TIMESTAMP NOT NULL,
    finishAt TIMESTAMP,
    PRIMARY KEY (problemId, usersId),  
    FOREIGN KEY (problemId) REFERENCES Problem(problemId),
    FOREIGN KEY (usersId) REFERENCES Users(usersId)
);
