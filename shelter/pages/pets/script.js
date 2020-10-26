const links = document.getElementsByClassName("navigation__link");
const linkPets = document.getElementsByClassName("navigation__link--active")[0];
const overlay = document.getElementsByClassName("navigation__overlay")[0];
const navigationBurger = document.getElementsByClassName("navigation__button")[0];
let isMenuShown = false;

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