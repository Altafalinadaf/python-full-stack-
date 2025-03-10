from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

# Database setup
def get_db_connection():
    conn = sqlite3.connect('tasks.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database
def init_db():
    with get_db_connection() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task TEXT NOT NULL
            )
        ''')
        conn.commit()

# Route to serve the front-end
@app.route('/')
def index():
    return render_template('index.html')

# Route to add a new task
@app.route('/add-task', methods=['POST'])
def add_task():
    data = request.get_json()
    task = data.get('task')

    if not task:
        return jsonify({'message': 'Task cannot be empty!'}), 400

    with get_db_connection() as conn:
        conn.execute('INSERT INTO tasks (task) VALUES (?)', (task,))
        conn.commit()

    return jsonify({'message': 'Task added successfully!'})

# Route to fetch all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    with get_db_connection() as conn:
        tasks = conn.execute('SELECT * FROM tasks').fetchall()
        tasks_list = [dict(task) for task in tasks]
    return jsonify(tasks_list)

# Route to delete a task
@app.route('/delete-task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    with get_db_connection() as conn:
        conn.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        conn.commit()
    return jsonify({'message': 'Task deleted successfully!'})

# Route to update a task
@app.route('/update-task/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    new_task = data.get('task')

    if not new_task:
        return jsonify({'message': 'Task cannot be empty!'}), 400

    with get_db_connection() as conn:
        conn.execute('UPDATE tasks SET task = ? WHERE id = ?', (new_task, task_id))
        conn.commit()
    return jsonify({'message': 'Task updated successfully!'})

# Initialize the database
init_db()

if __name__ == '__main__':
    app.run(debug=True)