/* GLOBALS */
let dim = 4; // Default dimensions
let nextDim = dim; // Next dimension setting
const grid = []; // An array of chip nodes
let blank; // Blank chip
let idxBlank = 0; // Index of the blank chip
let steps;
let updateIntervalId;
let rows = []; // Helper array to check the row of a chip
let isPaused = true;
const buttons = [];
const cache = new Map();
/***********/

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
  const clockDisplay = document.createElement('span');
  clockDisplay.classList.add('header__clock');
  const minDisplay = document.createElement('span');
  minDisplay.setAttribute('data-min', '');
  minDisplay.textContent = '--';
  const colon = document.createElement('span');
  colon.textContent = ':';
  const secDisplay = document.createElement('span');
  secDisplay.setAttribute('data-sec', '');
  secDisplay.textContent = '--';
  clockDisplay.appendChild(minDisplay);
  clockDisplay.appendChild(colon);
  clockDisplay.appendChild(secDisplay);
  time.appendChild(clockDisplay);
  const stepsSpan = document.createElement('span');
  stepsSpan.classList.add('header__steps');
  stepsSpan.textContent = 'Steps: ';
  const stepAmount = document.createElement('span');
  stepAmount.setAttribute('data-steps', '');
  stepAmount.textContent = '0';
  steps = stepAmount;
  stepsSpan.appendChild(stepAmount);
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('header__container');
  const button = document.createElement('button');
  button.classList.add('header__button');
  button.textContent = 'Pause';
  button.style.pointerEvents = 'none';
  buttonContainer.appendChild(button);
  header.appendChild(time);
  header.appendChild(stepsSpan);
  header.appendChild(buttonContainer);
  main.appendChild(header);

  const field = document.createElement('div');
  field.classList.add('field');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.style.opacity = '1';
  const nav = document.createElement('nav');
  nav.classList.add('overlay__nav');
  nav.style.opacity = '1';
  overlay.appendChild(nav);
  const navList = document.createElement('ul');
  navList.classList.add('overlay__items');
  for (let i = 0; i < 6; ++i) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    li.classList.add('overlay__item');
    button.classList.add('overlay__button');
    li.appendChild(button);
    navList.appendChild(li);

    buttons.push(button);
  }
  navList.children[0].firstElementChild.textContent = 'New game';
  navList.children[1].firstElementChild.textContent = 'Save game';
  navList.children[2].firstElementChild.textContent = 'Load game';
  navList.children[3].firstElementChild.textContent = 'Best scores';
  navList.children[4].firstElementChild.textContent = 'Rules';
  navList.children[5].firstElementChild.textContent = 'Settings';
  nav.appendChild(navList);
  field.appendChild(overlay);

  resetGrid(grid, field, dim);

  main.appendChild(field);

  return main;
}

document.body.appendChild(generateDom(dim));
/******************/

/* DOM ELEMENTS */
const field = document.getElementsByClassName('field')[0];
const newGame = document.getElementsByClassName('overlay__button')[0];
const save = document.getElementsByClassName('overlay__button')[1];
const rules = document.getElementsByClassName('overlay__button')[4];
const settings = document.getElementsByClassName('overlay__button')[5];
const overlay = document.getElementsByClassName('overlay')[0];
const pause = document.getElementsByClassName('header__button')[0];
const minutes = document.querySelector('[data-min]');
const seconds = document.querySelector('[data-sec]');
const navigation = document.getElementsByClassName('overlay__nav')[0];
/****************/

/* EVENT LISTENERS */
newGame.addEventListener('click', function() {
  const buttonFade = 300;
  const overlayToWhite = 800;
  const overlayFade = 400;

  buttons.forEach(btn => {
    btn.style.color = 'transparent';
    btn.style.borderBottom = '2px solid transparent';
    delay(buttonFade)
      .then(() => {
        btn.style.display = 'none';
        btn.style.color = '';
        btn.style.borderBottom = '';

        return delay(overlayToWhite + overlayFade);
      })
      .then(() => btn.style.display = '');
  });

  delay(buttonFade)
    .then(() => {
      overlay.style.backgroundColor = '#fff';

      return delay(overlayToWhite);
    })
    .then(() => {
      overlay.style.opacity = '';
      if (nextDim * nextDim !== grid.length) {
        dim = nextDim;
        resetGrid(grid, field, dim);
      }
      regenerateGrid(grid);
      relayoutField(field, grid);
      return delay(overlayFade);
    })
    .then(() => {
      overlay.style.display = 'none';
      overlay.style.backgroundColor = '';

      updateIntervalId = setInterval(updateTime, 1000, minutes, seconds);
    });
  pause.textContent = 'Pause';
  pause.style.pointerEvents = '';
  isPaused = false;
  resetTime(minutes, seconds);
  steps.textContent = 0;
});

pause.addEventListener('click', function() {
  if (isPaused) {
    pause.textContent = 'Pause';
    hideOverlay();
    updateIntervalId = setInterval(updateTime, 1000, minutes, seconds);
    hideSubs();
    isPaused = false;
  } else {
    pause.textContent = 'Resume';
    showMenu();
    clearInterval(updateIntervalId);
    isPaused = true;
  }
});

rules.addEventListener('click', showRules);
settings.addEventListener('click', showSettings);
save.addEventListener('click', () => {
  showPopup('The game is saved!');
  // localStorage.setItem('steps', steps.textContent);
  // localStorage.setItem('minutes', minutes.textContent);
  // localStorage.setItem('seconds', seconds.textContent);
  // localStorage.setItem('grid',)
});
/*******************/

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
    if (isWin(grid)) showWin(minutes.textContent, seconds.textContent, steps.textContent);
  }, 300);
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  updateIdxBlank(array);
}

function clearChildren(parent, until = null) {
  while (parent.lastElementChild !== until) {
    parent.removeChild(parent.lastElementChild);
  }
  navigation.style.opacity = '';
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
  clearChildren(field, overlay);
  grid.forEach(el => field.appendChild(el));
}

function regenerateGrid(grid) {
  do {
    shuffle(grid);
    idxBlank = updateIdxBlank(grid);
  } while (!isSolvable(grid));
}

function hideOverlay() {
  overlay.style.opacity = '';

  delay(300)
    .then(() => {
      overlay.style.display = 'none';
    });
}

function showOverlay() {
  overlay.style.display = '';
  delay(100)
    .then(() => overlay.style.opacity = '1');
}

function showMenu() {
  if (overlay.firstElementChild !== navigation) {
    clearChildren(overlay);
    overlay.appendChild(navigation);
  }
  delay(100).then(() => navigation.style.opacity = '1');
  showOverlay();
}

function resetTime(minutes, seconds) {
  minutes.textContent = '00';
  seconds.textContent = '00';
}

function updateTime(minutes, seconds) {
  if (seconds.textContent === '59') {
    seconds.textContent = '00';
    minutes.textContent = (++minutes.textContent).toString().padStart(2, '0');
  } else {
    seconds.textContent = (++seconds.textContent).toString().padStart(2, '0');
  }
}

function isWin(grid) {
  if (idxBlank !== grid.length - 1) return false;
  for (let i = 0; i < grid.length - 2; ++i) {
    if (grid[i].textContent > grid[i + 1].textContent) {
      return false;
    }
  }
  return true;
}

function showWin(minutes, seconds, steps) {
  clearInterval(updateIntervalId);
  clearChildren(overlay);
  if (!cache.has('win')) {
    const win = document.createElement('div');
    win.classList.add('overlay__sub');
    const winText = document.createElement('p');
    winText.textContent = 'You win!';
    win.appendChild(winText);
    const winTime = document.createElement('p');
    winTime.textContent = `Your time: ${minutes}:${seconds}`;
    win.appendChild(winTime);
    const winSteps = document.createElement('p');
    winSteps.textContent = `Your steps: ${steps} step${steps === 1 ? '' : 's'}`;
    win.appendChild(winSteps);
    const btn = document.createElement('button');
    btn.classList.add('overlay__button');
    btn.textContent = 'To main menu';
    win.appendChild(btn);
    btn.addEventListener('click', () => {
      win.style.opacity = '';
      delay(400).then(showMenu);
    });
    cache.set('win', win);
  }
  cache.get('win').style.opacity = '1';
  overlay.appendChild(cache.get('win'));
  isPaused = true;
  pause.style.pointerEvents = 'none';
  showOverlay();
}

function showRules() {
  overlay.firstElementChild.style.opacity = '';
  if (!cache.has('rules')) {
    const rules = document.createElement('div');
    rules.classList.add('overlay__sub');
    const title = document.createElement('h2');
    title.classList.add('overlay__header');
    title.textContent = 'Rules';
    rules.appendChild(title);
    const text = document.createElement('p');
    text.textContent = `The object of the puzzle is to place the tiles in order by making sliding moves that use the empty space.
    You can save your game and load it later. Or you can just use the pause button. Also you can choose game field size in Settings.`;
    text.classList.add('overlay__text');
    rules.appendChild(text);
    const btn = document.createElement('button');
    btn.classList.add('overlay__button');
    btn.textContent = 'To main menu';
    btn.addEventListener('click', () => {
      rules.style.opacity = '';
      delay(400).then(showMenu);
    });
    rules.appendChild(btn);
    cache.set('rules', rules);
  }

  delay(400).then(() => {
    clearChildren(overlay);
    overlay.appendChild(cache.get('rules'));
    return delay(100);
  })
    .then(() => cache.get('rules').style.opacity = '1');
}

function hideSubs() {
  cache.forEach(function(value) {
    value.style.opacity = '';
  });
}

function showSettings() {
  overlay.firstElementChild.style.opacity = '';
  if (!cache.has('settings')) {
    const settings = document.createElement('div');
    settings.classList.add('overlay__sub');
    const title = document.createElement('h2');
    title.classList.add('overlay__header');
    title.textContent = 'Settings';
    settings.appendChild(title);
    const dropDown = document.createElement('form');
    dropDown.classList.add('overlay__form');
    settings.appendChild(dropDown);
    const label = document.createElement('label');
    label.classList.add('overlay__label');
    label.textContent = 'Field size:';
    label.setAttribute('for', 'sizes');
    dropDown.appendChild(label);
    const select = document.createElement('select');
    select.classList.add('overlay__select');
    select.setAttribute('name', 'sizes');

    const text1 = document.createElement('p');
    text1.textContent = 'Changes saved!';
    text1.classList.add('overlay__text', 'overlay__text--center');
    const text2 = document.createElement('p');
    text2.textContent = 'Start a new game to apply settings.';
    text2.classList.add('overlay__text', 'overlay__text--center');

    for (let i = 3; i < 9; ++i) {
      const option = document.createElement('option');
      option.textContent = i + 'x' + i;
      option.setAttribute('value', i);
      if (i === 4) option.setAttribute('selected', '');
      option.classList.add('overlay__option');
      select.appendChild(option);
    }
    dropDown.appendChild(select);
    dropDown.addEventListener('change', evt => {
      nextDim = +evt.target.selectedOptions[0].getAttribute('value');
      text1.style.opacity = '1';
      text2.style.opacity = '1';

      setTimeout(() => {
        text1.style.opacity = '';
        text2.style.opacity = '';
      }, 2000);
    });

    settings.appendChild(text1);
    settings.appendChild(text2);
    const btn = document.createElement('button');
    btn.classList.add('overlay__button');
    btn.textContent = 'To main menu';
    btn.addEventListener('click', () => {
      settings.style.opacity = '';
      delay(400).then(showMenu);
    });
    settings.appendChild(btn);
    cache.set('settings', settings);
  }

  delay(400).then(() => {
    clearChildren(overlay);
    overlay.appendChild(cache.get('settings'));
    return delay(100);
  })
    .then(() => cache.get('settings').style.opacity = '1');
}

function resetGrid(grid, field, dim) {
  grid.length = 0;
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
  field.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
  field.style.gridTemplateRows = `repeat(${dim}, 1fr)`;

  // Globals edits
  blank = field.lastElementChild;
  idxBlank = dim * dim - 1;

  rows.length = 0;
  for (let i = 0; i < dim; ++i) {
    for (let j = 0; j < dim; ++j) rows.push(i);
  }
}

function showPopup(str) {
  let popup = cache.get('popup');
  if (!popup) {
    popup = document.createElement('p');
    popup.textContent = str;
    popup.classList.add('overlay__text', 'overlay__text--center', 'overlay__text--popup');
    overlay.appendChild(popup);
    cache.set('popup', popup);
  }
  delay(100)
    .then(() => {
      popup.style.opacity = '1';
      return delay(2000);
    })
    .then(() => {
      popup.style.opacity = '';
    });
}
/*************/
