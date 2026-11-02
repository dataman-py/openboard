
import React, { useEffect, useState } from "react";

import {
  loadTasks,
  saveTasks,
  addTask,
  removeTask,
  changeTaskStatus,
} from "./taskLogic.js";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export default function App() {
  const [tasks, setTasks] = useState(() =>
    loadTasks(getStorage())
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const saved = saveTasks(getStorage(), tasks);
    setStorageError(!saved);
  }, [tasks]);

  function handleAddTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    const id =
      globalThis.crypto?.randomUUID?.() ??
      `task-${Date.now()}-${Math.random()}`;

    setTasks((previous) =>
      addTask(
        previous,
        { title, description, priority },
        id
      )
    );

    setTitle("");
    setDescription("");
    setPriority("Medium");
  }

  function handleDeleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    setTasks((previous) =>
      removeTask(previous, task.id)
    );
  }

  function handleStatusChange(id, status) {
    setTasks((previous) =>
      changeTaskStatus(previous, id, status)
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">O</span>
          <span>OpenBoard</span>
        </div>
        <span className="version">Preview v0.2</span>
      </header>

      <main className="main">
        <div className="page-heading">
          <div>
            <h1>Project Board</h1>
            <p>Organize and track your work.</p>
          </div>
          <span className="task-count">
            {tasks.length} Tasks
          </span>
        </div>

        {storageError && (
          <p className="storage-warning" role="alert">
            Changes could not be saved in this browser.
          </p>
        )}

        <section className="create-panel">
          <h2>Create New Task</h2>

          <form
            className="task-form"
            onSubmit={handleAddTask}
          >
            <label>
              Task Title
              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter task title"
                maxLength={120}
                required
              />
            </label>

            <label>
              Description
              <input
                type="text"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Optional description"
              />
            </label>

            <label>
              Priority
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <button type="submit" className="add-button">
              + Add Task
            </button>
          </form>
        </section>

        <div className="board">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.id
            );

            return (
              <section className="column" key={column.id}>
                <div className="column-header">
                  <h2>{column.title}</h2>
                  <span className="count">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="task-list">
                  {columnTasks.map((task) => (
                    <article
                      className="task-card"
                      key={task.id}
                    >
                      <div className="task-top">
                        <span
                          className={
                            "priority " +
                            task.priority.toLowerCase()
                          }
                        >
                          {task.priority}
                        </span>

                        <button
                          type="button"
                          className="delete-button"
                          aria-label={`Delete ${task.title}`}
                          onClick={() =>
                            handleDeleteTask(task)
                          }
                        >
                          Delete
                        </button>
                      </div>

                      <h3>{task.title}</h3>
                      <p>{task.description}</p>

                      <label className="status-label">
                        Status
                        <select
                          value={task.status}
                          onChange={(event) =>
                            handleStatusChange(
                              task.id,
                              event.target.value
                            )
                          }
                        >
                          {columns.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                            >
                              {option.title}
                            </option>
                          ))}
                        </select>
                      </label>
                    </article>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="empty-state">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
