const files = require('./utils/files');

class TodoList {
  constructor(dataJson) {
    this.list = this.deSerializeJson(dataJson) || [];
  }

  deSerializeJson(rawJson) {
    return rawJson.map(json => {
      return Object.create(TodoItem.prototype, Object.getOwnPropertyDescriptors(json));
    });
  }

  add(todoItem) {
    this.list.push(todoItem);
  }

  getItemById(id) {
    return this.list.find(item => item.id === id);
  }

  markAllIncomplete() {
    this.list.forEach(item => {
      item.markAsIncomplete();
    });
  }

  remove(id) {
    const indexOfItemToRemove = this.list.findIndex(item => item.id === id);
    this.list.splice(indexOfItemToRemove, 1);
  }

  markAsDone(arrIndex) {
    this.list[arrIndex].markAsDone();
  }

  markAsIncomplete(arrIndex) {
    this.list[arrIndex].markAsIncomplete();
  }

  getTodoList() {
    return this.list;
  }

  toJson() {
    return this.list;
  }

  save() {
    files.save(this.list).then(r => console.log("file saved")).catch(e => console.log(e));
  }

}

class TodoItem {

  static _numInstances = 0;

  constructor(content) {
    this._id = TodoItem._generateId;
    this.title = content;
    this.createdAt = new Date();
    this.isDone = false;
  }

  toggleDone() {
    this.isDone ? this.isDone = false : this.isDone = true;
  }

  get id() {
    return this._id;
  }


  static get _generateId() {
    return ++this._numInstances;
  }

  markAsDone() {
    this.isDone = true;
  }

  markAsIncomplete() {
    this.isDone = false;
  }

}

module.exports = {
  TodoList,
  TodoItem
};

