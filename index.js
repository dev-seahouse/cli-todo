const log = console.log;
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const prompt = require('./utils/prompts');
const files = require('./utils/files');
const {TodoList, TodoItem} = require('./todo');

let todoList;

// todo: invalid json error handler
// todo: missing user path input validation and error handling
// todo: big clean up

const run = async () => {

  async function initialize() {

    clear();

    log(chalk.blueBright(figlet.textSync('DO IT !', {font: 'Star Wars', horizontalLayout: 'full'})));

    if (!files.isDataExist()) {
      let answer = await prompt.confirmDefaultDataPath();
      if (answer.newDataPath) {
        files.setDataPath(answer.newDataPath);
      }
      await files.createNewData();
    }
    const dataJson = await files.loadJSON(files.getDataPath());
    todoList = new TodoList(dataJson);
  }

  async function getNewTodos(todosToAdd) {

    let userInput = await prompt.addTodo();
    todosToAdd.push(userInput.newTodo);
    // creation of to do can be done here but it would violate separation of concern
    if (userInput.askAgain) {
      return await getNewTodos(todosToAdd);
    } else {
      return todosToAdd
    }
  }

  async function addNewTodo() {
    const newTodosToAdd = await getNewTodos([]);
    await newTodosToAdd.forEach(todo => todoList.add(new TodoItem(todo)));
    todoList.save();
  }

  async function showTodo() {
    const checkedIdsObj = await prompt.displayTodo(todoList.getTodoList());
    const checkedIds = await checkedIdsObj.todoList;
    // mark those with checked ids as done, the rest as undone
    todoList.markAllIncomplete();
    for (const id of checkedIds) {
      const item = todoList.getItemById(id);
      await item.markAsDone();
    }
    todoList.save();
  }

  async function deleteTodo() {
    const checkedIdsObj = await prompt.deleteTodo(todoList.getTodoList());
    const checkedIds = await checkedIdsObj.todoList;
    for (const id of checkedIds) {
      await todoList.remove(id);
    }
  }

  await initialize();

  async function getUserAction() {
    let answer = await prompt.displayMenu();
    if (answer.command === 'add') {
      await addNewTodo();
    } else if (answer.command === 'view') {
      await showTodo();
    } else if (answer.command ==='delete') {

    }
    await getUserAction();
  }

  await getUserAction();

};
run();
