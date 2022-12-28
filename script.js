'use restrict';
// project elements
const newProjectForm = document.querySelector('[data-new-list-form]');
const newProjectInput = document.querySelector('.new-list');
const projectsContainer = document.querySelector('[data-lists]');
const deleteProjectBtn = document.querySelector('.delete-btn');
const selectedProjectTitle = document.querySelector('[data-list-title]');
const selectedProjectTaskCount = document.querySelector('[data-list-count]');
const newTaskBtn = document.querySelector('.add-btn');
const clearTasksBtn = document.querySelector('.clear-btn');

// task/todo elements
const tasksContainer = document.querySelector('.todo-lister');
const todosContainer = document.querySelector('.todo-list');
const taskTemplate = document.querySelector('#task-template').content.querySelector('.todo');
const closeFormBtn = document.querySelector('.close');
const formContainer = document.querySelector('#modal>.container');
const overlay = document.querySelector('#overlay');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskTitleEl = document.querySelector('#name');
const newTaskDateEl = document.querySelector('#due-date');
const newTaskPriotityEl = document.querySelector('#priority');
const newTaskDescEl = document.querySelector('#description');

const h2 = document.querySelector('.container h2');
const submitInput = document.querySelector(`input[type="submit"]`);

console.log(formContainer);
console.log(taskTemplate);

let projectList = [];
// [{name:'first project', id: '1', tasks}]
let selectedId;
let modalOpen = false;
let editMode = false;
class Project {
	constructor(name, id, tasks = []) {
		this.name = name;
		this.id = id;
		this.tasks = tasks;
	}
}
/*   
    Adding a new project
*/

// add a new project to the project array
newProjectForm.addEventListener('submit', function (e) {
	e.preventDefault();
	if (newProjectInput.value === '') return;
	const newProject = new Project(newProjectInput.value, Date.now().toString());
	console.log(newProject);
	projectList.push(newProject);
	console.log(`current project list`, projectList);
	renderProject(newProject);
	// newProjectInput.value === '';
});

// render project in Dom
const renderProject = function (project) {
	const li = document.createElement('li');
	li.dataset.projectId = project.id;
	li.append(project.name);
	projectsContainer.appendChild(li);
	tasksContainer.style.display = 'block';
};

/*   
    Deleting a project
*/

// from the array
deleteProjectBtn.addEventListener('click', function () {
	if (selectedId === undefined) return;
	projectList = projectList.filter((project) => project.id !== selectedId);
	selectedId = undefined;
	console.log(`Deleted: ${projectList}`);
	deleteProjectDom();
});
// from the dom
const deleteProjectDom = function () {
	document.querySelector('.active-list')?.remove();
	clearTodos();
	//temporary fix
	selectedProjectTitle.textContent = '';
};
/*   
    assign selected id to the selected element
*/

// shows project title on page
const showTitle = function () {
	const currentProject = projectList.find((project) => project.id === selectedId);
	selectedProjectTitle.textContent = currentProject.name;
	console.log(`Current Title: ${selectedProjectTitle.textContent}`);
};

// Assign current selected Project ID to selectedId
projectsContainer.addEventListener('click', function (e) {
	selectedId = e.target?.closest('li')?.dataset.projectId;
	for (const iterator of projectsContainer.children) {
		iterator?.classList?.remove('active-list');
	}
	e.target?.closest('li')?.classList.add('active-list');
	showTitle();
	clearTodos();
	renderTodos();
	console.log(`Current project ID: ${selectedId}`);
});

/////////////////////////////////////////////////////////////////////////

/*

Add new task

*/

const Task = function (title, id, dueDate, priority, desc) {
	return { title, id, dueDate, priority, desc };
};

// hide the new task form
const closeModal = function () {
	formContainer.style.pointerEvents = 'none';
	formContainer.style.transform = 'scale(0)';
	overlay.style.opacity = 0;
	modalOpen = false;
};

// show or hide the new task form
const toggleNewTaskForm = function () {
	if (!selectedId) return;
	// modal elements

	if (modalOpen) {
		closeModal();
	} else {
		h2.textContent = 'New Task';
		submitInput.value = 'Submit';
		formContainer.style.pointerEvents = 'auto';
		// default is scale(0) which means the form is hidden
		formContainer.style.transform = 'scale(1)';
		// dark shade overlay when form is viewed
		overlay.style.opacity = 1;
		modalOpen = true;
	}
};

closeFormBtn.addEventListener('click', closeModal);

// show the new task form
newTaskBtn.addEventListener('click', toggleNewTaskForm);

// render todos on dom
const renderTodos = function () {
	const currentProject = projectList.find((project) => project.id === selectedId);

	console.log(currentProject.tasks);
	currentProject.tasks.forEach((task) => {
		console.log(task);
		const todoDom = taskTemplate.cloneNode(true);
		const todoLabel = todoDom.querySelector('label');
		const lineBreak = document.createElement('br');
		todoDom.querySelector('input[type="checkbox"]').id = task.id;
		todoLabel.htmlFor = task.id;
		todoDom.querySelector('.checkbox').style = 'border: 2px solid rgb(211, 208, 15);';
		todoLabel.append(task.title, lineBreak, task.desc);
		const editButton = document.createElement('p');
		const editSvg =
			'<svg class="svg-inline--fa fa-edit fa-w-18" aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path></svg>';
		editButton.classList.add('edit');
		editButton.innerHTML = editSvg;
		todoDom.querySelector('.task').appendChild(editButton);
		todosContainer.append(todoDom);
	});
};
// add a todo to projectlist array
const addNewTask = function () {
	const newTask = Task(
		newTaskTitleEl.value,
		Date.now().toString(),
		newTaskDateEl.value,
		newTaskPriotityEl.value,
		newTaskDescEl.value
	);

	projectList.map((project) => {
		if (project.id === selectedId) {
			project.tasks.push(newTask);
		}
	});
};

// clear todo list field before adding todos
const clearTodos = function () {
	while (todosContainer.firstChild) {
		todosContainer.firstChild.remove();
	}
};

// new todo form
newTaskForm.addEventListener('submit', (e) => {
	e.preventDefault();
	if (h2.textContent !== `Updating Task`) {
		addNewTask();
	}
	clearTodos();
	renderTodos();
	closeModal();
	editMode = false;
});

// const editButton = document.querySelector('.edit');

todosContainer.addEventListener('click', (e) => {
	const [currentTodos] = projectList.map((project) => {
		return project.tasks;
	});
	const currentTodo = currentTodos.find((task) => {
		return task.id === e?.target.closest('p')?.parentElement?.firstElementChild?.id;
	});

	if (e.target.closest('p')) {
		h2.textContent = `Updating Task`;
		// submitInput.value = 'Submit';
		newTaskTitleEl.value = currentTodo.title;
		newTaskDateEl.value = currentTodo.dueDate;
		newTaskDescEl.value = currentTodo.desc;
		newTaskPriotityEl.value = currentTodo.priority;
		formContainer.style.pointerEvents = 'auto';
		// default is scale(0) which means the form is hidden
		formContainer.style.transform = 'scale(1)';
		// dark shade overlay when form is viewed
		overlay.style.opacity = 1;
		modalOpen = true;
	}
});
