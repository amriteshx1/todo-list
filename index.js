// Class for a single Todo item
class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }
}

//Class for a Project containing multiple Todos
class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }
    addTodo(todo) {
        this.todos.push(todo);
    }
    removeTodo(index) {
        this.todos.splice(index, 1);
    }
}

const allProjects = [];


const form1 = document.getElementById('dForm');
const addProject = document.getElementById('addP');
const dialog1 = document.getElementById('dProject');
const cBtn1 = document.getElementById('dBtn1');
const sBtn1 = document.getElementById('dBtn2');
const sideCnt = document.getElementById("sidebar");
const mainCnt = document.getElementById('container');
const subCnt = document.getElementById('subContainer');
const hdAdd = document.getElementById('header');
const dialog2 = document.getElementById('dTodo');
const form2 = document.getElementById('dForm2');
const cBtn2 = document.getElementById('cancel2');
const sBtn2 = document.getElementById('add2');

function createTodo(newT){

    const tDiv = document.createElement('div');
    tDiv.className = "tDiv";

    const tDivTitle = document.createElement('p');
    tDivTitle.className = "tDivTitle";
    tDivTitle.textContent = newT.title;
    tDiv.appendChild(tDivTitle);

    const tDivDescription = document.createElement('p');
    tDivDescription.className = "tDivDescription";
    tDivDescription.textContent = newT.description;
    tDiv.appendChild(tDivDescription);

    const tDivDd = document.createElement('p');
    tDivDd.className = "tDivDd";
    tDivDd.textContent = "Due-Date: " + newT.dueDate;
    tDiv.appendChild(tDivDd);

    const tDivP = document.createElement('p');
    tDivP.className = "tDivP";
    tDivP.textContent = "Priority: " + newT.priority;
    tDiv.appendChild(tDivP);

    subCnt.appendChild(tDiv);

}



form2.addEventListener("submit",(event) =>{
        event.preventDefault(); 
        const todoTitle = document.getElementById('tTitle').value;
        const todoDescription = document.getElementById('tDescription').value;
        const todoDd = document.getElementById('tDueDate').value;
        const todoP = document.getElementById('tPriority').value;
        const newTodo = new Todo(todoTitle, todoDescription, todoDd, todoP);
        createTodo(newTodo);
        dialog2.close();
        form2.reset();
});


cBtn2.addEventListener("click",() =>{
    dialog2.close();
    form2.reset();
});


//ADD PR0JECT & CREATE "ADD TODO" BUTTON PART


let firstTime = false;

function createAddTodoBtn(){
    
    if(!firstTime){
        const addTodo = document.createElement('button');
        addTodo.textContent = "Add Todos";
        addTodo.type = "button";
        addTodo.id = "addTodoBtn";
        hdAdd.appendChild(addTodo);
        firstTime = true;

        addTodo.addEventListener("click", (e) =>{
        e.preventDefault();
        dialog2.showModal();
        })
    }
};


addProject.addEventListener("click", (e) => {
    e.preventDefault();
    dialog1.showModal();
});

cBtn1.addEventListener("click", () => {
    dialog1.close();
    form1.reset();
});

form1.addEventListener("submit", (event) => {
    event.preventDefault();
    const projectName = document.getElementById('pTitle').value;
    const newProject = new Project(projectName);
    allProjects.push(newProject);
    const newP = document.createElement('button');
    newP.className = "pName";
    newP.type = "button";
    newP.textContent = projectName;
    sideCnt.appendChild(newP);

    newP.addEventListener("click",(e) =>{
        e.preventDefault();
        createAddTodoBtn();
    })
    dialog1.close();
    form1.reset();
});
