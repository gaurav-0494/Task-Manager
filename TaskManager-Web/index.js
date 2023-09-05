const inputBox = document.getElementById("input-box");
const categorySelect = document.getElementById("category-select");
const listContainer = document.getElementById("list-container");
const micButton = document.getElementById("mic-button");
const searchInput = document.getElementById("myInput");
const sortByDueDateButton = document.querySelector('.sortByDueDateButton');
const sortByCategoryButton = document.querySelector('.sortByCategoryButton');

let tasks = [];

function addTask() {
    if (inputBox.value === "") {
        alert("You must write something!");
    } else {
        const dueDate = prompt("Enter due date (YYYY-MM-DD):");

        if (!isValidDate(dueDate)) {
            alert("Invalid due date format or date is not valid. Please use YYYY-MM-DD format and ensure the date is in the future.");
            return;
        }

        const category = categorySelect.value;
        const task = {
            name: inputBox.value,
            dueDate: dueDate,
            category: category,
            completed: false
        };
        tasks.push(task);

        saveData();
        showTask();

        inputBox.value = "";
    }
}

function toggleCheck(taskIndex) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveData();
    showTask();
}

function deleteTask(taskIndex) {
    tasks.splice(taskIndex, 1);
    saveData();
    showTask();
}

function sortByDueDate() {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    saveData();
    showTask();
}

function sortByCategory() {
    tasks.sort((a, b) => a.category.localeCompare(b.category));
    saveData();
    showTask();
}

function filterTasks(searchQuery) {
    const filteredTasks = tasks.filter(task => {
        return task.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    listContainer.innerHTML = "";
    filteredTasks.forEach((task, index) => {
        const li = createTaskListItem(task, index);
        listContainer.appendChild(li);
    });
}

function createTaskListItem(task, index) {

    const li = document.createElement("li");
    li.innerHTML = `${task.name} (Due: ${task.dueDate}), Category: ${task.category}`;
    if (task.completed) {
        li.classList.add("checked");
    }
    
    const currentDate = new Date().toISOString().substr(0, 10);
    if (task.dueDate < currentDate) {
        li.classList.add("overdue");
    } else {
        li.classList.remove("overdue");
    }

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    li.addEventListener("click", () => toggleCheck(index));
    span.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTask(index);
    });

    return li;
}

function saveData() {
    localStorage.setItem("data", JSON.stringify(tasks));
}

function showTask() {
    listContainer.innerHTML = "";

    const storedData = localStorage.getItem("data");
    if (storedData) {
        tasks = JSON.parse(storedData);
        tasks.forEach((task, index) => {
            const li = createTaskListItem(task, index);

            listContainer.appendChild(li);
        });
    }
}

function isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;

    const currentDate = new Date().toISOString().substr(0, 10);
    return dateString >= currentDate;
}

showTask();

sortByDueDateButton.addEventListener("click", sortByDueDate);
sortByCategoryButton.addEventListener("click", sortByCategory);

searchInput.addEventListener("keyup", function () {
    const searchQuery = searchInput.value;
    filterTasks(searchQuery);
});

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

micButton.addEventListener("click", () => {
    micButton.classList.add("active");
    recognition.start();
});

recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    inputBox.value = result;

    const dueDate = prompt("Enter due date (YYYY-MM-DD):");
    const category = categorySelect.value;

    addTaskUsingVoice(result, dueDate, category);

    micButton.classList.remove("active");
};

recognition.onend = () => {
    micButton.classList.remove("active");
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    micButton.classList.remove("active");
};

function addTaskUsingVoice(task, dueDate, category) {
    if (!isValidDate(dueDate)) {
        alert("Invalid due date format or date is not valid. Please use YYYY-MM-DD format and ensure the date is in the future.");
        return;
    }

    const newTask = {
        name: task,
        dueDate: dueDate,
        category: category,
        completed: false
    };
    tasks.push(newTask);

    saveData();
    showTask();
}

