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

    // Have the buttons display correctly
    let currentNumber = "0";
    let calcNumber = '';
    let ans = null;
    let isCalculated = false;

    inputs.forEach(function(input) {
        input.addEventListener('click', () => {
            // Negate
            if (input.id === "plus-minus" && currentNumber === "0") {       
                return; 
            } else if (input.id === "plus-minus" && currentNumber !== "0") {
                console.log("2")
                currentNumber = negate(currentNumber).toString();
                updateDisplay(currentNumber);
                return;               
            } 

            // Period
            if(input.id === "period" && currentNumber.includes('.')) {
                return;
            } else if(input.id === "period" && !currentNumber.includes('.')) {
                currentNumber += ".";
                updateDisplay(currentNumber);
                return;
            }
            
            // Addition
            if(input.id === "add") {
                return runOperatorCalculation("add", "+");
            }

            // Subtraction 
            if(input.id === "minus") {
                return runOperatorCalculation("minus", "-");
            }

            // multiply
            if(input.id === "multiply") {
                return runOperatorCalculation("multiply", "x");
            }

            // Divide
            if(input.id === "divide") {
                return runOperatorCalculation("divide", "÷");
            }

            // Square
            if (input.id === "square") {
                return runRootCalculation("square");
            }

            // Square root
            if (input.id === "square-root") {
                return runRootCalculation("square-root");
            }


            // Equals
            if (input.id === "equals" && calcNumber === '') { 
                calcNumber = currentNumber + '=';
                updateCalcDisplay(calcNumber)
                calcNumber = ''
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
            if (input.id === "0" && currentNumber === "0") {
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

            // Main operator function (+, -, x, ÷)
            function runOperatorCalculation(name, symbol) {
                if(input.id === name && calcNumber.includes(symbol) && !calcNumber.includes('=')) {  
                    fullEquation = calcNumber += currentNumber;
                    ans = calculate(fullEquation);
                    updateCalcDisplay(ans + ` ${symbol} `);
                    updateDisplay(ans);
                    calcNumber = (ans + ` ${symbol} `);
                    currentNumber = '';
                    console.log("1");
                    return;
                } else if (input.id === name && calcNumber.includes(symbol) && calcNumber.includes('=')) {
                    calcNumber = ans + symbol;
                    updateCalcDisplay(calcNumber);
                    console.log("2");
                    return;
                } else if (input.id === name && !calcNumber.includes(symbol) && !calcNumber.includes('=')) {
                    if (!calcNumber) {
                        calcNumber = (currentNumber + ` ${symbol} `);
                        updateCalcDisplay(calcNumber);
                        currentNumber = ''; // Reset currentNumber for 2nd variable
                        return;
                    } else{
                        let fullEquation = (calcNumber + currentNumber) + " = ";
                        ans = calculate(fullEquation);
                        calcNumber = (ans + ` ${symbol} `);
                        updateCalcDisplay(calcNumber);
                        currentNumber = ''; // Reset currentNumber for 2nd variable
                        console.log("4");
                        return;
                    }
                } else if (input.id === name && !calcNumber.includes(symbol) && calcNumber.includes('=')) {
                    calcNumber = (currentNumber + ` ${symbol} `);
                    updateCalcDisplay(calcNumber);
                    return;
                }
            }

            // Root functionality
            function runRootCalculation(name) {
                let rootFunction;
                if (name === "square") {
                    rootFunction = square;
                } else if (name === "square-root") {
                    rootFunction = squareRoot;
                }

                if (input.id === name) {
                    if (calcNumber === "") {
                        let ans = rootFunction(currentNumber);
                        updateDisplay(ans);
                        currentNumber = "";
                        calcNumber = ans;
                        currentNumber = ans;
                        updateCalcDisplay(calcNumber);
                        calcNumber = "";
                    } else {
                        let ans = rootFunction(currentNumber);
                        updateDisplay(ans);
                        currentNumber = "";
                        calcNumber += ans;
                        currentNumber = ans;
                        updateCalcDisplay(calcNumber);
                        currentNumber = "";
                    }
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
    });
});

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

    if (operator === "+") return add(firstVariable, secondVariable);
    else if (operator === "-") return minus(firstVariable, secondVariable);
    else if (operator === "x") return multiply(firstVariable, secondVariable);
    else if (operator === "÷") return divide(firstVariable, secondVariable);
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

const percent = (x) => x / 100;