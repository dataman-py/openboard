
import { useState } from "react";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const initialTasks = [
  {
    id: 1,
    title: "Design task creation form",
    description: "Create a form for adding new tasks.",
    status: "todo",
    priority: "High",
  },
  {
    id: 2,
    title: "Implement task filtering",
    description: "Filter tasks by status and priority.",
    status: "todo",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Build Kanban board",
    description: "Create the initial board layout.",
    status: "progress",
    priority: "High",
  },
  {
    id: 4,
    title: "Initialize repository",
    description: "Configure the project structure.",
    status: "done",
    priority: "Low",
  },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);

  function changeStatus(taskId, newStatus) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">O</span>
          <span>OpenBoard</span>
        </div>
        <span className="version">Early Preview v0.1</span>
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
                    <article className="task-card" key={task.id}>
                      <div className="task-top">
                        <span
                          className={
                            "priority " +
                            task.priority.toLowerCase()
                          }
                        >
                          {task.priority}
                        </span>
                        <span className="task-id">
                          #{task.id}
                        </span>
                      </div>

                      <h3>{task.title}</h3>
                      <p>{task.description}</p>

                      <label className="status-label">
                        Status
                        <select
                          value={task.status}
                          onChange={(event) =>
                            changeStatus(
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
