const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

// When render is passed into the write file command with the array of teamMembers, it creates a string template of the html file including html code to represent each teamMember.
const render = require("./src/page-template.js");
// const { validate } = require("jest-validate");

const teamMembers = [];
const idArray = [];

// appMenu gets the ball rolling. It is called at the end of this file being loaded. Every team needs to have a manager at the minimum, So it asks for input for the manager profile and then calls addTeamMember() to add other kinds of team members.

function appMenu() {
  // appMenu is built using the currying technique of nesting functions inside a function. All of the files functions reside within appMenu().

  // Checks to see that the ID is valid number and also that it is unique among team members.
  function validateId(answer) {
    const pass = answer.match(/^[1-9]\d*$/);
    if (pass) {
      //ID's need to be unique. Check to see if this ID is already take.
      if (idArray.includes(answer)) {
        return 'This ID has already been taken. Please enter another one';
      } else return true;
    }
    return 'Please enter a number greater than zero.';
  }

  // Prompst the user to ask for info for a manager.
  function createManager() {
    console.log("Please build your team");
    inquirer.prompt([
      {
        type: "input",
        name: "managerName",
        message: "What is the team manager's name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "Please enter at least one character.";
        }
      },
      {
        type: "input",
        name: "managerId",
        message: "What is the team manager's id?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            return true;
          }
          return "Please enter a positive number greater than zero.";
        }
      },
      {
        type: "input",
        name: "managerEmail",
        message: "What is the team manager's email?",
        validate: answer => {
          const pass = answer.match(
            /\S+@\S+\.\S+/
          );
          if (pass) {
            return true;
          }
          return "Please enter a valid email address.";
        }
      },
      {
        type: "input",
        name: "managerOfficeNumber",
        message: "What is the team manager's office number?",
        validate: answer => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "Please enter a positive number greater than zero.";
        }
      }
    ]).then(answers => {
      // create a manager object from class Engineer
      const manager = new Manager(
        answers.managerName,
        answers.managerId,
        answers.managerEmail,
        answers.managerOfficeNumer
      );

      // add the manager object to teamMembers
      teamMembers.push(manager);
      // add manager id to idArray
      idArray.push(answers.managerId);


      addTeamMember();
    });
  }

  // Prompst the user to add additional team members or indicate that it's time to build the tream structure.
  function addTeamMember() {

    inquirer.prompt([
      {
        type: "list",
        name: "memberChoice",
        message: "Which type of team member would you like to add?",
        choices: [
          "Engineer",
          "Intern",
          "I don't want to add any more team members"
        ]
      }
    ]).then(userChoice => {
      switch (userChoice.memberChoice) {
        case "Engineer":
          addEngineer();
          break;
        case "Intern":
          addIntern();
          break;
        default:
          buildTeam();
      }
    });
  }
  //Prompt user to enter info for an Engineer
  function addEngineer() {
    inquirer.prompt([
      {
        // Prompt questions to user
        type: 'input',
        name: 'engineerName',
        message: "What is the Engineer's name?",
        validate: (answer) => {
          if (answer !== '') {
            return true;
          }
          return 'Please enter at least one character.'
        }
      },
      {
        type: 'input',
        name: 'engineerId',
        message: "What is the engineer's id?",
        validate: validateId

      },
      {
        type: 'input',
        name: 'engineerEmail',
        message: "What is the engineer's email?",
        validate: (answer) => {
          const pass = answer.match(/\S+@\S+\.\S+/);
          if (pass) {
            return true;
          }
          return 'Please enter a valid email address.';
        }

      },
      {
        type: 'input',
        name: 'engineerGitHub',
        message: "What is the engineer's GitHub name?",
        validate: (answer) => {
          if (answer !== '') {
            return true;
          }
          return 'Please enter at least one character.';
        }

      }
    ]).then(answers => {
      // create an engineer object from class Engineer
      const engineer = new Engineer(
        answers.engineerName,
        answers. engineerId,
        answers.engineerEmail,
        answers.engineerGitHub
      );
      // add the engineer object to teamMembers
      teamMembers.push(engineer);
      // add engineer id to idArray
      idArray.push(answers.engineerId);

      addTeamMember();
    });
  }

  function addIntern() {
    inquirer.prompt([
      // prompt questions to user
      {
        type: 'input',
        name: 'internName',
        message: "What is the Intern's name?",
        validate: (answer) => {
          if (answer !== '') {
            return true;

          }
          return 'Please enter at least one character.';
        }
      },
      {
        type: 'input',
        name: 'internId',
        message: "What is the Inter's Id?",
        validate: validateId
      },
      {
        type: 'input',
        name: 'internEmail',
        message: "What is the Intern's email?",
        validate: (answer) => {
          const pass = answer.match(/\S+@\S+\.\S+/);
          if (pass) {
            return true;
          }
          return 'Please enter a valid email address.';
        }
      },
      {
        type: 'input',
        name: 'internSchool',
        message: "What is the name of the Intern's school?",
        validate: (answer) => {
          if (answer !== '') {
            return true;
          }
          return 'Please enter at least one characte.';
        }
      },
    ]).then(answers => {
      // create an intern object from class Engineer
      const intern = new Intern(
        answers.internName,
        answers.internId,
        answers.internEmail,
        answers.internSchool
      );
      // add the intern object to teamMembers
      teamMembers.push(intern);
      // add intern id to idArray
      idArray.push(answers.interId);

      //Ask if user wants to add any additional team members.
      addTeamMember();
    });
  }

  function buildTeam() {
    // Create the output directory if the output path doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
  }

  createManager();

}

appMenu();
