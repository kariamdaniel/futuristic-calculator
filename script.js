// script.js
const display = document.getElementById("display");
let currentInput = ""; // Stores what the user types

// Function to handle button presses
function handleInput(value) {
  if (value === "C") {
    currentInput = ""; // Clear input
    display.value = "";
  } else if (value === "=") {
    try {
      const result = calculate(currentInput); // Do the math
      display.value = result;
      currentInput = result; // Save result for next operation
    } catch (error) {
      display.value = "Error";
    }
  } else {
    currentInput += value; // Add pressed button to input
    display.value = currentInput;
  }
}

// Function to do the actual math (fast and safe!)
function calculate(input) {
  // Convert input into numbers and operators
  const tokens = input.match(/(\d+(\.\d+)?|[\+\-\*\/])/g);
  if (!tokens) return "0";

  let total = 0;
  let currentNumber = "";
  let operator = "+";

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!isNaN(token) || token === ".") {
      currentNumber += token; // Build the number
    } else {
      // Apply the previous operator
      if (currentNumber !== "") {
        const num = parseFloat(currentNumber);
        if (operator === "+") total += num;
        if (operator === "-") total -= num;
        if (operator === "*") total *= num;
        if (operator === "/") total /= num;
      }
      operator = token; // Save the next operator
      currentNumber = ""; // Reset number
    }
  }

  // Apply the last number
  if (currentNumber !== "") {
    const num = parseFloat(currentNumber);
    if (operator === "+") total += num;
    if (operator === "-") total -= num;
    if (operator === "*") total *= num;
    if (operator === "/") total /= num;
  }

  return total;
}

// Generate buttons dynamically
const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "C", "=",
  "+"
];

const buttonsContainer = document.querySelector(".buttons");

buttons.forEach((btn) => {
  const button = document.createElement("button");
  button.textContent = btn;
  button.addEventListener("click", () => handleInput(btn));
  buttonsContainer.appendChild(button);
});