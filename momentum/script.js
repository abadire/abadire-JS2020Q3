const main = document.getElementsByClassName('main')[0];
const greet = document.getElementsByClassName('main__greeting')[0];
const time = document.getElementsByClassName('main__time')[0];
const date = document.getElementsByClassName('main__date')[0];
const quote = document.getElementsByClassName('main__quote')[0];
const author = document.getElementsByClassName('main__author')[0];

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

function checkTime() {
  let today = new Date();
  let h = today.getHours().toString().padStart(2, '0');
  let m = today.getMinutes().toString().padStart(2, '0');
  let day = today.getDate();
  let month = digitToMonth[today.getMonth()];
  let weekDay = digitToWeekDay[today.getDay()];
  
  time.textContent = h + ':' + m;
  date.textContent = `${weekDay}, ${day} ${month}`;
  
  let currentPeriod = '';
  if (+h < 6) currentPeriod = 'night';
  else if (+h < 12) currentPeriod = 'morning';
  else if (+h < 18) currentPeriod = 'afternoon';
  else currentPeriod = 'evening';
  
  if (!localStorage.getItem('currentPeriod')
  || localStorage.getItem('currentPeriod') !== currentPeriod)
  {
    localStorage.setItem('currentPeriod', currentPeriod);
    
    let imageNumber = Math.floor(Math.random() * 20 + 1).toString().padStart(2, '0');
    localStorage.setItem('backgroundImage', imageNumber);
  }
  
  if (!/\S/.test(greet.firstChild.nodeValue))
  {
    greet.firstChild.nodeValue += `Good ${currentPeriod}`;
    if (localStorage.getItem('name'))
    {
      greet.firstChild.nodeValue += ', ' + localStorage.getItem('name');
    }
    greet.firstChild.nodeValue += '.\n';

    main.style.backgroundImage = `url("assets/images/${localStorage.getItem('currentPeriod')}/${localStorage.getItem('backgroundImage')}.jpg")`
  }
  
  if (quote.textContent === '')
  {
    if (!localStorage.getItem('quoteText') || +localStorage.getItem('day') !== day)
    {
      fetch("https://type.fit/api/quotes")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        let quoteData = data[Math.floor(Math.random() * data.length)];
        localStorage.setItem('quoteText', quoteData.text);
        localStorage.setItem('quoteAuthor', quoteData.author);
      });
      localStorage.setItem('day', day);
    }

    if (localStorage.getItem('quoteText'))
    {
      quote.textContent = '“' + localStorage.getItem('quoteText') + '”';
      author.textContent = '- ' + localStorage.getItem('quoteAuthor');
    }
  }
  
  if (main.style.opacity === '')
  {
    main.style.opacity = '1';
  }
}

document.getElementsByClassName('focus__input--loader')[0].addEventListener('keypress', function(event) {
  if (event.keyCode === 13)
  {
    event.preventDefault();
    localStorage.setItem('name', event.target.value);
    document.getElementsByClassName('loader')[0].style.display = 'none';
    setInterval(checkTime, 500);
  }
});

if (localStorage.getItem('name'))
{
  document.getElementsByClassName('loader')[0].style.display = 'none';
  setInterval(checkTime, 500);
}
