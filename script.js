/************Initialisering af To-do appen  Step 1*/
document.addEventListener("DOMContentLoaded", function () {
  const todoForm = document.querySelector("form");
  const todoInput = document.getElementById("todo-input");
  const dueDateInput = document.getElementById("due-date-input");
  const todoListUl = document.getElementById("todo-list");
  const completedList = document.getElementById("completed-list");

  let allTodos = getTodos();
  updateTodoList();
  /******************************Håndtering af tema (mørk/lys tilstand) Step 2******************* */
  const toggleBtn = document.getElementById("toggle-btn");
  const logo = document.getElementById("lightModeIcon");
  const tickSound = new Audio("assets/tick.ogg");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme") || "dark";
  body.dataset.theme = savedTheme;

  if (savedTheme === "light") {
    body.classList.add("light-mode");
    logo.style.display = "none";
  }

  toggleBtn.addEventListener("click", () => {
    const newTheme = body.dataset.theme === "light" ? "dark" : "light";

    body.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);

    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
      logo.style.display = "none"; // Hide logo in light mode
    } else {
      logo.style.display = "block"; // Show logo in dark mode
    }
  });

  /******************************Håndtering af tema (mørk/lys tilstand)******************* */
  /***********Tilføjelse af nye opgaver Step 3********************/
  todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo();
  });

  function addTodo() {
    const todoText = todoInput.value.trim();
    const dueDate = dueDateInput.value;

    if (todoText.length > 0) {
      const todoObject = {
        id: Date.now(),
        text: todoText,
        dueDate: dueDate || "No due date",
        completed: false,
        priority: false,
      };

      allTodos.push(todoObject);
      updateTodoList();
      saveTodos();
      todoInput.value = "";
      dueDateInput.value = "";
    }
  }
  /****************Opdatering af To-do-listen  Step4*/
  function updateTodoList() {
    todoListUl.innerHTML = "";
    completedList.innerHTML = "";

    allTodos.forEach((todo, todoIndex) => {
      const todoItem = createTodoItem(todo, todoIndex);

      if (todo.completed) {
        completedList.append(todoItem);
      } else {
        todoListUl.append(todoItem);
      }
    });
  }
  /**************'HTML elemantar for hver opgaver Step5 */
  function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    todoLI.className = "todo";

    const dueDateDisplay = `${todo.dueDate}`;

    todoLI.innerHTML = `
      <input type="checkbox" id="${todoId}">
      <label class="custom-checkbox" for="${todoId}">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="transparent">
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
      </label>
      <label for="${todoId}" class="todo-text">${todo.text}</label>

      <button class="high-priority">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 24 24"
          fill="${todo.priority ? "var(--accent-color)" : "transparent"}" 
          stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
        </svg>
      </button>

      <span class="due-date">${dueDateDisplay}</span>
      <button class="delete-button">
        <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      </button>
    `;

    // Delete button event
    todoLI.querySelector(".delete-button").addEventListener("click", () => {
      deleteTodoItem(todoIndex);
    });

    // Star button event
    todoLI.querySelector(".high-priority").addEventListener("click", () => {
      togglePriority(todoIndex);
    });

    // Checkbox event
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
      allTodos[todoIndex].completed = checkbox.checked;
      if (checkbox.checked) {
        tickSound.play();
      }
      saveTodos();
      updateTodoList();
    });
    /**Markering som færdig*/
    checkbox.checked = todo.completed;

    return todoLI;
  }
  /**Ændring af prioritet */
  function togglePriority(todoIndex) {
    allTodos[todoIndex].priority = !allTodos[todoIndex].priority;
    saveTodos();
    updateTodoList();
  }
  /**Sletning af opgave */
  function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
  }
  /**gem data i localstorage som json streng */
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(allTodos));
  }
  /**igen konverteres til array via parse gem */
  function getTodos() {
    return JSON.parse(localStorage.getItem("todos") || "[]");
  }
});
