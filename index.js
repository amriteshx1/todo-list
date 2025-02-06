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

let currentEditingTodo = null;
let currentEditingDiv = null;


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
const hdr = document.getElementById('header1');

//local storage part
function saveToLocalStorage() {
    localStorage.setItem('allProjects', JSON.stringify(allProjects));
};

function loadFromLocalStorage() {
    const storedProjects = localStorage.getItem('allProjects');
    if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        projects.forEach(projectData => {
            const project = new Project(projectData.name);
            projectData.todos.forEach(todoData => {
                const todo = new Todo(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
                todo.completed = todoData.completed;
                project.addTodo(todo);
            });
            allProjects.push(project);
        });
    }
}
// end of that

function implementDivBtns(r, v, todoI, tDiv) {
    r.addEventListener("click", (e) => {
        e.preventDefault();
        
        const todoIndex = currentProject.todos.indexOf(todoI);
        if (todoIndex !== -1) {
            currentProject.removeTodo(todoIndex);
        }
        tDiv.remove();
        saveToLocalStorage(); 
    });

    v.addEventListener("click",(e) =>{
        e.preventDefault();
        document.getElementById('tTitle').value = todoI.title;
        document.getElementById('tDescription').value = todoI.description;
        document.getElementById('tDueDate').value = todoI.dueDate;
        document.getElementById('tPriority').value = todoI.priority;
        cBtn2.textContent = "Completed";
        sBtn2.textContent = "Edit";
        currentEditingTodo = todoI;
        currentEditingDiv = tDiv;
        dialog2.showModal();
    })

}

function showTodo(i){
    if (!allProjects[i] || allProjects[i].todos.length === 0) {
        return; 
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

    const btnDiv = document.createElement('div');
    btnDiv.className = 'btnDiv';

    const removeBtn = document.createElement('button');
    removeBtn.className = "tDivBtn";
    removeBtn.type = 'button';
    removeBtn.textContent = "⛔";
    btnDiv.appendChild(removeBtn);

    const viewBtn = document.createElement('button');
    viewBtn.className = "tDivBtn";
    viewBtn.type = 'button';
    viewBtn.textContent = "View";
    btnDiv.appendChild(viewBtn);

    tDiv.appendChild(btnDiv);
    
    subCnt.appendChild(tDiv);
    implementDivBtns(removeBtn, viewBtn, newT, tDiv);
}



form2.addEventListener("submit", (event) => {
    event.preventDefault();
    const todoTitle = document.getElementById('tTitle').value;
    const todoDescription = document.getElementById('tDescription').value;
    const todoDd = document.getElementById('tDueDate').value;
    const todoP = document.getElementById('tPriority').value;
  
    if (currentEditingTodo !== null && currentEditingDiv !== null) {
      // Update the todo object
      currentEditingTodo.title = todoTitle;
      currentEditingTodo.description = todoDescription;
      currentEditingTodo.dueDate = todoDd;
      currentEditingTodo.priority = todoP;

      currentEditingDiv.querySelector('.tDivTitle').textContent = "'" + todoTitle + "'";
  
      const tDivDdElem = currentEditingDiv.querySelector('.tDivDd');
      if (!todoDd) {
        tDivDdElem.textContent = "Due-Date : N/A";
      } else {
        let [year, month, day] = todoDd.split("-");
        let formattedDate = `${day}-${month}-${year}`;
        tDivDdElem.textContent = "Due-Date : " + formattedDate;
      }
  
      currentEditingTodo = null;
      currentEditingDiv = null;
      dialog2.close();
      form2.reset();
      saveToLocalStorage();
      return; 
    }
  
    // If no todo is being edited, create a new one
    const newTodo = new Todo(todoTitle, todoDescription, todoDd, todoP);
    currentProject.addTodo(newTodo);
    createTodo(newTodo);
    dialog2.close();
    form2.reset();
    saveToLocalStorage();
  });


cBtn2.addEventListener("click",() =>{
    if(cBtn2.textContent.trim() === "Completed" && currentEditingDiv){
        currentEditingDiv.style.backgroundColor = "#90ee90";
        currentEditingDiv.style.border = "2px solid #1F2937"

        let t = currentEditingDiv.querySelector('.tDivTitle');
        let d = currentEditingDiv.querySelector('.tDivDd');
        if (t) t.style.color = "#1F2937"; 
        if (d) d.style.color = "#1F2937";

    if (currentEditingTodo) {
        currentEditingTodo.completed = true;
    }

    currentEditingTodo = null;
    currentEditingDiv = null;
}
    dialog2.close();
    form2.reset();
    saveToLocalStorage();
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
        currentEditingDiv = null;
        currentEditingTodo = null;

        cBtn2.textContent = "Cancel";
        sBtn2.textContent = "Add Todos";
        form2.reset();
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
        hdr.textContent = projectName;
        let i = allProjects.findIndex(project => project.name === event.target.textContent);
        currentProject = allProjects[i];
        showTodo(i);
        createAddTodoBtn();
    })
    dialog1.close();
    form1.reset();
    newP.click();
    saveToLocalStorage();
});

document.addEventListener('DOMContentLoaded', () =>{
    loadFromLocalStorage();

    if (allProjects.length > 0) {
        allProjects.forEach(project => {
            const newP = document.createElement('button');
            newP.className = "pName";
            newP.type = "button";
            newP.textContent = project.name;
            sideCnt.appendChild(newP);

            newP.addEventListener("click", (event) => {
                event.preventDefault();
                subCnt.innerHTML = "";
                hdr.textContent = project.name;
                let i = allProjects.findIndex(proj => proj.name === event.target.textContent);
                currentProject = allProjects[i];
                showTodo(i);
                createAddTodoBtn();
            });
        });
        }
        
});