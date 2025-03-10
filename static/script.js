// Fetch and display tasks when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
});

// Fetch tasks from the back-end
async function fetchTasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = tasks.map(task => `
    <li>
      <span>${task.task}</span>
      <div>
        <button class="update" onclick="openUpdateModal(${task.id}, '${task.task}')">Update</button>
        <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </li>
  `).join('');
}

// Handle form submission to add a new task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = document.getElementById('taskInput').value;

  const response = await fetch('/add-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });
  const result = await response.json();
  alert(result.message);

  // Clear the input and refresh the task list
  document.getElementById('taskInput').value = '';
  fetchTasks();
});

// Delete a task
async function deleteTask(taskId) {
  const response = await fetch(`/delete-task/${taskId}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  alert(result.message);
  fetchTasks();
}

// Open update modal
function openUpdateModal(taskId, currentTask) {
  const newTask = prompt('Update your task:', currentTask);
  if (newTask !== null) {
    updateTask(taskId, newTask);
  }
}

// Update a task
async function updateTask(taskId, newTask) {
  const response = await fetch(`/update-task/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: newTask })
  });
  const result = await response.json();
  alert(result.message);
  fetchTasks();
}