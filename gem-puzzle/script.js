/* GLOBALS */
let dim = 3; // Default dimensions
const grid = [];
let idxBlank = 0;
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
  const distance = idx - idxBlank;
  switch (distance) {
    case -1: {
      this.style.transform = 'translateX(calc(100% + .5rem))';
      break;
    }
    case 1: {
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
  }
  if (this.style.transform) {
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
  const steps = document.createElement('span');
  steps.classList.add('header__steps');
  steps.textContent = 'Steps: ';
  const stepAmount = document.createElement('span');
  stepAmount.setAttribute('data-steps', '');
  stepAmount.textContent = '--'
  steps.appendChild(stepAmount);
  const button = document.createElement('button');
  button.classList.add('header__button');
  button.textContent = 'Pause game'
  header.appendChild(time);
  header.appendChild(steps);
  header.appendChild(button);
  main.appendChild(header);
  
  const field = document.createElement('div');
  field.classList.add('field');
  field.style.gridTemplateColumns = `repeat(${dim}, 1fr)`
  field.style.gridTemplateRows = `repeat(${dim}, 1fr)`
  
  for (let i = 0; i < dim*dim; ++i) {
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
  
  idxBlank = dim * dim - 1;
  return main;
}

document.body.appendChild(generateDom(dim));
/******************/

/* DOM ELEMENTS */
const field = document.getElementsByClassName('field')[0];
/****************/