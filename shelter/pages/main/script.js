const links = document.getElementsByClassName("navigation__link");
const linkAbout = document.getElementsByClassName("navigation__link--active")[0];

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

document.getElementsByClassName('navigation__button')[0].addEventListener('click', function () {
  document.getElementsByClassName('navigation__overlay')[0].style.width = '100vw';
  document.getElementsByClassName('navigation__overlay')[0].style.opacity = '1';
});

document.getElementsByClassName('navigation__overlay')[0].addEventListener('click', function () {
  if (document.getElementById('toggle').checked) {
    document.getElementById('toggle').checked = false;
    this.style.opacity = '0';
    setTimeout(() => this.style.width = '0', 500);
  }
});