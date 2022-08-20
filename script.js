const newProjectForm = document.querySelector('[data-new-list-form]');
const newProjectInput = document.querySelector('.new-list');
const projectsContainer = document.querySelector('[data-lists]');
const deleteProjectBtn = document.querySelector('.delete-btn');
const selectedProjectTitle = document.querySelector('[data-list-title]');
const selectedProjectTaskCount = document.querySelector('[data-list-count]');

console.log(selectedProjectTitle, selectedProjectTaskCount);

let projectList = [];
// [{name:'first project', id: '1', tasks}]
let selectedId;

class Project {
	constructor(name, id, tasks) {
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
};

/*   
    Deleting a project
*/

deleteProjectBtn.addEventListener('click', function () {
	if (selectedId === undefined) return;
	projectList = projectList.filter((project) => project.id !== selectedId);
	selectedId = undefined;
	console.log(projectList);
	deleteProjectDom();
});

const deleteProjectDom = function () {
	document.querySelector('.active-list')?.remove();
};
/*   
    assign selected id to the selected element
*/

// shows project title on page
const showTitle = function () {
	const currentProject = projectList.find((project) => project.id === selectedId);
	selectedProjectTitle.textContent = currentProject.name;
	console.log(selectedProjectTitle);
};

projectsContainer.addEventListener('click', function (e) {
	selectedId = e.target?.closest('li')?.dataset.projectId;
	for (const iterator of projectsContainer.children) {
		iterator?.classList?.remove('active-list');
	}
	e.target?.closest('li')?.classList.add('active-list');
	showTitle();
	console.log(selectedId);
});

/*

Add new task

*/
