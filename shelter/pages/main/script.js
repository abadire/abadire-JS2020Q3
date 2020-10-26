const links = document.getElementsByClassName("navigation__link");
const logo = document.getElementsByClassName("logo")[0];
const linkAbout = document.getElementsByClassName("navigation__link--active")[0];
const overlay = document.getElementsByClassName("overlay")[0];
const navigationBurger = document.getElementsByClassName("navigation__button")[0];
const popup = document.getElementsByClassName("popup")[0];
let isMenuShown = false;
let isPopupVisible = false;
let cards;

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
  showOverlay();
  isPopupVisible = true;
  popup.style.width = '80vw';
  popup.style.opacity = '1';
  popup.style.overflow = 'visible';
}

function hidePopup() {
  hideOverlay();
  isPopupVisible = false;
  popup.style.opacity = '0'
  setTimeout(() => {
    popup.style.width = '0';
    popup.style.overflow = 'hidden';
  }, 300)
}

for (let i = 0; i < links.length; ++i)
{
  if (!links[i].className.split(' ').includes("navigation__link--active"))
  {
    links[i].addEventListener('mouseover', function() {
      linkAbout.style.color = "#CDCDCD";
    });
    links[i].addEventListener('mouseout', function() {
      linkAbout.style.color = "#FAFAFA";
    });
  }
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
    navigationBurger.style.top = `${window.scrollY}px`;
    
    // Move logo
    logo.style.opacity = '0';
    setTimeout(() => {
      logo.style.left = `${window.innerWidth - 320}px`;
      logo.style.top = `${window.scrollY}px`;
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

fetch("https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/markups/level-2/shelter/pets.json")
.then(function(response) {
  return response.json();
})
.then(function(data) {
  animals = data;
  const slides = document.createDocumentFragment();
  for (let i = 0; i < 8; ++i)
  {
    const animal = data[animalIndices[i]];
    
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    
    const card = document.createElement('div');
    card.classList.add('card');
    
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
    learnMore.href = '#';
    learnMore.textContent = 'Learn More';
    card.appendChild(learnMore);
    
    slide.appendChild(card);
    slides.appendChild(slide);
  }
  
  document.getElementsByClassName('swiper-wrapper')[0].appendChild(slides);
})
.then(function() {
  let swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 30,
    slidesPerGroup: 1,
    observer: true,
    loop: true,
    loopFillGroupWithBlank: true,
    navigation: {
      nextEl: '.pets__arrow--next',
      prevEl: '.pets__arrow--prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 40,
      },
      1280: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 90,
      },
    }
  });
  
  [...document.getElementsByClassName('card')].forEach(function (el) {
    el.addEventListener('click', function () {
      showOverlay();
      isPopupVisible = true;
      popup.style.width = '80vw';
      popup.style.opacity = '1';
      popup.style.overflow = 'visible';
    });
  })
});

document.getElementsByClassName('popup__close')[0].addEventListener('click', hidePopup);