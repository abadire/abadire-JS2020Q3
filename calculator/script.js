let previous = document.getElementsByClassName("display__prev")[0];
let current = document.getElementsByClassName("display__cur")[0];
let previous_str = "";
let current_str = "0";
current.textContent = "0";

const operations = {
  plus: "+",
  minus: "-",
  mult: "*",
  frac: "÷",
  pow: "^"
};

function outputToCurrentDisplay(str, postfix=null, prefix=null) {
  if (str != "") {
    if (str.length === 1 && str[0] === "-") {
      current.textContent = str;
    } else {
      current.textContent = Number(str).toLocaleString(undefined, {maximumFractionDigits: 8});
      if (str.indexOf(".") !== -1) {
        if (str[str.length - 1] === ".") {
          current.textContent += "."
        } else if ([...str.split(".")[1]].every(ch => ch === "0")) {
          current.textContent += "." + str.split(".")[1];
        }
      }
    }
  }
}

function outputToPreviousDisplay(str) {
  if (str !== "") {
    previous.textContent = "";
    let tokens = str.split(" ");
    for (let token of tokens) {
      let number = Number(token);
      if (number) {
        previous.textContent += number.toLocaleString(undefined, {maximumFractionDigits: 8});
      } else {
        previous.textContent += " " + token + " ";
      }
    }
  }
}

function calculate(str) {
  let ret = "";
  let [first, op, second] = str.split(" ");
  switch (op) {
    case "+":
    ret = parseFloat(first) + parseFloat(second);
    break;
    case "-":
    ret = parseFloat(first) - parseFloat(second);
    break;
    case "*":
    ret = parseFloat(first) * parseFloat(second);
    break;
    case "÷":
    ret = parseFloat(first) / parseFloat(second);
    break;
    case "^":
    ret = Math.pow(parseFloat(first), parseFloat(second));
    break;
    default:
    break;
  }
  
  return String(ret);
}

function clearPrevious() {
  previous_str = "";
  previous.textContent = "";
}

function clearCurrent() {
  current_str = "";
  current.textContent = "";
}

function clearDisplay() {
  clearPrevious();
  clearCurrent();
}

// Set number buttons events
for (let i = 0; i < 10; ++i)
{
  document.getElementsByClassName("numpad__btn--" + i)[0].addEventListener('click', function() {
    if (/^0$/.test(current_str)) {
      if (i !== 0) {
        current_str = String(i);
      }
    } else if (previous_str[previous_str.length - 1] === "=") {
      clearPrevious();
      current_str = String(i);
    } else if (current_str.length < 9) {
      current_str += i;
    }
    
    outputToCurrentDisplay(current_str);
  });
}

document.getElementsByClassName("numpad__btn--ac")[0].addEventListener("click", function() {
  clearDisplay();
  current.style.fontSize = "1.1em";
});

// Set DEL button
document.getElementsByClassName("numpad__btn--del")[0].addEventListener("click", function () {
  if (current_str !== "0") {
    if (current_str.length > 1) {
      current_str = current_str.slice(0, current_str.length-1);
    } else  {
      current_str = "0";
    }
    outputToCurrentDisplay(current_str);
    
    if (previous_str[previous_str.length-1] === "=") {
      clearPrevious();
    }
  }
});

// Set DOT button
document.getElementsByClassName("numpad__btn--dot")[0].addEventListener('click', function () {
  if (current_str.indexOf(".") === -1) {
    current_str += ".";
    outputToCurrentDisplay(current_str);
  }
})

// Set operation buttons events
for (let op in operations) {
  document.getElementsByClassName(`numpad__btn--${op}`)[0].addEventListener('click', function() {
    if (Object.values(operations).includes(previous_str[previous_str.length - 1])) {
      previous_str = calculate(previous_str + " " + current_str) + " " + operations[op];
    } else if (op === "minus" && !previous_str && current_str === "0"){
      current_str = "-";
    } else {
      previous_str = current_str + " " + operations[op];
    }

    if (current_str !== "-") {
      current_str = "0";
      outputToPreviousDisplay(previous_str);
    }
    outputToCurrentDisplay(current_str);
  });
}

document.getElementsByClassName("numpad__btn--eq")[0].addEventListener('click', function() {
  if (previous_str)
  {
    if (previous_str[previous_str.length-1] !== "=") {
      [previous_str, current_str] = [previous_str + " " + current_str + " =", calculate(previous_str + " " + current_str)];
    } else {
      let [_, op, second] = previous_str.split(" ");
      previous_str = [current_str, op, second, "="].join(" ");
      current_str = calculate(current_str, op, second);
    }
    outputToPreviousDisplay(previous_str);
    outputToCurrentDisplay(current_str);
  }
});