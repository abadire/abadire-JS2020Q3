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