// File: js/app.js
// Student: youseef bani fadil (12428987)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    http://portal.almasar101.com/assignment/api

  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }
     Returns JSON with the added task.

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY
     - If "id" is omitted: returns all tasks for this student.
     - If "id=NUMBER" is provided: returns one task.

  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
     Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12428987";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 * You can use this in your code.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/**
 * TODO 1:
 * When the page loads, fetch all existing tasks for this student using:
 *   GET: API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 * Then:
 *   - Parse the JSON response.
 *   - Loop over the "tasks" array (if it exists).
 *   - For each task, create an <li> with class "task-item"
 *     and append it to #task-list.
 */
document.addEventListener("DOMContentLoaded", async function () {
  const url = API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.tasks && Array.isArray(data.tasks)) {
      list.innerHTML = ""; 

        data.tasks.forEach(task => {
          renderTask(task);
      });
    }
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
});


/**
 * TODO 2:
 * When the form is submitted:
 *   - prevent the default behaviour.
 *   - read the value from #task-input.
 *   - send a POST request using fetch to:
 *       API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 *     with headers "Content-Type: application/json"
 *     and body JSON: { title: "..." }
 *   - on success, add the new task to the DOM and clear the input.
 */if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    const url = `${API_BASE}/add.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}`;

    try {
      setStatus("Adding task...");

      const request = await fetch(url, { method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify({ title }),});

      if (!request.ok) {
        throw new Error("Request failed: " + request.status);
      }

      const data = await request.json();

      if (data.success) {
        setStatus("Task added successfully");

         function appendTaskToList(task) {
           renderTask(task);
          }

        appendTaskToList(data.task);
          input.value = "";               
       }
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

/**
 * TODO 3:
 * For each task that you render, create a "Delete" button.
 * When clicked:
 *   - send a request to:
 *       API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + TASK_ID
 *   - on success, remove that <li> from the DOM.
 *
 * You can create a helper function like "renderTask(task)" that:
 *   - Creates <li>, <span> for title, and a "Delete" <button>.
 *   - Attaches a click listener to the delete button.
 *   - Appends the <li> to #task-list.
 */

// Suggested helper (you can modify it or make your own):
function renderTask(task) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const button = document.createElement("button");

  li.className = "task-item";
  button.className = "delete-button";

  span.textContent = task.title;
  button.textContent = "Delete";

  button.style.backgroundColor = "red";
  button.style.borderRadius = "5px";
  button.style.border = "1px solid red";
  button.style.cursor = "pointer";
  button.style.color = "white";

  button.addEventListener("click", async function () {
    const urldelete = API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + task.id;

    try {
      const request = await fetch(urldelete, { method: "GET" });
      const data = await request.json();

      if (data.success) {
        li.remove();
      }
    } catch (err) {
       console.error(err);
      setStatus(err.message, true);
    }
  });

  li.appendChild(span);
  li.appendChild(button);
  list.appendChild(li);
}