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
    field.appendChild(chip);
  }
  
  field.lastElementChild.classList.add('field__chip--blank');
  field.lastElementChild.textContent = '';
  main.appendChild(field);
  return main;
}

document.body.appendChild(generateDom(4));
/******************/

/* GLOBALS */
const grid = [];
/***********/
