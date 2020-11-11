/* GLOBALS */
let dim = 3; // Default dimensions
const grid = [];
let idxBlank = 0;
let steps;
let rows = [];
/***********/

/* FUNCTIONS */
function swap(node1, node2) {
  const afterNode2 = node2.nextElementSibling;
  const parent = node2.parentNode;
  if (node1 === afterNode2) parent.insertBefore(node1, node2);
  else {
    node1.replaceWith(node2);
    parent.insertBefore(node1, afterNode2);
  }
}

function moveChip() {
  const idx = grid.indexOf(this);
  let distance = idx - idxBlank;
  switch (distance) {
    case -1: {
      if (rows[idx] !== rows[idxBlank]) return; // if rows don't match
      this.style.transform = 'translateX(calc(100% + .5rem))';
      break;
    }
    case 1: {
      if (rows[idx] !== rows[idxBlank]) return;
      this.style.transform = 'translateX(calc(-100% - .5rem))';
      break;
    }
    case -3: {
      this.style.transform = 'translateY(calc(100% + .5rem))';
      break;
    }
    case 3: {
      this.style.transform = 'translateY(calc(-100% - .5rem))';
      break;
    }
    default: return;
  }
  steps.textContent = ++steps.textContent;
  this.pointerEvents = 'none';
  setTimeout(() => {
    this.style.transition = 'transform 0s';
    this.style.transform = '';
    swap(this, grid[idxBlank]);
    setTimeout(() => this.style.transition = '', 100);
    [grid[idx], grid[idxBlank]] = [grid[idxBlank], grid[idx]];
    idxBlank = grid.findIndex(el => el.classList.contains('field__chip--blank'));
    this.pointerEvents = '';
  }, 300);
}
/*************/

/* DOM GENERATION */
function generateDom(dim) {
  const generated = document.createDocumentFragment();
  const main = document.createElement('main');
  main.classList.add('container');
  generated.appendChild(main);

  const header = document.createElement('header');
  header.classList.add('header');
  const time = document.createElement('span');
  time.classList.add('header__time');
  time.textContent = 'Time: ';
  const clock = document.createElement('span');
  clock.classList.add('header__clock');
  clock.setAttribute('data-clock', '');
  clock.textContent = '--:--';
  time.appendChild(clock);
  const stepsSpan = document.createElement('span');
  stepsSpan.classList.add('header__steps');
  stepsSpan.textContent = 'Steps: ';
  const stepAmount = document.createElement('span');
  stepAmount.setAttribute('data-steps', '');
  stepAmount.textContent = '0';
  steps = stepAmount;
  stepsSpan.appendChild(stepAmount);
  const button = document.createElement('button');
  button.classList.add('header__button');
  button.textContent = 'Pause game';
  header.appendChild(time);
  header.appendChild(stepsSpan);
  header.appendChild(button);
  main.appendChild(header);

  const field = document.createElement('div');
  field.classList.add('field');
  field.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
  field.style.gridTemplateRows = `repeat(${dim}, 1fr)`;

  for (let i = 0; i < dim * dim; ++i) {
    const chip = document.createElement('div');
    chip.classList.add('field__chip');
    chip.textContent = i + 1;
    chip.addEventListener('click', moveChip);
    grid.push(chip);
    field.appendChild(chip);
  }

  field.lastElementChild.classList.add('field__chip--blank');
  field.lastElementChild.textContent = '';
  main.appendChild(field);

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  const nav = document.createElement('nav');
  nav.classList.add('overlay__nav');
  overlay.appendChild(nav);
  const navList = document.createElement('ul');
  navList.classList.add('overlay__items');
  nav.appendChild(navList);


  idxBlank = dim * dim - 1;
  for (let i = 0; i < dim; ++i) {
    for (let j = 0; j < dim; ++j) rows.push(i);
  }
  return main;
}

document.body.appendChild(generateDom(dim));
/******************/

/* DOM ELEMENTS */
const field = document.getElementsByClassName('field')[0];
/****************/