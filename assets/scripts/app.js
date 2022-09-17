class DOMHelper {
    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId);
        const destinationEl = document.querySelector(newDestinationSelector);
        destinationEl.append(element); // Moving the element
    }
}

class ToolTip {
    constructor(projectId) {
        this.id = projectId;
        this.element;
    }

    render() {
        const rootEl = document.getElementById(this.id);

        const isCreated = rootEl.querySelector('p.card');
        if(isCreated) {
            return;
        }
        
        const infoData = rootEl.dataset.extraInfo;
        const toolTipEl = document.createElement('div');
        toolTipEl.textContent = infoData;
        toolTipEl.style.position = 'absolute';
        toolTipEl.classList = 'card';
        rootEl.append(toolTipEl);
        this.element = toolTipEl;
        this.element.addEventListener('click', this.deleteToolTip);
    }

    deleteToolTip() {
        if (this.element) {
            this.element.remove();
        }
    }
}

class ProjectItem {
    constructor(id, updateProjectListFunction, type) {
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type)
    }

    connectMoreInfoButton() {
        const moreInfoBtn = document.getElementById(this.id).querySelector('button');
        const toolTip = new ToolTip(this.id);
        moreInfoBtn.addEventListener('click', toolTip.render.bind(this));
    }

    connectSwitchButton(type) {
        const projectItemEl = document.getElementById(this.id);
        let switchBtn = projectItemEl.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener('click', this.updateProjectListHandler.bind(null, this.id));
        
    }

    update(updateProjectListFunction, type) {
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectSwitchButton(type)
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`); //Get the li of the projectList dinamically with the ID
        for (const prjItem of prjItems) {
            this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this),this.type));
        }
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project); //Pushing the project from the array in A to B or B to A
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
    }

    switchProject(projectId) {
        /* const projectIndex = this.projects.findIndex(p => p.id === projectId);
        this.projects.splice(projectIndex, 1); */
        this.switchHandler(this.projects.find(p => p.id === projectId));
        this.projects = this.projects.filter(p => p.id !== projectId);
    }
}

class App {
    static init() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList)); //Passing the correct instance refering to it in bind
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));
    }
}

App.init();

