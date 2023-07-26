document.addEventListener('DOMContentLoaded', function() {
    let buttons = document.querySelectorAll(".container > div > button");

    // event listeners for hover and click effects
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

    updateDisplay(0) // Set display to default 0
    
    // Select the input
    let inputs = document.querySelectorAll('.digit, .operator');

    // Have the buttons display correctly
    let currentNumber = "0";

    inputs.forEach(function(input) {
        input.addEventListener('click', () => {
            // Account for negate
            if (input.id === "plus-minus" && currentNumber === "0") {         
                return; 
            } else if (input.id === "plus-minus" && currentNumber !== "0") {
                currentNumber = negate(currentNumber).toString();
                updateDisplay(currentNumber);
                return;
            }

            // Account for periods
            if(input.id === "period" && currentNumber.includes('.')) {
                return;
            } else if(input.id === "period" && !currentNumber.includes('.')) {
                currentNumber += ".";
                updateDisplay(currentNumber);
                return;
            }

            // Account for numbers
            if (currentNumber === "0" && input.id === "0") {
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

            updateDisplay(currentNumber);
        });
    });

    // clear
    let clearBtn = document.querySelector('#clear'); 
    clearBtn.addEventListener('click', () => {
    updateDisplay(0);
    currentNumber = "0";
    });
});

// update function
function updateDisplay(num) {
    let display = document.querySelector('.display');
    display.innerHTML = num;
}

// clear function
function clear() {
    updateDisplay(0)
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