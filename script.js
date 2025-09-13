const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
const search = document.getElementById("search");
const clearAll = document.getElementById("clearAll");
const darkMode = document.getElementById("darkMode");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => { if (e.key === "Enter") addTask(); });
filter.addEventListener("change", renderTasks);
search.addEventListener("input", renderTasks);
clearAll.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});
darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!text) return;

  tasks.push({ text, dueDate, done: false });
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    if (filter.value === "done") return task.done;
    if (filter.value === "pending") return !task.done;
    return true;
  });

  if (search.value.trim() !== "") {
    filteredTasks = filteredTasks.filter(task => 
      task.text.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";
    li.innerHTML = `
      <div>
        <span>${task.text}</span>
        ${task.dueDate ? `<small>Due: ${task.dueDate}</small>` : ""}
      </div>
      <div>
        <button onclick="toggleTask(${index})">✓</button>
        <button onclick="editTask(${index})">✎</button>
        <button onclick="deleteTask(${index})">x</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
