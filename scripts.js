document.addEventListener('DOMContentLoaded', function() {
    let buttons = document.querySelectorAll(".container > div > button");

    // Event listeners for hover and click effects
    buttons.forEach(function(button) {
        if(button.className === "digit") {
            button.addEventListener('mouseover', () => button.classList.add('hover-light'));
            button.addEventListener('mouseout', () => button.classList.remove('hover-light'));
            button.addEventListener('mousedown', () => button.classList.add('click-light'));   
            button.addEventListener('mouseup', () => button.classList.remove('click-light'));
            button.addEventListener('mouseout', () => button.classList.remove('click-light'));

        } else if(button.className === "operator") {
            button.addEventListener('mouseover', () => button.classList.add('hover-dark'));           
            button.addEventListener('mouseout', () => button.classList.remove('hover-dark'));
            button.addEventListener('mousedown', () => button.classList.add('click-light'));  
            button.addEventListener('mouseup', () => button.classList.remove('click-light'));
            button.addEventListener('mouseout', () => button.classList.remove('click-light'));

        } else if(button.className === "equals") {
            button.addEventListener('mouseover', () => button.classList.add('equals-hover'));           
            button.addEventListener('mouseout', () => button.classList.remove('equals-hover'));
            button.addEventListener('mousedown', () => button.classList.add('equals-click'));  
            button.addEventListener('mouseup', () => button.classList.remove('equals-click'));
            button.addEventListener('mouseout', () => button.classList.remove('equals-click'));
        }
    });

    updateDisplay(0); // Set display to default 0
    updateCalcDisplay(''); // Set Calculation Display to blank
    
    // Select the input
    let inputs = document.querySelectorAll('.digit, .operator, .equals');

    // Global Variables
    let currentNumber = "0";
    let calcNumber = '';
    let ans = null;
    let isCalculated = false;
    let specToggle = false;

    // Inputs
    inputs.forEach(function(input) {
        input.addEventListener('click', () => {
         
            // Addition
            if(input.id === "add") {
                return runOperatorCalculation("add");
            }

            // Subtraction 
            if(input.id === "minus") {
                return runOperatorCalculation("minus");
            }

            // multiply
            if(input.id === "multiply") {
                return runOperatorCalculation("multiply");
            }

            // Divide
            if(input.id === "divide") {
                return runOperatorCalculation("divide");
            }

            // Square
            if (input.id === "square") {
                return runSpecialOperatorCalculation("square");
            }

            // Square root
            if (input.id === "square-root") {
                return runSpecialOperatorCalculation("square-root");
            }

            // 1/x (Divide 1 by x)
            if (input.id === "one-divide-x") {
                if (currentNumber === '') return;
                return runSpecialOperatorCalculation("one-divide-x");
            }

            // Negate
            if (input.id === "plus-minus") {
                if (currentNumber === "0") {       
                    return; 
                } else if (currentNumber !== "0" && isCalculated === false) {
                    currentNumber = negate(currentNumber).toString();
                    updateDisplay(currentNumber);
                    return;               
                } else if (currentNumber !== "0" && isCalculated === true) {
                    let fullEquation = (calcNumber + currentNumber) + " = ";
                    ans = calculate(fullEquation);
                    ans = negate(ans);
                    currentNumber = ans;
                    calcNumber = '';
                    updateDisplay(ans);
                    isCalculated = false;
                    return;
                } 
            }

            // Percent
            if (input.id === "percent") {
                if(isCalculated === true) return;
                else if (calcNumber === '') return;
                else {
                    let num = calcNumber.slice(0, -3);
                    let percentage = percent(num, currentNumber);
                    fullEquation = calcNumber + percentage + " = ";
                    ans = roundToTwoDecimals(calculate(fullEquation));
                    currentNumber = ans;
                    calcNumber = '';

                    updateCalcDisplay(fullEquation);
                    updateDisplay(ans);
                }
                return;
            }

            // Period
            if(input.id === "period") {
                if(isCalculated === true && !calcNumber.includes('.')) {
                    if(currentNumber.includes(".")) return;
                    let fullEquation = (calcNumber + currentNumber) + " = ";
                    ans = calculate(fullEquation);
                    calcNumber = ans + '.';
                    updateCalcDisplay(calcNumber);
                    currentNumber = calcNumber; // Reset currentNumber for 2nd variable
                    calcNumber = '';
                    isCalculated = false;
                    return;
                } else if (isCalculated === true && calcNumber.includes('.') && !currentNumber.includes('.')) {
                    currentNumber += ".";
                    updateDisplay(currentNumber);
                    isCalculated = false;
                    return;
                } else if(currentNumber.includes('.') && isCalculated === false) {
                    return;
                } else if(!currentNumber.includes('.')) {
                    currentNumber += ".";
                    updateDisplay(currentNumber);
                    return;
                }
                return;
            }
            
            // Equals
            if (input.id === "equals" && calcNumber === '') { 
                calcNumber = currentNumber + '=';
                updateCalcDisplay(calcNumber);
                calcNumber = '';
                return;
            } else if(input.id === "equals" && currentNumber !== '0') {
                let fullEquation = (calcNumber + currentNumber) + " = ";
                updateCalcDisplay(fullEquation); 
                let ans = calculate(fullEquation)
                updateDisplay(ans); 
                isCalculated = true; 
                return;
            } else if (input.id === "equals" && currentNumber === '0') {
                return;
            } 

            // Backspace
            if(input.id === "backspace") {
                if (isCalculated === true) {
                    calcNumber = "";
                    currentNumber = "0"
                    isCalculated = false;
                } else {
                    currentNumber = currentNumber.slice(0, -1);
                    if (currentNumber === "") {
                        currentNumber = "0";
                    }
                } 
                
                updateDisplay(currentNumber);
                updateCalcDisplay(calcNumber);
                return;
            }

            // Numbers
            if (isCalculated === true && calcNumber !== '' && currentNumber === '') {
                currentNumber = input.id;
                updateDisplay(currentNumber);
                updateCalcDisplay(calcNumber);
                isCalculated = false;
                return;
            } else if (isCalculated === true && currentNumber !== '') {
                calcNumber = '';
                currentNumber = input.id;
                updateCalcDisplay(calcNumber);
                updateDisplay(currentNumber);
                isCalculated = false;
                return;
            } else if (input.id === "0" && currentNumber === "0") {
                // If currentNumber is "0" and the clicked button is also "0", do nothing
                return;
            } else {
                // Otherwise, update currentNumber with the clicked button's ID
                if (currentNumber === "0") {
                    // If currentNumber is "0" and the clicked button is not "0",
                    // update currentNumber directly without concatenation
                    currentNumber = input.id;
                } else {
                    // If currentNumber is not "0", concatenate the clicked button's ID
                    currentNumber += input.id;
                }
            }

            // Main Calculation Functions
            // Operator function (+, -, x, ÷)
            function runOperatorCalculation(name) {
                if (name === "add") symbol = "+";
                else if (name === "minus") symbol = "-";
                else if (name === "multiply") symbol = "x";
                else if (name === "divide") symbol = "÷";

                if(input.id === name && calcNumber.includes(symbol) && !calcNumber.includes('=')) {  
                    fullEquation = calcNumber += roundToTwoDecimals(currentNumber);
                    ans = calculate(fullEquation);
                    updateCalcDisplay(ans + ` ${symbol} `);
                    updateDisplay(ans);
                    calcNumber = (ans + ` ${symbol} `);
                    currentNumber = '';
                    return;
                } else if (input.id === name && calcNumber.includes(symbol) && calcNumber.includes('=')) {
                    calcNumber = ans + symbol;
                    updateCalcDisplay(calcNumber);
                    return;
                } else if (input.id === name && !calcNumber.includes(symbol) && !calcNumber.includes('=')) {
                    if (!calcNumber) {
                        calcNumber = (roundToTwoDecimals(currentNumber) + ` ${symbol} `);
                        updateCalcDisplay(calcNumber);
                        currentNumber = ''; // Reset currentNumber for 2nd variable
                        return;
                    } else{
                        let fullEquation = (calcNumber + currentNumber) + " = ";
                        ans = calculate(fullEquation);
                        calcNumber = (ans + ` ${symbol} `);
                        updateCalcDisplay(calcNumber);
                        currentNumber = ''; // Reset currentNumber for 2nd variable
                        return;
                    }
                } else if (input.id === name && !calcNumber.includes(symbol) && calcNumber.includes('=')) {
                    calcNumber = (currentNumber + ` ${symbol} `);
                    updateCalcDisplay(calcNumber);
                    return;
                }
            }

            // Special operator function (square, root, 1 divide x)
            function runSpecialOperatorCalculation(name) {
                let rootFunction;
                if (name === "square") {
                    rootFunction = square;
                } else if (name === "square-root") {
                    rootFunction = squareRoot;
                } else if (name === "one-divide-x") {
                    rootFunction = oneDivideX;
                }

                if (input.id === name) {
                    if (isCalculated === true) { // Account for equalized numbers
                        let fullEquation = (calcNumber + currentNumber) + " = ";
                        ans = calculate(fullEquation);
                        calcNumber = roundToTwoDecimals(rootFunction(ans));
                        updateCalcDisplay(calcNumber);
                        currentNumber = calcNumber; // Reset currentNumber for 2nd variable
                        calcNumber = '';
                        isCalculated = false;
                    } else if (calcNumber === "") {
                        let ans = roundToTwoDecimals(rootFunction(currentNumber));
                        updateDisplay(ans);
                        currentNumber = "";
                        calcNumber = ans;
                        currentNumber = ans;
                        updateCalcDisplay(calcNumber);
                        calcNumber = "";
                    } else {
                        let ans = roundToTwoDecimals(rootFunction(currentNumber));
                        updateDisplay(ans);
                        currentNumber = "";
                        calcNumber += ans;
                        currentNumber = ans;
                        updateCalcDisplay(calcNumber);
                        currentNumber = "";
                    }
                    specToggle = true;
                    return;
                }
            }

            updateDisplay(currentNumber);
        });
    });

    // Clear
    let clearBtn = document.querySelector('#clear'); 
    clearBtn.addEventListener('click', () => {
    updateDisplay(0);
    updateCalcDisplay('')
    currentNumber = "0";
    calcNumber = '';
    isCalculated = false;
    specToggle = false;
    });

    // Clear Entry
    let clearEntBtn = document.querySelector('#clear-entry');
    clearEntBtn.addEventListener('click', () => {
        updateDisplay(0);
        currentNumber = '0';
        isCalculated = false;

        if (specToggle === true) {
            calcNumber = '';
            updateCalcDisplay(calcNumber);
            specToggle = false;
        }
    });

});

// Functions //

// Update display
function updateDisplay(num) {
    let display = document.querySelector('.display');
    display.innerHTML = num;
}

// Update calculation screen
function updateCalcDisplay(num) {
    let calcDisplay = document.querySelector('.calculation');
    calcDisplay.innerHTML = num.toString();
}

// Clear display
function clear() {
    updateDisplay(0)
    updateCalcDisplay()
}

// Parse and calculate function
function calculate(expression) {
    // Remove '=' and any spaces
    const sanitizedExpression = expression.replace("=", "").trim();

    // Split the expression into parts based on the operator
    const operators = ["+", "-", "x", "÷"];
    let operatorIndex = -1;
    let operator;
    let negativeExpression;

    for (const op of operators) {
        if (sanitizedExpression[0] === "-") { // Account for a negative 1st Variable
            negativeExpression = sanitizedExpression.slice(1);

            operatorIndex = negativeExpression.indexOf(op);

            if (operatorIndex !== -1) {
                operator = op;
                operatorIndex += 1;
                break;
            }
        } else {
            operatorIndex = sanitizedExpression.indexOf(op);
            if (operatorIndex !== -1) {
                operator = op;
                break;
            }
        }
    }

    if (operatorIndex === -1) {
        console.error("Invalid expression:", expression);
        updateDisplay("ERROR");
        return null;
    }

    // Parse the first and second variable
    let firstVariable = sanitizedExpression.slice(0, operatorIndex).trim();
    let secondVariable = sanitizedExpression.slice(operatorIndex + operator.length).trim();

    firstVariable = Number(firstVariable);
    secondVariable = Number(secondVariable);

    if (operator === "+") return roundToTwoDecimals(add(firstVariable, secondVariable));
    else if (operator === "-") return roundToTwoDecimals(minus(firstVariable, secondVariable));
    else if (operator === "x") return roundToTwoDecimals(multiply(firstVariable, secondVariable));
    else if (operator === "÷") return roundToTwoDecimals(divide(firstVariable, secondVariable));
}

// Round off long decimal numbers
function roundToTwoDecimals(num) {
    const roundedNum = Number(num);
    const decimalPlaces = (roundedNum.toString().split('.')[1] || '').length;
  
    if (decimalPlaces > 3) {
      return roundedNum.toFixed(3);
    } else {
      return roundedNum;
    }
}
  
// basic mathematical functions
const add = (x, y) => x + y;

const minus = (x, y) => x - y;

const multiply = (x, y) => x * y;

const divide = (x, y) => x / y;

const square = (x) => x * x;

const squareRoot = (x) => Math.sqrt(x);

const oneDivideX = (x) => 1 / x;

const negate = (x) => x * -1;

const percent = (num, percent) => ((num / 100) * percent);