import { Project } from './models.js';
import { Todo } from './models.js';

export const allProjects = [];

export function saveToLocalStorage() {
    localStorage.setItem('allProjects', JSON.stringify(allProjects));
}

export function loadFromLocalStorage() {
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
