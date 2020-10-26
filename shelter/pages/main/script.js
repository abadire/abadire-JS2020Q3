const links = document.getElementsByClassName("navigation__link");
const linkAbout = document.getElementsByClassName("navigation__link--active")[0];
const overlay = document.getElementsByClassName("navigation__overlay")[0];
const navigationBurger = document.getElementsByClassName("navigation__button")[0];
let isMenuShown = false;

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
    document.body.style.overflow = 'visible';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.width = '0', 500);
  }
  else
  {
    isMenuShown = true;
    overlay.style.width = '100vw';
    overlay.style.opacity = '1';
    navigationBurger.style.transform = 'rotate(90deg)';
    document.body.style.overflow = 'hidden';
  }
});

overlay.addEventListener('click', function() {
  if (document.getElementById('toggle').checked) {
    document.getElementById('toggle').checked = false;
    navigationBurger.style.transform = '';
    document.body.style.overflow = 'visible';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.width = '0', 500);
  }
});

var mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
  
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})