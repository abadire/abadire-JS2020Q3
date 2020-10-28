const links = Array.from(document.getElementsByClassName("navigation__link")).slice(0, 2);
const logo = document.getElementsByClassName("logo")[0];
const linkPets = document.getElementsByClassName("navigation__link--active")[0];
const overlay = document.getElementsByClassName("overlay")[0];
const navigationBurger = document.getElementsByClassName("navigation__button")[0];
const popup = document.getElementsByClassName("popup")[0];
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
      logo.style.left = '';
      logo.style.top = '0';
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
    isMenuShown = false;
    document.getElementById('toggle').checked = false;
    navigationBurger.style.transform = '';
    document.body.style.overflow = 'visible';
    hideOverlay();
  }
  
  if (isPopupVisible)
  {
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

// Generate indices
let animalIndices = [];
for (let i = 0; i < 8; ++i)
{
  animalIndices.push(i);
}
animalIndices = shuffle(animalIndices);

// Get animals from server
let animals;
let current = [];

fetch("https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/markups/level-2/shelter/pets.json")
.then(function(response) {
  return response.json();
})
.then(function(data) {
  animals = data;
  const slides = document.createDocumentFragment();
  for (let i = 0; i < 6; ++i)
  {
    const animal = data[animalIndices[i]];
    current.push(animalIndices[i]);

    const card = document.createElement('div');
    card.classList.add('card');
    card.index = animalIndices[i];
    
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
    
    slides.appendChild(card);
  }
  
  document.getElementsByClassName('gallery__cards')[0].appendChild(slides);

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
      showPopup();
    });
  })

})
.then(function() {
  

});

document.getElementsByClassName('popup__close')[0].addEventListener('click', hidePopup);
overlay.addEventListener('mouseover', () => document.getElementsByClassName('popup__close')[0].style.backgroundColor = '#FFF5');
overlay.addEventListener('mouseout', () => document.getElementsByClassName('popup__close')[0].style.backgroundColor = '');