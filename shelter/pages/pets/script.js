const links = document.getElementsByClassName("navigation__link");
const logo = document.getElementsByClassName("logo")[0];
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
    
    // Move logo
    logo.style.opacity = '0';
    setTimeout(() => {
      logo.style.left = '';
    }, 300);
    setTimeout(() => logo.style.opacity = '1', 300);
    
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.width = '0', 500);
  }
  else
  {
    isMenuShown = true;
    
    // Show overlay
    overlay.style.width = '100vw';
    overlay.style.opacity = '1';
    
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
  if (document.getElementById('toggle').checked) {
    isMenuShown = false;
    document.getElementById('toggle').checked = false;
    navigationBurger.style.transform = '';
    document.body.style.overflow = 'visible';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.width = '0', 500);
  }
});