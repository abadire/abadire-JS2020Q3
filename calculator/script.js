let previous = document.getElementsByClassName("display__prev")[0];
let current = document.getElementsByClassName("display__cur")[0];
let num_btns = [];
let previous_str = "";
let current_str = "0";
current.textContent = "0";

function outputToCurrentDisplay(str, postfix=null, prefix=null) {
  if (str != "") {
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

function calculate(first, op, second) {
  let ret = "";
  switch (op) {
    case "+":
      ret = parseFloat(first) + parseFloat(second);
      break;
    case "-":
      ret = parseFloat(first) - parseFloat(second);
      break;
    default:
    break;
  }

  return String(ret);
}

for (let i = 0; i < 10; ++i)
{
  num_btns.push(document.getElementsByClassName("numpad__btn--" + i)[0]);
  num_btns[i].addEventListener('click', function() {
    if (/^0$/.test(current_str)) {
      if (i !== 0) {
        current_str = String(i);
      }
    }
    else if (current_str.length < 9) {
      current_str += i;
    }
    
    outputToCurrentDisplay(current_str);
  });
}

document.getElementsByClassName("numpad__btn--ac")[0].addEventListener("click", function() {
  current_str = "0";
  previous_str = "";
  current.style.fontSize = "1.1em";
  current.textContent = "0";
  previous.textContent = "";
});

document.getElementsByClassName("numpad__btn--del")[0].addEventListener("click", function () {
  if (current_str !== "0") {
    if (current_str.length > 1) {
      current_str = current_str.slice(0, current_str.length-1);
    } else  {
      current_str = "0";
    }
    outputToCurrentDisplay(current_str);
  }
});

document.getElementsByClassName("numpad__btn--dot")[0].addEventListener('click', function () {
  if (current_str.indexOf(".") === -1) {
    current_str += ".";
    outputToCurrentDisplay(current_str);
  }
})

document.getElementsByClassName("numpad__btn--plus")[0].addEventListener('click', function() {
  previous_str = current_str + " +";
  current_str = "0";
  outputToPreviousDisplay(previous_str);
  outputToCurrentDisplay(current_str);
});

document.getElementsByClassName("numpad__btn--minus")[0].addEventListener('click', function() {
  previous_str = current_str + " -";
  current_str = "0";
  outputToPreviousDisplay(previous_str);
  outputToCurrentDisplay(current_str);
});

document.getElementsByClassName("numpad__btn--eq")[0].addEventListener('click', function() {
  if (previous_str)
  {
    if (previous_str[previous_str.length-1] !== "=") {
      let [first, op] = previous.textContent.split(" ");
      previous_str += " " + current_str + " =";
      current_str = calculate(first, op, current_str);
    } else {
      let [_, op, second] = previous_str.split(" ");
      previous_str = [current_str, op, second, "="].join(" ");
      current_str = calculate(current_str, op, second);
    }
    outputToPreviousDisplay(previous_str);
    outputToCurrentDisplay(current_str);
  }
});