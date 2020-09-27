let previous = document.getElementsByClassName("display__prev")[0]; // Previous (upper) subdisplay element
let current = document.getElementsByClassName("display__cur")[0]; // Current (lower) subdisplay element
let previous_str = ""; // String for previous subdislay
let current_str = "0"; // String for current subdisplay
current.textContent = "0"; // Current display is initialized w/ 0

// Operations object. Used to iterate all the operations. Minus has its own logic due to negative numbers.
const operations = {
  plus: "+",
  mult: "*",
  frac: "÷",
  pow: "^"
};

// Outputs string to the current display
function outputToCurrentDisplay(str) {
  if (str != "") {
    // Case for changing number's sign to zero
    if (str.length === 1 && str[0] === "-") {
      current.textContent = str;
    } else {
      // toLocaleString is very useful _formatting_ function, refer to docs
      current.textContent = Number(str).toLocaleString(undefined, {maximumFractionDigits: 8});
      // If there is a separator in the str argument
      if (str.indexOf(".") !== -1) {
        // If it's the last element of string
        if (str[str.length - 1] === ".") {
          // Then add separator to the end of the displayed number
          current.textContent += "."
        } else if ([...str.split(".")[1]].every(ch => ch === "0")) // Check whether all the chars after separator are zeroes
        {
          // Add those zeroes to the displayed number (toLocaleString cuts them, so we need to add them explicitly)
          current.textContent += "." + str.split(".")[1];
        }
      }
    }
  }
}

// Outputs to the previous (upper display)
function outputToPreviousDisplay(str) {
  if (str !== "") {
    previous.textContent = ""; // Erase previous data
    let tokens = str.split(" ");
    for (let token of tokens) {
      // token can be a number or an operation
      let number = Number(token); // turns NaN if operation
      if (number) {
        previous.textContent += number.toLocaleString(undefined, {maximumFractionDigits: 8});
      } else {
        previous.textContent += " " + token + " ";
      }
    }
  }
}

// Parses the string argument and does the thing
function calculate(str) {
  let ret = "";
  let [first, op, second] = str.split(" ");
  switch (op) {
    case "+":
    ret += parseFloat(first) + parseFloat(second);
    break;
    case "-":
    ret += parseFloat(first) - parseFloat(second);
    break;
    case "*":
    ret += parseFloat(first) * parseFloat(second);
    break;
    case "÷":
    ret += parseFloat(first) / parseFloat(second);
    break;
    case "^":
    ret += Math.pow(parseFloat(first), parseFloat(second));
    break;
    default:
    break;
  }
  
  if (ret.length > 9) ret = ret.slice(0, 8);
  while (ret[ret.length - 1] === "0" && ret.length > 1) ret = ret.slice(0, ret.length - 1);
  return ret;
}

function clearPrevious() {
  previous_str = "";
  previous.textContent = "";
}

function clearCurrent() {
  current_str = "0";
  current.textContent = "0";
}

function clearDisplay() {
  clearPrevious();
  clearCurrent();
}

// Set number buttons events
for (let i = 0; i < 10; ++i)
{
  document.getElementsByClassName("numpad__btn--" + i)[0].addEventListener('click', function() {
    // Clears display after input after evaluation (пункт 4 Базовой функциональности))
    if (previous_str[previous_str.length - 1] === "=") {
      clearDisplay();
      current_str = "0";
    }
    if (/^0$/.test(current_str)) // If there are only zero on the display, replace it
    {
      current_str = String(i);
    }
    else if (current_str.length < 9) // Else add to the display
    {
      current_str += i;
    }
    
    outputToCurrentDisplay(current_str);
  });
}

// Set AC button
document.getElementsByClassName("numpad__btn--ac")[0].addEventListener("click", function() {
  clearDisplay();
  current.style.fontSize = "1.1em";
});

// Set DEL button
document.getElementsByClassName("numpad__btn--del")[0].addEventListener("click", function () {
  // Clears display after input after evaluation (пункт 4 Базовой функциональности))
  if (previous_str[previous_str.length-1] === "=")
  {
    clearPrevious();
  }
  if (current_str !== "0") // Works only when the displayed number is not zero
  {
    if (current_str.length > 1)
    {
      // Reassigns displayed string to the same string w/o the last element
      current_str = current_str.slice(0, current_str.length-1);
    }
    else
    {
      current_str = "0";
    }
    outputToCurrentDisplay(current_str);
  }
});

// Set DOT button
document.getElementsByClassName("numpad__btn--dot")[0].addEventListener('click', function () {
  // Only if there is no dots in the displayed number
  if (current_str.indexOf(".") === -1)
  {
    if (current_str === "-") current_str += "0";
    current_str += ".";
    outputToCurrentDisplay(current_str);
  }
})

// Set operation buttons events
for (let op in operations)
{
  document.getElementsByClassName(`numpad__btn--${op}`)[0].addEventListener('click', function()
  {
    // If the last element in the previous displayed string is an operation
    if (Object.values(operations).includes(previous_str[previous_str.length - 1]) || previous_str[previous_str.length - 1] === "-")
    {
      previous_str = calculate(previous_str + " " + current_str) + " " + operations[op];
    }
    else
    {
      // Checks whether there are only "-" sign in the current displayed string and adds zero if so
      if (current_str === "-") {
        previous_str = current_str + "0 " + operations[op];
      } else {
        previous_str = current_str + " " + operations[op];
      }
    }
    
    current_str = "0";
    outputToPreviousDisplay(previous_str);
    outputToCurrentDisplay(current_str);
  });
}

// Set MINUS operation (have to set explicitly in order to support negative numbers)
document.getElementsByClassName("numpad__btn--minus")[0].addEventListener('click', function ()
{
  if (current_str === "0")
  {
    current_str = "-";
  }
  else
  {
    if (Object.values(operations).includes(previous_str[previous_str.length - 1]) || previous_str[previous_str.length - 1] === "-")
    {
      previous_str = calculate(previous_str + " " + current_str) + " -";
    }
    else
    {
      previous_str = current_str + " -";
    }
    current_str = "0";
  }
  outputToPreviousDisplay(previous_str);
  outputToCurrentDisplay(current_str);
});

document.getElementsByClassName("numpad__btn--sqrt")[0].addEventListener('click', function ()
{
  // If the current string is not empty and if current displayed number is not negative
  if (parseFloat(current_str) < 0)
  {
    alert('Cannot take square root of negative number!');
  }
  else if (current_str !== "")
  {
    previous_str = "√" + current_str + " =";
    current_str = String(Math.sqrt(parseFloat(current_str)));
    outputToCurrentDisplay(current_str);
    // It's too late to make proper adjustments in outputToPreviousDisplay, I wanna sleep:D
    previous.textContent = previous_str;
  }
});

document.getElementsByClassName("numpad__btn--eq")[0].addEventListener('click', function() {
  if (previous_str) // If there is a previous stuff we can evaluate for
  {
    if (previous_str[previous_str.length-1] !== "=")
    {
      // [a, b] = [b, a] swaps a and b
      [previous_str, current_str] = [previous_str + " " + current_str + " =", calculate(previous_str + " " + current_str)];
    }
    else // Case for reevaluation of an expression (1+1=>2=>3=>4...)
    {
      let [_, op, second] = previous_str.split(" ");
      previous_str = [current_str, op, second, "="].join(" ");
      current_str = calculate(previous_str);
    }
    outputToPreviousDisplay(previous_str);
    outputToCurrentDisplay(current_str);
  }
});

alert("The calculator works with numbers < 10^10");