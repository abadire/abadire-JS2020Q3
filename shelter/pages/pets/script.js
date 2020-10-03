const links = document.getElementsByClassName("nav__link");
const linkPets = document.getElementsByClassName("nav__link--active")[0];

for (let i = 0; i < links.length; ++i)
{
  if (!links[i].className.split(' ').includes("nav__link--active"))
  {
    links[i].addEventListener('mouseover', function() {
      linkPets.style.color = "#545454";
    });
    links[i].addEventListener('mouseout', function() {
      linkPets.style.color = "#292929";
    });
  }
}