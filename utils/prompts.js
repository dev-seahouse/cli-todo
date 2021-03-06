const inquirer = require('inquirer');
const files = require('./files');
const chalk = require('chalk');
const moment = require('moment');

inquirer.registerPrompt('search-checkbox', require('inquirer-search-checkbox'));

const currentPath = files.getCurrentDir();

const displayMenu = () => {
  const choices = [
    {
      name: 'Add new stuff to do',
      value: 'add'
    },
    {
      name: 'View my list',
      value: 'view'
    },
    {
      name: 'Delete items',
      value: 'delete'
    }
  ];

  const question = [{
    type: 'list',
    name: 'command',
    message: 'Select an option:',
    choices: choices
  }];
  return inquirer.prompt(question);
};

const deleteTodo = () => {
  const choices = todoListArr.map((todoItem, index) => {
    return {
      name: chalk.blue(todoItem.title) + "\t" + chalk.white(moment(todoItem.createdAt).fromNow() +
        "\t" + chalk.white(todoItem.createdAt)),
      value: todoItem.id,
    }
  });
  const questions = {
    type: "checkbox",
    name: 'todoList',
    message: "Select items to remove:",
    choices: choices
  };

  return inquirer.prompt(questions);
};

const confirmDefaultDataPath = () => {
  const choices = [
    {
      name: `Create new storage at ${currentPath}`,
      value: 0,
    },
    {
      name: "Choose a new path:",
      value: 1,
    },
  ];
  const questions = [{
    type: 'list',
    name: 'useDefaultOrNew',
    message: `No data found in storage location.`,
    choices: choices
  }, {
    type: 'input',
    name: 'newDataPath',
    message: "Enter preferred path (e.g ~/mytodo.json): ",
    when: (answer) => answer.useDefaultOrNew === choices[1].value
  }];
  return inquirer.prompt(questions)
};

const addTodo = () => {
  const questions = [{
    type: "input",
    name: 'newTodo',
    message: 'What would you like to do?'
  }, {
    type: "confirm",
    name: "askAgain",
    message: 'Add another one?'
  }];
  return inquirer.prompt(questions);

};


const displayTodo = (todoListArr) => {
  const choices = todoListArr.map((todoItem, index) => {
    return {
      name: chalk.blue(todoItem.title) + "\t" + chalk.white(moment(todoItem.createdAt).fromNow() +
        "\t" + chalk.white(todoItem.createdAt)),
      value: todoItem.id,
      checked: todoItem.isDone
    }
  });
  const questions = {
    type: "checkbox",
    name: 'todoList',
    message: "Select to mark/unmark as done:",
    choices: choices
  };

  return inquirer.prompt(questions);
};

module.exports = {
  displayMenu,
  confirmDefaultDataPath,
  displayTodo,
  addTodo,
  deleteTodo
};