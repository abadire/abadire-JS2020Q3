let previous = document.getElementsByClassName("display__prev")[0];
let current = document.getElementsByClassName("display__cur")[0];
let num_btns = [];
let previous_str = "";
let current_str = "0";
current.textContent = "0";

function setSeparators(str) {
  let arr = [];
  for (let i = 0; i + 3 < str.length; i += 3) {
    arr.unshift(str.slice(str.length - i - 4, str.length - i - 1));
  }
  return arr.join();
}

for (let i = 0; i < 10; ++i)
{
  num_btns.push(document.getElementsByClassName("numpad__btn--" + i)[0]);
  num_btns[i].addEventListener('click', function() {
    if (/^0$/.test(current_str)) {
      if (i != 0) {
        current_str = String(i);
      }
    }
    else if (current_str.length < 9) {
      current_str += i;
    }
    current.innerText = Number(current_str).toLocaleString();
  });
}

document.getElementsByClassName("numpad__btn--ac")[0].addEventListener("click", function() {
  current_str = "0";
  previous_str = "";
  current.style.fontSize = "1.1em";
  current.textContent = "0";
  previous.textContent = "";
})

document.getElementsByClassName("numpad__btn--del")[0].addEventListener("click", function () {
  if (current_str != "0") {
    if (current_str.length > 1)
      current_str = current_str.slice(0, current_str.length-1);
    else current_str = "0"; 
    current.textContent = Number(current_str).toLocaleString();
  }
})