/* GLOBALS */
let dim = 2; // Default dimensions
const grid = [];
let idxBlank = 0;
let blank;
let steps;
let rows = [];
const buttons = [];
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

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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
    case -dim: {
      this.style.transform = 'translateY(calc(100% + .5rem))';
      break;
    }
    case dim: {
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
    idxBlank = updateIdxBlank(grid);
    this.pointerEvents = '';
  }, 300);
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  updateIdxBlank(array);
}

function updateIdxBlank(arr) {
  return arr.indexOf(blank);
}

function isSolvable(field) {
  let inversions = 0;
  field.filter(el => el !== blank).forEach((el, idx, arr) => {
    for (let i = idx + 1; i < arr.length; ++i) {
      if (el.textContent > arr[i].textContent) inversions++;
    }
  });

  if (dim % 2 === 1) {
    if (inversions % 2 === 0) return true;
  } else {
    if (rows[idxBlank] % 2 === 0 && inversions % 2 === 1 ||
        rows[idxBlank] % 2 === 1 && inversions % 2 === 0)
      return true;
  }
  return false;
}

function relayoutField(field, grid) {
  while (field.lastElementChild !== overlay) {
    field.removeChild(field.lastElementChild);
  }
  grid.forEach(el => field.appendChild(el));
}

function regenerateGrid(grid) {
  do {
    shuffle(grid);
    idxBlank = updateIdxBlank(grid);
  } while (!isSolvable(grid));
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

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  const nav = document.createElement('nav');
  nav.classList.add('overlay__nav');
  overlay.appendChild(nav);
  const navList = document.createElement('ul');
  navList.classList.add('overlay__items');
  for (let i = 0; i < 5; ++i) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    li.classList.add('overlay__item');
    button.classList.add('overlay__button');
    li.appendChild(button);
    navList.appendChild(li);

    buttons.push(button);
  }
  navList.children[0].firstElementChild.textContent = 'New game';
  navList.children[1].firstElementChild.textContent = 'Saved games';
  navList.children[2].firstElementChild.textContent = 'Best scores';
  navList.children[3].firstElementChild.textContent = 'Rules';
  navList.children[4].firstElementChild.textContent = 'Settings';
  nav.appendChild(navList);
  field.appendChild(overlay);

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
  blank = field.lastElementChild;
  main.appendChild(field);

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
const newGame = document.getElementsByClassName('overlay__button')[0];
const overlay = document.getElementsByClassName('overlay')[0];
/****************/

newGame.addEventListener('click', function() {
  buttons.forEach(btn => {
    btn.style.color = 'transparent';
    btn.style.borderBottom = '2px solid transparent';
    delay(300)
      .then(() => {
        btn.style.display = 'none';
        btn.style.color = '';
        btn.style.borderBottom = '';

        overlay.style.backgroundColor = '#fff';

        return delay(800);
      })
      .then(() => {
        regenerateGrid(grid);
        relayoutField(field, grid);
        overlay.style.opacity = '0';

        return delay(400);
      })
      .then(() => {
        overlay.style.display = 'none';
        overlay.style.backgroundColor = '#fff7';
      });
  });
});