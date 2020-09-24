let previous = document.getElementsByClassName("display__prev")[0];
let current = document.getElementsByClassName("display__cur")[0];
let num_btns = [];
let previous_str = "";
let current_str = "";

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
    current.innerText = current_str;
  });
}

document.getElementsByClassName("numpad__btn--del")[0].addEventListener("click", function() {
  current_str = "";
  previous_str = "";
  current.style.fontSize = "1em";
  current.textContent = "";
  previous.textContent = "";
})