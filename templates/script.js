// Fetch and display tasks when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
});

// Fetch tasks from the back-end
async function fetchTasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = tasks.map(task => `<li>${task.task}</li>`).join('');
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