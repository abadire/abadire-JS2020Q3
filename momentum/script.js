// DOM Elements
const main = document.getElementsByClassName('main')[0],
greet = document.getElementsByClassName('main__greeting')[0],
name = document.getElementsByClassName('main__name')[0],
focus = document.getElementsByClassName('focus__editable')[0],
time = document.getElementsByClassName('main__time')[0],
date = document.getElementsByClassName('main__date')[0],
quote = document.getElementsByClassName('main__quote')[0],
author = document.getElementsByClassName('main__author')[0],
requoter = document.getElementsByClassName('main__requote')[0];

// Map objects
const digitToWeekDay = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};

const digitToMonth = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

// Global variables
let hour = (new Date()).getHours();
let imageIndex = hour;
let imageIndices = [];
for (let i = 0; i < 6; ++i)
{
  imageIndices.push((Math.floor(Math.random() * 20) + 1).toString().padStart(2, '0'));
}
let currentPeriod = getPeriod(hour);

// Helper functions
function getPeriod(hour) {
  if (+hour < 6) return 'night';
  else if (+hour < 12) return 'morning';
  else if (+hour < 18) return 'afternoon';
  else return 'evening';
}

function preloadImage(src) {
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => main.style.backgroundImage = `url(${src})`;
}

// Refresh function
function checkTime() {
  let today = new Date();
  let h = today.getHours().toString().padStart(2, '0');
  let m = today.getMinutes().toString().padStart(2, '0');
  let day = today.getDate();
  let month = digitToMonth[today.getMonth()];
  let weekDay = digitToWeekDay[today.getDay()];
  
  time.textContent = h + ':' + m;
  date.textContent = `${weekDay}, ${day} ${month}`;

  if (currentPeriod !== getPeriod(h))
  {
    currentPeriod = getPeriod(h);
    greet.textContent = `Good ${currentPeriod},`;
  }

  if (hour !== h)
  {
    if (hour !== NaN) imageIndex = (imageIndex + 1) % 24;
    hour = h;
    const src = `assets/images/${currentPeriod}/${imageIndices[imageIndex % 6]}.jpg`;
    preloadImage(src);
  }
  
  if (main.style.opacity === '')
  {
    main.style.opacity = '1';
  }
}

// Event functions
function setKey(key, event) {
  if (event.keyCode === 13 || event.type === 'blur')
  {
    event.preventDefault();
    if (this.textContent !== '')
    {
      localStorage.setItem(key, this.textContent);
    }
    else
    {
      this.textContent = localStorage.getItem(key);
    }
    this.blur();
    window.getSelection().removeAllRanges();
  }
}

function reloadQuote() {
  fetch("https://type.fit/api/quotes")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    let quoteData = data[Math.floor(Math.random() * data.length)];
    quote.textContent = '“' + quoteData.text + '”';
    author.textContent = '- ' + (quoteData.author || 'Anonymous');
    document.getElementsByClassName('main__bottom')[0].style.opacity = '1';
  });
  requoter.disabled = true;
  setTimeout(() => requoter.disabled = false, 1000);
}

// Event listeners
document.getElementsByClassName('focus__input--loader')[0].addEventListener('keypress', function(event) {
  if (event.keyCode === 13)
  {
    event.preventDefault();
    if (!event.target.value) return;
    localStorage.setItem('name', event.target.value);
    document.getElementsByClassName('loader')[0].style.display = 'none';
    setInterval(checkTime, 500);
  }
});

document.getElementsByClassName('main__next')[0].addEventListener('click', function() {
  imageIndex = (imageIndex + 1) % 24;
  const src = `assets/images/${getPeriod(imageIndex)}/${imageIndices[imageIndex % 6]}.jpg`;
  preloadImage(src);
  this.disabled = true;
  setTimeout(() => this.disabled = false, 1000);
});

name.addEventListener('keypress', setKey.bind(name, 'name'));
name.addEventListener('blur', setKey.bind(name, 'name'));

focus.addEventListener('keypress', setKey.bind(focus, 'focus'));
focus.addEventListener('blur', setKey.bind(focus, 'focus'));

requoter.addEventListener('click', reloadQuote);

if (localStorage.getItem('focus'))
{
  focus.textContent = localStorage.getItem('focus');
}

if (localStorage.getItem('name'))
{
  document.getElementsByClassName('loader')[0].style.display = 'none';
  setInterval(checkTime, 500);
}

greet.textContent = `Good ${currentPeriod},`;
name.textContent = localStorage.getItem('name');

reloadQuote();