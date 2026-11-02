
import test from "node:test";
import assert from "node:assert/strict";

import {
  STORAGE_KEY,
  loadTasks,
  saveTasks,
  addTask,
  removeTask,
  changeTaskStatus,
} from "../src/taskLogic.js";

function createStorage() {
  const data = new Map();

  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
  };
}

test("creates a task with default todo status", () => {
  const result = addTask(
    [],
    {
      title: "  New task  ",
      description: "Example",
      priority: "High",
    },
    "task-1"
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].title, "New task");
  assert.equal(result[0].status, "todo");
});

test("rejects empty task titles", () => {
  assert.throws(() =>
    addTask(
      [],
      {
        title: " ",
        description: "",
        priority: "Low",
      },
      "task-2"
    )
  );
});

test("removes the selected task", () => {
  const tasks = [
    { id: 1 },
    { id: 2 },
  ];

  const result = removeTask(tasks, 1);

  assert.deepEqual(result, [{ id: 2 }]);
  assert.equal(tasks.length, 2);
});

test("changes task status", () => {
  const tasks = [
    { id: 1, status: "todo" },
  ];

  const result = changeTaskStatus(
    tasks, 1, "done"
  );

  assert.equal(result[0].status, "done");
  assert.equal(tasks[0].status, "todo");
});

test("rejects invalid status", () => {
  assert.throws(() =>
    changeTaskStatus([], 1, "unknown")
  );
});

test("saves and reloads tasks", () => {
  const storage = createStorage();
  const tasks = [
    {
      id: "x",
      title: "Saved task",
      description: "",
      priority: "Medium",
      status: "todo",
    },
  ];

  assert.equal(saveTasks(storage, tasks), true);
  assert.deepEqual(loadTasks(storage), tasks);
});

test("preserves an intentionally empty board", () => {
  const storage = createStorage();

  saveTasks(storage, []);

  assert.deepEqual(loadTasks(storage), []);
});

test("recovers from invalid stored data", () => {
  const storage = createStorage();

  storage.setItem(STORAGE_KEY, "{invalid");

  const result = loadTasks(storage);

  assert.ok(result.length > 0);
});

test("handles storage errors", () => {
  const storage = {
    setItem() {
      throw new Error("Storage unavailable");
    },
  };

  assert.equal(saveTasks(storage, []), false);
});
