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
let currentProject = null;


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

function showTodo(i){
    if (!allProjects[i] || allProjects[i].todos.length === 0) {
        return; // Do nothing if the array is empty
    };

    const cProject = allProjects[i];
    cProject.todos.forEach(element => {
        createTodo(element);
    });
}

function createTodo(newT){

    const tDiv = document.createElement('div');
    tDiv.className = "tDiv";

    const tDivTitle = document.createElement('p');
    tDivTitle.className = "tDivTitle";
    tDivTitle.textContent = "'" + newT.title + "'";
    tDiv.appendChild(tDivTitle);

    const tDivDd = document.createElement('p');
    tDivDd.className = "tDivDd";
    if(!newT.dueDate){
        tDivDd.textContent = "Due-Date : N/A";
    }else{
        let dateValue = newT.dueDate;
        let [year, month, day] = dateValue.split("-");
        let formattedDate = `${day}-${month}-${year}`;
        tDivDd.textContent = "Due-Date : " + formattedDate;
    }
    
    tDiv.appendChild(tDivDd);

    subCnt.appendChild(tDiv);

}



form2.addEventListener("submit",(event) =>{
        event.preventDefault(); 
        const todoTitle = document.getElementById('tTitle').value;
        const todoDescription = document.getElementById('tDescription').value;
        const todoDd = document.getElementById('tDueDate').value;
        const todoP = document.getElementById('tPriority').value;
        const newTodo = new Todo(todoTitle, todoDescription, todoDd, todoP);
        currentProject.addTodo(newTodo);
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
    currentProject = newProject;

    newP.addEventListener("click",(event) =>{
        event.preventDefault();
        subCnt.innerHTML = "";
        let i = allProjects.findIndex(project => project.name === event.target.textContent);
        showTodo(i);
        createAddTodoBtn();
    })
    dialog1.close();
    form1.reset();
});
