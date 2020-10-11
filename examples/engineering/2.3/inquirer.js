const inquirer = require('inquirer')
inquirer
  .prompt([
    /* Pass your questions in here */
    { type: 'input', name: 'username', message: "What's ur name?" },
    { 
        type: 'checkbox', 
        name: 'gender', 
        message: "What's ur gender?", 
        choices: [ 'male', 'female' ]
    },
    { 
        type: 'number', 
        name: 'age', 
        message: 'How old are u?',
        validate: input => Number.isNaN(Number(input)) 
            ? 'Number Required!' : true 
        },
    { 
        type: 'password', 
        name: 'secret', 
        message: 'Tell me a secret.', 
        mask: 'x' 
    }
  ])
  .then(answers => {
    console.log(`Answers are:\n ${JSON.stringify(answers)}`)
  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  })
