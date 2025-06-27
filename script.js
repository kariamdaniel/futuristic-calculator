// Get DOM elements
const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const themeToggle = document.getElementById("themeToggle");

let currentInput = "";
let lastResult = null;

// Function to handle button presses
function handleInput(value) {
  if (value === "C") {
    currentInput = "";
    display.value = "";
    return;
  } else if (value === "←") {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
  } else if (value === "=") {
    try {
      const result = calculate(currentInput);
      updateHistoryDisplay(currentInput, result);
      currentInput = result.toString();
      display.value = result;
      lastResult = result;
    } catch (e) {
      display.value = "Error";
      currentInput = "";
    }
  } else {
    // Continue calculation from last result
    if (lastResult !== null && /[+\-*/]/.test(value)) {
      currentInput = lastResult + value;
      lastResult = null;
    } else {
      currentInput += value;
    }
    display.value = currentInput;
  }

  highlightButton(value);
}

// Calculate function
function calculate(input) {
  const tokens = input.match(/(\d+(\.\d+)?|[\+\-\*\/])/g);
  if (!tokens) return "0";

  let total = 0;
  let currentNumber = "";
  let operator = "+";

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!isNaN(token) || token === ".") {
      currentNumber += token;
    } else {
      if (currentNumber !== "") {
        const num = parseFloat(currentNumber);
        if (operator === "+") total += num;
        if (operator === "-") total -= num;
        if (operator === "*") total *= num;
        if (operator === "/") total /= num;
      }
      operator = token;
      currentNumber = "";
    }
  }

  if (currentNumber !== "") {
    const num = parseFloat(currentNumber);
    if (operator === "+") total += num;
    if (operator === "-") total -= num;
    if (operator === "*") total *= num;
    if (operator === "/") total /= num;
  }

  return total;
}

// Update history display with smooth animation
function updateHistoryDisplay(expression, result) {
  // Force reflow to restart animation
  historyDisplay.classList.remove("animate");
  void historyDisplay.offsetWidth; // Trigger reflow
  
  // Update content
  historyDisplay.textContent = `${expression} = ${result}`;
  
  // Trigger animation
  requestAnimationFrame(() => {
    historyDisplay.classList.add("animate");
  });
}

// Generate buttons dynamically
const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "C", "=",
  "+", "←"
];

const buttonsContainer = document.querySelector(".buttons");

buttons.forEach((btn) => {
  const button = document.createElement("button");
  button.textContent = btn;
  button.addEventListener("click", () => handleInput(btn));
  buttonsContainer.appendChild(button);
});

// Keyboard input handler
window.addEventListener("keydown", (e) => {
  const key = e.key;

  const validKeys = {
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
    "=": "=",
    "Enter": "=",
    "Escape": "C",
    "c": "C",
    "C": "C",
    "Backspace": "←"
  };

  if (key === "Backspace") {
    e.preventDefault();
    handleInput("←");
    return;
  }

  if (/[\d\.]/.test(key)) {
    handleInput(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleInput(key);
  } else if (key === "Enter" || key === "=") {
    handleInput("=");
  } else if (key === "Escape" || key === "c" || key === "C") {
    handleInput("C");
  } else {
    return;
  }

  const targetButtonText = validKeys[key] || key;
  highlightButton(targetButtonText);
});

// Highlight matching button briefly
function highlightButton(key) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn) => {
    if (btn.textContent === key) {
      btn.classList.add("glow");
      setTimeout(() => btn.classList.remove("glow"), 300);
    }
  });
}

// Theme toggle
const htmlElement = document.documentElement;

// Set default theme
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'dark');
}

// Apply saved theme
htmlElement.setAttribute('data-theme', localStorage.getItem('theme'));

// Theme toggle button icon
function updateThemeIcon() {
  themeToggle.textContent = htmlElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
}

updateThemeIcon();

// Toggle theme function
themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
});