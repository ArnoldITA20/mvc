class Model {
  constructor(){
    // data
    this.tasks = [
      {id:0, text: 'Be good', complete: false},
      {id:1, text: 'Be nice', complete: false}
    ]
  }
  delTask(delItem){
          // leiab listist object ja siis kustutab selle objecti listist.
          let i = 0;
      while (i < this.tasks.length) {
        let nrID = this.tasks[i].id;
        let task = this.tasks[i];
        if (nrID == event.target.parentElement.id) {
          console.log("sain: " + event.target.parentElement.id)
          var filtered = this.tasks.filter(function(value, index, arr){ 
      // vaja leida listi väärtust, objecti mis on selle IDega

        return value != task;
    });
        }
        i++;
      }
    this.tasks = filtered;

    // callback changed controll
    this.onTaskListChanged(this.tasks)
  }
  addTask(taskText){
    // create id
    let id
    if(this.tasks.length > 0){
      id = this.tasks[this.tasks.length - 1].id + 1
    } else {
      id = 1
    }
    // create task object
    const task = {
      id: id,
      text: taskText,
      complete: false
    }
    // add task to this.tasks
    this.tasks.push(task)
    // callback changed controll
    this.onTaskListChanged(this.tasks)
  }

  // 
  taskListChanged(callback){
    console.log('model - tasks changed')
    this.onTaskListChanged = callback
  }
}

class View {

  constructor(){
    // basic view
    // root element
    this.app = this.getElement('#root')
    // title
    this.title = this.setElement('h1')
    this.title.textContent = 'Tasks'
    // form
    this.form = this.setElement('form')
    // form input
    this.input = this.setElement('input')
    this.input.type = 'text'
    this.input.name = 'task'
    this.input.placeholder = 'Add new task'
    // submit button
    this.submitButton = this.setElement('button')
    this.submitButton.textContent = 'Add task'
    // add input and button to form
    this.form.append(this.input, this.submitButton)
    // task list
    this.taskList = this.setElement('ul')
    // append title and task list to app
    this.app.append(this.title, this.form, this.taskList)
  }

  // display tasks
  displayTasks(tasks){
    // delete all tasks before displaing
    while(this.taskList.firstChild){
      this.taskList.removeChild(this.taskList.firstChild)
    }

    if(tasks.length === 0){
      const p = this.setElement('p')
      p.textContent = 'Add a task if is nothing to do'
      this.taskList.append(p)
    } else {
      tasks.forEach(task => {
      // create li
      const li = this.setElement('li')
      li.id = task.id
      // task item complete toggle check
      const checkbox = this.setElement('input')
      checkbox.type = 'checkbox'
      checkbox.cheked = task.complete
      // text span
      const span = this.setElement('span')
      // if task item is complete - strike trough
      if(task.complete === true){
        const strike = this.setElement('s')
        strike.textContent = task.text
        span.append(strike)
      } else {
        span.textContent = task.text
      }
      // delete button
      const deleteButton = this.setElement('button', 'delete')
      deleteButton.textContent = 'Delete'
      // appned checkbox and span to li
      li.append(checkbox, span, deleteButton)
      // append created li to task list
      this.taskList.append(li)
    })
    }
  }

  // events
  addTask(handler){
    this.form.addEventListener('submit', event => {
      console.log('submit')
      event.preventDefault()
      if(this._taskText){
        handler(this._taskText)
        this.resetInput()
      }
    })
  }

  // getters
  getElement(selector){
    const element = document.querySelector(selector)
    return element
  }

  get _taskText(){
    return this.input.value
  }

  // setters
  setElement(tag, classname){
    const element = document.createElement(tag)
    if(classname !== undefined){
      element.classList.add(classname)
    }
    return element
  }

  delTask(handler){
    this.taskList.addEventListener('click', event => {
      if (event.target.textContent == 'Delete'){
        event.preventDefault()
        handler(this._taskText)
        this.resetInput()
      }
    })
  }

  // resetter
  resetInput(){
    this.input.value = ''
  }
}

class Controller {
  constructor(model, view){
    this.model = model
    this.view = view

    this.model.taskListChanged(this.displayTasks)
    this.view.addTask(this.handleAddTask)
    this.view.delTask(this.handleDelTask)
    this.displayTasks(this.model.tasks)
    
  }

  displayTasks = tasks => {
    console.log('controller - tasks changed')
    this.view.displayTasks(tasks)
  }

  handleAddTask = taskText => {
    this.model.addTask(taskText)
    console.log('controller - add task')
  }
  handleDelTask = delItem => {
      this.model.delTask(delItem)
      console.log('controller - delete task')
  }
}

const app = new Controller(new Model(), new View())