// ========================
// CLASS DEFINITIONS
// ========================

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
  
  // Class for a Project containing multiple Todos
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
  
  // ========================
  // GLOBAL VARIABLES & SELECTORS
  // ========================
  const allProjects = [];
  let currentProject = null;
  let currentTodoIndex = null; // AI COMMENT: To keep track of which todo is being edited
  
  // DOM Selectors
  const form1 = document.getElementById('dForm');
  const addProject = document.getElementById('addP');
  const dialog1 = document.getElementById('dProject');
  const cBtn1 = document.getElementById('dBtn1');
  const sBtn1 = document.getElementById('dBtn2');
  const sideCnt = document.getElementById("sidebar");
  const hdAdd = document.getElementById('header');
  const subCnt = document.getElementById('subContainer');
  const dialog2 = document.getElementById('dTodo');
  const form2 = document.getElementById('dForm2');
  const cBtn2 = document.getElementById('cancel2');
  const sBtn2 = document.getElementById('add2');
  
  // New selectors for Edit Todo Dialog - AI COMMENT: New dialog for editing todos
  const dialogEdit = document.getElementById('dEditTodo');
  const formEdit = document.getElementById('dFormEdit');
  const cancelEditBtn = document.getElementById('cancelEdit');
  const updateTodoBtn = document.getElementById('updateTodo');
  const deleteTodoBtn = document.getElementById('deleteTodo');
  
  // ========================
  // LOCAL STORAGE FUNCTIONS
  // ========================
  
  // AI COMMENT: Function to save projects array to localStorage
  function saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(allProjects));
  }
  
  // AI COMMENT: Function to load projects from localStorage and rehydrate class instances
  function loadFromLocalStorage() {
    const storedData = localStorage.getItem('projects');
    if (storedData) {
      const parsedProjects = JSON.parse(storedData);
      allProjects.length = 0; // Clear existing
      // Clear sidebar UI first
      document.querySelectorAll('.pName').forEach(el => el.remove());
      parsedProjects.forEach(proj => {
        const project = new Project(proj.name);
        proj.todos.forEach(t => {
          const todo = new Todo(t.title, t.description, t.dueDate, t.priority);
          todo.completed = t.completed;
          project.addTodo(todo);
        });
        allProjects.push(project);
        addProjectButton(project); // AI COMMENT: Rebuild project button in sidebar
      });
      // AI COMMENT: If any project exists, select the first one and update UI.
      if (allProjects.length > 0) {
        selectProject(allProjects[0]);
      }
    }
  }
  
  // ========================
  // UI RENDERING FUNCTIONS
  // ========================
  
  // AI COMMENT: Function to render a single todo in the main container
  function createTodo(newT, index) {
    const tDiv = document.createElement('div');
    tDiv.className = "tDiv";
    tDiv.dataset.index = index; // AI COMMENT: Store index for reference
  
    const tDivTitle = document.createElement('p');
    tDivTitle.className = "tDivTitle";
    tDivTitle.textContent = "'" + newT.title + "'";
    tDiv.appendChild(tDivTitle);
  
    const tDivDd = document.createElement('p');
    tDivDd.className = "tDivDd";
    if (!newT.dueDate) {
      tDivDd.textContent = "Due-Date : N/A";
    } else {
      let dateValue = newT.dueDate;
      let [year, month, day] = dateValue.split("-");
      let formattedDate = `${day}-${month}-${year}`;
      tDivDd.textContent = "Due-Date : " + formattedDate;
    }
    tDiv.appendChild(tDivDd);
  
    // AI COMMENT: Click event to open edit dialog for this todo
    tDiv.addEventListener("click", () => {
      currentTodoIndex = index;
      openEditDialog(newT);
    });
  
    subCnt.appendChild(tDiv);
  }
  
  // AI COMMENT: Function to update the list of todos for the current project
  function renderTodos() {
    subCnt.innerHTML = "";
    if (currentProject) {
      currentProject.todos.forEach((todo, index) => {
        createTodo(todo, index);
      });
    }
  }
  
  // AI COMMENT: Function to add the "Add Todo" button if not already present
  let addTodoBtnExists = false;
  function createAddTodoBtn() {
    if (!addTodoBtnExists) {
      const addTodo = document.createElement('button');
      addTodo.textContent = "Add Todos";
      addTodo.type = "button";
      addTodo.id = "addTodoBtn";
      hdAdd.appendChild(addTodo);
      addTodoBtnExists = true;
  
      addTodo.addEventListener("click", (e) => {
        e.preventDefault();
        // AI COMMENT: Open the Add Todo dialog
        dialog2.showModal();
      });
    }
  }
  
  // AI COMMENT: Function to add a project button to the sidebar
  function addProjectButton(project) {
    const newP = document.createElement('button');
    newP.className = "pName";
    newP.type = "button";
    newP.textContent = project.name;
    sideCnt.appendChild(newP);
  
    newP.addEventListener("click", (e) => {
      e.preventDefault();
      selectProject(project);
    });
  }
  
  // AI COMMENT: Function to update the UI when selecting a project
  function selectProject(project) {
    currentProject = project;
    createAddTodoBtn();
    renderTodos();
  }
  
  // ========================
  // EVENT LISTENERS
  // ========================
  
  // Project Dialog Listeners
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
    addProjectButton(newProject);
    // AI COMMENT: If no project was previously selected, select this one
    if (!currentProject) {
      selectProject(newProject);
    }
    saveToLocalStorage();
    dialog1.close();
    form1.reset();
  });
  
  // Add Todo Dialog Listeners
  form2.addEventListener("submit", (event) => {
    event.preventDefault();
    const todoTitle = document.getElementById('tTitle').value;
    const todoDescription = document.getElementById('tDescription').value;
    const todoDd = document.getElementById('tDueDate').value;
    const todoP = document.getElementById('tPriority').value;
    const newTodo = new Todo(todoTitle, todoDescription, todoDd, todoP);
    currentProject.addTodo(newTodo);
    renderTodos();
    saveToLocalStorage();
    dialog2.close();
    form2.reset();
  });
  
  cBtn2.addEventListener("click", () => {
    dialog2.close();
    form2.reset();
  });
  
  // ========================
  // EDIT TODO DIALOG LISTENERS & FUNCTIONS
  // ========================
  
  // AI COMMENT: Function to open the edit dialog and populate fields with the selected todo data
  function openEditDialog(todo) {
    document.getElementById('etTitle').value = todo.title;
    document.getElementById('etDescription').value = todo.description;
    document.getElementById('etDueDate').value = todo.dueDate;
    document.getElementById('etPriority').value = todo.priority;
    dialogEdit.showModal();
  }
  
  // Cancel editing
  cancelEditBtn.addEventListener("click", () => {
    dialogEdit.close();
    formEdit.reset();
  });
  
  // Update Todo on submit of edit form
  formEdit.addEventListener("submit", (event) => {
    event.preventDefault();
    // AI COMMENT: Update the todo in the current project
    const updatedTitle = document.getElementById('etTitle').value;
    const updatedDescription = document.getElementById('etDescription').value;
    const updatedDueDate = document.getElementById('etDueDate').value;
    const updatedPriority = document.getElementById('etPriority').value;
  
    if (currentProject && currentTodoIndex !== null) {
      const todo = currentProject.todos[currentTodoIndex];
      todo.title = updatedTitle;
      todo.description = updatedDescription;
      todo.dueDate = updatedDueDate;
      todo.priority = updatedPriority;
      renderTodos();
      saveToLocalStorage();
    }
    dialogEdit.close();
    formEdit.reset();
  });
  
  // Delete Todo button listener
  deleteTodoBtn.addEventListener("click", () => {
    if (currentProject && currentTodoIndex !== null) {
      currentProject.removeTodo(currentTodoIndex);
      renderTodos();
      saveToLocalStorage();
    }
    dialogEdit.close();
    formEdit.reset();
  });
  
  // ========================
  // INITIALIZATION
  // ========================
  
  // AI COMMENT: On page load, try to load from localStorage
  loadFromLocalStorage();
  
  // AI COMMENT: If no project loaded from storage, then set up default instructions or behavior
  if (allProjects.length === 0) {
    // Optionally, create a default project.
    const defaultProject = new Project("Default");
    allProjects.push(defaultProject);
    addProjectButton(defaultProject);
    selectProject(defaultProject);
    saveToLocalStorage();
  }
  