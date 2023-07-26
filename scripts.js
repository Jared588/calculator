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
});

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
