const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const keypad = document.querySelector(".grid.grid-cols-4");
const expressionDisplay = document.getElementById("expressionDisplay");
const resultDisplay = document.getElementById("resultDisplay");

const calculatorState = {
  leftOperand: null,
  operator: null,
  rightOperand: null,
  currentInput: "0",
  justEvaluated: false,
};

const formatDisplayNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "Error";
  }

  return numeric.toLocaleString(undefined, {
    maximumFractionDigits: 10,
  });
};

const renderCalculator = () => {
  const left = calculatorState.leftOperand;
  const right = calculatorState.rightOperand;
  const op = calculatorState.operator;
  const operatorLabel = op === "-" ? "-" : op;

  if (op) {
    const leftText = formatDisplayNumber(left);
    const rightSource = right !== null ? right : calculatorState.currentInput;
    const rightText = formatDisplayNumber(rightSource);
    expressionDisplay.textContent = `${leftText} ${operatorLabel} ${rightText}`;
  } else {
    expressionDisplay.textContent = formatDisplayNumber(calculatorState.currentInput);
  }

  resultDisplay.textContent = formatDisplayNumber(calculatorState.currentInput);
};

const applyOperation = (left, operator, right) => {
  if (operator === "+") {
    return left + right;
  }

  if (operator === "-") {
    return left - right;
  }

  return right;
};

const clearCalculator = () => {
  calculatorState.leftOperand = null;
  calculatorState.operator = null;
  calculatorState.rightOperand = null;
  calculatorState.currentInput = "0";
  calculatorState.justEvaluated = false;
};

const appendInput = (value) => {
  if (calculatorState.justEvaluated && !calculatorState.operator) {
    clearCalculator();
  }

  if (value === ".") {
    if (calculatorState.currentInput.includes(".")) {
      return;
    }

    calculatorState.currentInput += ".";
    return;
  }

  if (calculatorState.currentInput === "0") {
    calculatorState.currentInput = value;
    return;
  }

  calculatorState.currentInput += value;
};

const applyOperator = (nextOperator) => {
  const currentValue = Number(calculatorState.currentInput);

  if (calculatorState.leftOperand === null) {
    calculatorState.leftOperand = currentValue;
  } else if (calculatorState.operator && !calculatorState.justEvaluated) {
    const computed = applyOperation(calculatorState.leftOperand, calculatorState.operator, currentValue);
    calculatorState.leftOperand = computed;
    calculatorState.currentInput = String(computed);
  }

  calculatorState.operator = nextOperator;
  calculatorState.rightOperand = null;
  calculatorState.currentInput = "0";
  calculatorState.justEvaluated = false;
};

const evaluate = () => {
  if (!calculatorState.operator || calculatorState.leftOperand === null) {
    return;
  }

  const right = Number(calculatorState.currentInput);
  const computed = applyOperation(calculatorState.leftOperand, calculatorState.operator, right);

  calculatorState.rightOperand = right;
  calculatorState.leftOperand = computed;
  calculatorState.currentInput = String(computed);
  calculatorState.operator = null;
  calculatorState.justEvaluated = true;
};

const applyTheme = (isDark) => {
  root.classList.toggle("dark", isDark);
  themeIcon.textContent = isDark ? "moon" : "sun";
};

const storedTheme = localStorage.getItem("calculator-theme");
if (storedTheme) {
  applyTheme(storedTheme === "dark");
}

toggle.addEventListener("click", () => {
  const isDark = !root.classList.contains("dark");
  applyTheme(isDark);
  localStorage.setItem("calculator-theme", isDark ? "dark" : "light");
});

keypad.addEventListener("click", (event) => {
  const button = event.target.closest(".calc-key");
  if (!button) {
    return;
  }

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value) {
    appendInput(value);
    renderCalculator();
    return;
  }

  if (action === "clear") {
    clearCalculator();
    renderCalculator();
    return;
  }

  if (action === "operator") {
    applyOperator(button.dataset.operator);
    renderCalculator();
    return;
  }

  if (action === "equals") {
    evaluate();
    renderCalculator();
  }
});

renderCalculator();
