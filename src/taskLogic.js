
export const STORAGE_KEY = "openboard.tasks.v1";

export const initialTasks = [
  {
    id: 1,
    title: "Design task creation form",
    description: "Create a form for adding tasks.",
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

const statuses = ["todo", "progress", "done"];
const priorities = ["Low", "Medium", "High"];

function defaultTasks() {
  return initialTasks.map((task) => ({ ...task }));
}

function isValidTask(task) {
  return (
    task !== null &&
    typeof task === "object" &&
    (typeof task.id === "string" ||
      typeof task.id === "number") &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    statuses.includes(task.status) &&
    priorities.includes(task.priority)
  );
}

export function loadTasks(storage) {
  try {
    const saved = storage?.getItem(STORAGE_KEY);

    if (saved == null) {
      return defaultTasks();
    }

    const parsed = JSON.parse(saved);

    if (
      !Array.isArray(parsed) ||
      !parsed.every(isValidTask)
    ) {
      return defaultTasks();
    }

    return parsed;
  } catch {
    return defaultTasks();
  }
}

export function saveTasks(storage, tasks) {
  try {
    if (!storage) return false;

    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}

export function addTask(tasks, values, id) {
  const title = values.title.trim();

  if (!title) {
    throw new Error("Task title cannot be empty.");
  }

  return [
    ...tasks,
    {
      id,
      title,
      description: values.description.trim(),
      priority: values.priority,
      status: "todo",
    },
  ];
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function changeTaskStatus(tasks, id, status) {
  if (!statuses.includes(status)) {
    throw new Error("Invalid task status.");
  }

  return tasks.map((task) =>
    task.id === id ? { ...task, status } : task
  );
}
