const links = Array.from(document.getElementsByClassName("navigation__link")).slice(0, 2);
const logo = document.getElementsByClassName("logo")[0];
const linkPets = document.getElementsByClassName("navigation__link--active")[0];
const overlay = document.getElementsByClassName("overlay")[0];
const navigationBurger = document.getElementsByClassName("navigation__button")[0];
const popup = document.getElementsByClassName("popup")[0];
const galleryCards = document.getElementsByClassName("gallery__cards")[0];
let isMenuShown = false;
let isPopupVisible = false;

for (let i = 0; i < links.length; ++i)
{
  if (!links[i].className.split(' ').includes("navigation__link--active"))
  {
    links[i].addEventListener('mouseover', function() {
      linkPets.style.color = "#545454";
    });
    links[i].addEventListener('mouseout', function() {
      linkPets.style.color = "#292929";
    });
  }
}

function showOverlay()
{
  overlay.style.width = '100vw';
  overlay.style.opacity = '1';
}

function hideOverlay()
{
  overlay.style.opacity = '0';
  setTimeout(() => overlay.style.width = '0', 500);
}

function showPopup() {
  document.body.style.overflow = 'hidden';
  showOverlay();
  isPopupVisible = true;
  popup.style.display = 'flex';
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 1);
  document.getElementsByClassName('popup__close')[0].style.display = 'flex';
  setTimeout(() => {
    document.getElementsByClassName('popup__close')[0].style.opacity = '1';
  }, 1);
}

function hidePopup() {
  document.body.style.overflow = '';
  hideOverlay();
  isPopupVisible = false;
  popup.style.opacity = '0'
  setTimeout(() => {
    popup.style.display = 'none';
  }, 300)
  document.getElementsByClassName('popup__close')[0].style.opacity = '0';
  setTimeout(() => {
    document.getElementsByClassName('popup__close')[0].style.display = 'none';
  }, 300)
}

function generateCard(index)
{
  const animal = animals[index];
  const card = document.createElement('div');
  card.classList.add('card');
  card.index = index;
  
  const img = document.createElement('img');
  img.classList.add('card__img');
  img.width = '270';
  img.height = '270';
  const src = animal.img;
  img.src = src;
  img.alt = animal.name;
  card.appendChild(img);
  
  const name = document.createElement('h4');
  name.classList.add('card__name');
  name.textContent = animal.name;
  card.appendChild(name);
  
  const learnMore = document.createElement('a');
  learnMore.classList.add('btn');
  learnMore.textContent = 'Learn More';
  card.appendChild(learnMore);
  
  return card;
}

function generatePagination()
{
  let firstPage = [];
  let cardsPerPage = toGenerate();
  for (let i = 0; i < cardsPerPage; ++i)
  {
    firstPage.push(i);
  }
  firstPage = shuffle(firstPage);
  
  let pagination = firstPage.slice();
  for (let i = cardsPerPage; i < 48; i += cardsPerPage)
  {
    let prev = pagination.slice(i - cardsPerPage, i);
    const current = [];
    for (let j = 0; j < cardsPerPage; ++j)
    {
      let randIndex;
      do {
        randIndex = Math.floor(Math.random() * 8);
      } while (current.includes(randIndex));
      current.push(randIndex);
      pagination.push(randIndex);
    }
  }
  
  return pagination;
}

function toGenerate()
{
  if (window.innerWidth >= 1280) return 8;
  else if (window.innerWidth >= 768) return 6;
  else return 3;
}

function relayoutCards(cards)
{
  Array.from(galleryCards.children).forEach(card => card.style.opacity = '0');
  
  setTimeout(() => {
    while (galleryCards.firstElementChild)
    {
      galleryCards.firstElementChild.remove();
    }
    
    for (let i = 0; i < cards.length; ++i)
    {
      const card = generateCard(cards[i]);
      card.style.opacity = '0';
      galleryCards.appendChild(card);
    }

      Array.from(galleryCards.children).forEach(card => {
        card.querySelector('.card__img').addEventListener('load', e => {
          let card = e.target.parentElement;
          setTimeout(() => {
            card.style.opacity = '1';
          }, 400);
        });
      });

  }, 400);
}

function listenCards()
{
  [...document.getElementsByClassName('card')].forEach(function (el) {
    el.addEventListener('click', function () {
      showOverlay();
      const animal = animals[el.index];
      document.getElementsByClassName('popup__img')[0].src = animal.img;
      document.getElementsByClassName('popup__img')[0].alt = animal.name;
      document.getElementsByClassName('popup__heading')[0].textContent = animal.name;
      document.getElementsByClassName('popup__subheading')[0].textContent = animal.type + ' - ' + animal.breed;
      document.getElementsByClassName('popup__text')[0].textContent = animal.description;
      document.querySelector('[age]').textContent = animal.age;
      document.querySelector('[inoculations]').textContent = animal.inoculations.join(', ');
      document.querySelector('[diseases]').textContent = animal.diseases.join(', ');
      document.querySelector('[parasites]').textContent = animal.parasites.join(', ');
      document.querySelector('.navigation').style.zIndex = '5';
      showPopup();
    });
  })
}

function resetPage()
{
  document.querySelector('[page]').textContent = page = 1;
  document.querySelector('[first]').setAttribute('disabled', '');
  document.querySelector('[first]').classList.add('btn--disabled');
  document.querySelector('[prev]').setAttribute('disabled', '');
  document.querySelector('[prev]').classList.add('btn--disabled');
  document.querySelector('[next]').removeAttribute('disabled');
  document.querySelector('[next]').classList.remove('btn--disabled');
  document.querySelector('[last]').removeAttribute('disabled');
  document.querySelector('[last]').classList.remove('btn--disabled');
}

navigationBurger.addEventListener('click', function () {
  if (isMenuShown)
  {
    isMenuShown = false;
    navigationBurger.style.transform = '';
    navigationBurger.style.top = '';
    document.body.style.overflow = 'visible';
    
    // Move logo back
    logo.style.opacity = '0';
    setTimeout(() => {
      logo.style.left = '0';
    }, 300);
    setTimeout(() => logo.style.opacity = '1', 300);
    
    hideOverlay();
  }
  else
  {
    isMenuShown = true;
    
    showOverlay();
    
    navigationBurger.style.transform = 'rotate(90deg)';
    
    // Move logo
    logo.style.opacity = '0';
    setTimeout(() => {
      logo.style.left = `${window.innerWidth - 320}px`;
    }, 300);
    setTimeout(() => logo.style.opacity = '1', 300);
    
    // Prevent scroll
    document.body.style.overflow = 'hidden';
  }
});

overlay.addEventListener('click', function() {
  if (document.getElementById('toggle').checked)
  {
    if (isMenuShown)
    {
      logo.style.opacity = '0';
      setTimeout(() => {
        logo.style.left = '0';
      }, 300);
      setTimeout(() => logo.style.opacity = '1', 300);
      isMenuShown = false;
    }
    document.getElementById('toggle').checked = false;
    navigationBurger.style.transform = '';
    document.body.style.overflow = 'visible';
    hideOverlay();
  }
  
  if (isPopupVisible)
  {
    isPopupVisible = false;
    document.querySelector('.navigation').style.zIndex = '';
    hidePopup();
  }
});

function shuffle(array) {
  var i = array.length,
  j = 0,
  temp;
  
  while (i--)
  {
    j = Math.floor(Math.random() * (i+1));
    
    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  
  return array;
}

let pagination = generatePagination();

// Get animals from server
let animals = {};
let cards = [];

fetch("https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/markups/level-2/shelter/pets.json")
.then(function(response) {
  return response.json();
})
.then(function(data) {
  animals = data;
  const slides = document.createDocumentFragment();
  let amountCards = toGenerate();
  for (let i = 0; i < amountCards; ++i)
  {
    slides.appendChild(generateCard(pagination[i]));
  }
  
  document.getElementsByClassName('gallery__cards')[0].appendChild(slides);
  cards = pagination.slice(0, amountCards);
  
  listenCards();
})

document.getElementsByClassName('popup__close')[0].addEventListener('click', hidePopup);
overlay.addEventListener('mouseover', () => document.getElementsByClassName('popup__close')[0].style.backgroundColor = '#F1CDB3');
overlay.addEventListener('mouseout', () => document.getElementsByClassName('popup__close')[0].style.backgroundColor = '');

let page = 1;
window.addEventListener('resize', function() {
  const numCards = toGenerate();
  if (numCards !== cards.length)
  {
    resetPage();
    pagination = generatePagination();
    cards = pagination.slice((page - 1) * numCards, page * numCards);
    relayoutCards(cards);
  }
});

document.querySelector('[next]').addEventListener('click', function () {
  const numCards = toGenerate();
  if (++page === 48 / numCards)
  {
    this.setAttribute('disabled', '');
    this.classList.add('btn--disabled');
    document.querySelector('[last]').setAttribute('disabled', '');
    document.querySelector('[last]').classList.add('btn--disabled');
  }
  document.querySelector('[prev]').removeAttribute('disabled');
  document.querySelector('[prev]').classList.remove('btn--disabled');
  document.querySelector('[first]').removeAttribute('disabled');
  document.querySelector('[first]').classList.remove('btn--disabled');
  
  cards = pagination.slice((page - 1) * numCards, page * numCards);
  relayoutCards(cards);
  listenCards();
  
  document.querySelector('[page]').textContent = page;
});

document.querySelector('[prev]').addEventListener('click', function () {
  const numCards = toGenerate();
  if (--page === 1)
  {
    this.setAttribute('disabled', '');
    this.classList.add('btn--disabled');
    document.querySelector('[first]').setAttribute('disabled', '');
    document.querySelector('[first]').classList.add('btn--disabled');
  }
  document.querySelector('[next]').removeAttribute('disabled');
  document.querySelector('[next]').classList.remove('btn--disabled');
  document.querySelector('[last]').removeAttribute('disabled');
  document.querySelector('[last]').classList.remove('btn--disabled');
  
  cards = pagination.slice((page - 1) * numCards, page * numCards);
  relayoutCards(cards);
  listenCards();
  
  document.querySelector('[page]').textContent = page;
});

document.querySelector('[last]').addEventListener('click', function () {
  const numCards = toGenerate();
  this.setAttribute('disabled', '');
  this.classList.add('btn--disabled');
  document.querySelector('[next]').setAttribute('disabled', '');
  document.querySelector('[next]').classList.add('btn--disabled');
  
  document.querySelector('[prev]').removeAttribute('disabled');
  document.querySelector('[prev]').classList.remove('btn--disabled');
  document.querySelector('[first]').removeAttribute('disabled');
  document.querySelector('[first]').classList.remove('btn--disabled');
  
  page = 48 / toGenerate();
  
  cards = pagination.slice((page - 1) * numCards);
  relayoutCards(cards);
  listenCards();
  
  document.querySelector('[page]').textContent = page;
});

document.querySelector('[first]').addEventListener('click', function () {
  const numCards = toGenerate();
  this.setAttribute('disabled', '');
  this.classList.add('btn--disabled');
  document.querySelector('[prev]').setAttribute('disabled', '');
  document.querySelector('[prev]').classList.add('btn--disabled');
  
  document.querySelector('[next]').removeAttribute('disabled');
  document.querySelector('[next]').classList.remove('btn--disabled');
  document.querySelector('[last]').removeAttribute('disabled');
  document.querySelector('[last]').classList.remove('btn--disabled');
  
  page = 1;
  
  cards = pagination.slice(0, numCards);
  relayoutCards(cards);
  listenCards();
  
  document.querySelector('[page]').textContent = page;
});