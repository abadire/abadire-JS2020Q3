/* DOM GENERATION */
function generateDom() {
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
  for (let i = 0; i < 16; ++i) {
    const chip = document.createElement('div');
    chip.classList.add('field__chip');
    field.appendChild(chip);
  }
  
  field.lastElementChild.classList.add('field__chip--blank');
  main.appendChild(field);
  return main;
}

document.body.appendChild(generateDom());