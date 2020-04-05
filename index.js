const log = console.log;
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const prompt = require('./utils/prompts');
const files = require('./utils/files');
const {TodoList, TodoItem} = require('./todo');

let todoList;

clear();

log(
  chalk.blueBright(
    figlet.textSync('DO IT !', {font: 'Star Wars', horizontalLayout: 'full'})
  )
);

// todo: invalid json error handler
// todo: missing user path input validation and error handling
// todo: big clean up

const run = async () => {
  if (!files.isDataExist()) {
    let answer = await prompt.confirmDefaultDataPath();
    if (answer.newDataPath) {
     files.setDataPath(answer.newDataPath);
    }
    await files.createNewData();
  }
  const dataJson = await files.loadJSON(files.getDataPath());
  todoList = new TodoList(dataJson);

  let answer = await prompt.displayMenu();
  if (answer.command === 'add') {
    const newTodosToAdd = await getNewTodos([]);
    await newTodosToAdd.forEach(todo => todoList.add(new TodoItem(todo)));
    todoList.save();
  }


  async function getNewTodos( todosToAdd) {
    let userInput = await prompt.addTodo();
    todosToAdd.push(userInput.newTodo);
    // creation of to do can be done here but it would violate separation of concern
    if (userInput.askAgain) {
      return await getNewTodos(todosToAdd);
    }else {
      return todosToAdd
    }
  }
};

run();

