/* GLOBALS */
let dim = 4; // Default dimensions
let nextDim = dim; // Next dimension setting
let grid = []; // An array of chip nodes
let blank; // Blank chip
let idxBlank = 0; // Index of the blank chip
let steps;
let updateIntervalId;
const rows = []; // Helper array to check the row of a chip
let isPaused = true;
const buttons = [];
const cache = new Map();
const months = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};
let isSoundOn = localStorage.getItem('isSoundOn') ? localStorage.getItem('isSoundOn') === 'true' : true;
let isDisplayNumbers = localStorage.getItem('isDisplayNumbers') ? localStorage.getItem('isDisplayNumbers') === 'true' : true;
/** ******** */

/* DOM OBJECTS PREDIFINITION */
/**
 * The following objects are defined w/ 'let'
 * because they will be assigned w/ corresponding DOM Elements
 */
let overlay; // The field overlay object. Used to hide game field and show various menus
let navigation; // Main menu navigation
let sound; // The sound to play on a chip's move
let minutes; // The span which contains game minutes
let seconds; // The span which contains game seconds
let pause; // The pause button
/* ************************* */

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function swap(node1, node2) {
  const afterNode2 = node2.nextElementSibling;
  const parent = node2.parentNode;
  if (node1 === afterNode2) parent.insertBefore(node1, node2);
  else {
    node1.replaceWith(node2);
    parent.insertBefore(node1, afterNode2);
  }
}

function updateIdxBlank(arr) {
  return arr.indexOf(blank);
}

function isWin(grid) {
  if (idxBlank !== grid.length - 1) return false;
  for (let i = 0; i < grid.length - 2; i += 1) {
    if (+grid[i].textContent > +grid[i + 1].textContent) {
      return false;
    }
  }
  return true;
}

function clearChildren(parent, until = null) {
  while (parent.lastElementChild !== until) {
    parent.removeChild(parent.lastElementChild);
  }
}

function showOverlay() {
  overlay.style.display = '';
  delay(100)
    .then(() => { overlay.style.opacity = '1'; });
}

function showMenu() {
  if (overlay.firstElementChild !== navigation) {
    clearChildren(overlay);
    overlay.appendChild(navigation);
  }
  delay(100).then(() => {
    navigation.style.opacity = '1';
    showOverlay();
  });
}

function scoreComparator(a, b) {
  const left = (a.minutes * 60 + a.seconds + a.steps) / a.dim;
  const right = (b.minutes * 60 + b.seconds + b.steps) / b.dim;

  return left - right;
}

function showWin(minutes, seconds, steps) {
  clearInterval(updateIntervalId);
  clearChildren(overlay);
  navigation.style.opacity = '';
  let winTime; let
    winSteps;
  if (cache.has('win')) {
    winTime = cache.get('win').querySelector('[data-time]');
    winSteps = cache.get('win').querySelector('[data-steps]');
  } else {
    const win = document.createElement('div');
    win.classList.add('overlay__sub');
    const winText = document.createElement('p');
    winText.textContent = 'You win!';
    win.appendChild(winText);
    winTime = document.createElement('p');
    winTime.setAttribute('data-time', '');
    win.appendChild(winTime);
    winSteps = document.createElement('p');
    winSteps.setAttribute('data-steps', '');
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
  winTime.textContent = `Your time: ${minutes}:${seconds}`;
  winSteps.textContent = `Your steps: ${steps} step${steps === 1 ? '' : 's'}`;
  cache.get('win').style.opacity = '1';
  overlay.appendChild(cache.get('win'));

  const winScore = {
    date: Date.now(),
    steps,
    minutes,
    seconds,
    dim,
  };
  if (!localStorage.getItem('scores')) {
    const scores = [winScore];
    localStorage.setItem('scores', JSON.stringify(scores));
  } else {
    const scores = JSON.parse(localStorage.getItem('scores')).sort(scoreComparator);
    if (scores.length < 10) scores.push(winScore);
    else if (scoreComparator(winScore, scores[scores.length - 1]) < 0) {
      scores.length = 9; // Make space for an entry
      scores.push(winScore);
    }
    localStorage.setItem('scores', JSON.stringify(scores));
  }

  isPaused = true;
  pause.style.pointerEvents = 'none';
  showOverlay();
}

function moveChip() {
  const idx = grid.indexOf(this);
  const distance = idx - idxBlank;
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
  steps.textContent = +steps.textContent + 1;
  this.pointerEvents = 'none';
  setTimeout(() => {
    if (isSoundOn) {
      sound.currentTime = 0;
      sound.play();
    }
    this.style.transition = 'transform 0s';
    this.style.transform = '';
    swap(this, grid[idxBlank]);
    setTimeout(() => { this.style.transition = ''; }, 100);
    [grid[idx], grid[idxBlank]] = [grid[idxBlank], grid[idx]];
    idxBlank = updateIdxBlank(grid);
    this.pointerEvents = '';
    if (isWin(grid)) showWin(minutes.textContent, seconds.textContent, steps.textContent);
  }, 300);
}

function swapChip() {
  steps.textContent = +steps.textContent + 1;
  const idx = grid.indexOf(this);
  if (isSoundOn) {
    sound.currentTime = 0;
    sound.play();
  }
  swap(this, grid[idxBlank]);
  [grid[idx], grid[idxBlank]] = [grid[idxBlank], grid[idx]];
  idxBlank = updateIdxBlank(grid);
  if (isWin(grid)) showWin(minutes.textContent, seconds.textContent, steps.textContent);
}

function dragChip(event) {
  const shiftX = event.clientX - this.getBoundingClientRect().left;
  const shiftY = event.clientY - this.getBoundingClientRect().top;
  const x = event.pageX;
  const y = event.pageY;
  let isSwappable = true;

  this.style.width = `${this.offsetWidth}px`;
  this.style.height = `${this.offsetHeight}px`;

  const blankClone = blank.cloneNode(true);
  this.parentElement.insertBefore(blankClone, this);

  this.style.position = 'absolute';
  this.style.zIndex = 1000;

  // move it out of any current parents directly into body
  // to make it positioned relative to the body
  document.body.append(this);

  // centers the ball at (pageX, pageY) coordinates
  const moveAt = (pageX, pageY) => {
    if (pageX > shiftX && pageX < window.innerWidth - this.offsetWidth + shiftX) this.style.left = `${pageX - shiftX}px`;
    else if (pageX <= shiftX) this.style.left = '0';
    else this.style.left = `${window.innerWidth - this.offsetWidth}px`;

    if (pageY > shiftY && pageY < window.innerHeight - this.offsetHeight + shiftY) this.style.top = `${pageY - shiftY}px`;
    else if (pageY <= shiftY) this.style.top = '0';
    else this.style.top = `${window.innerHeight - this.offsetHeight}px`;

    if ((Math.abs(x - pageX) > 10 || Math.abs(y - pageY) > 10) && isSwappable) isSwappable = false;
  };

  // move our absolutely positioned ball under the pointer
  moveAt(event.pageX, event.pageY);

  const dropPoint = {
    target: null,
    x: null,
    y: null,
    // methods return boundaries of a square with the side === target.side * 0.6
    leftBound() {
      return this.target.getBoundingClientRect().left + this.target.offsetWidth * 0.2;
    },
    rightBound() {
      return this.target.getBoundingClientRect().right - this.target.offsetWidth * 0.2;
    },
    upperBound() {
      return this.target.getBoundingClientRect().top + this.target.offsetHeight * 0.2;
    },
    lowerBound() {
      return this.target.getBoundingClientRect().bottom - this.target.offsetWidth * 0.2;
    },
  };

  const onMouseMove = (event) => {
    moveAt(event.pageX, event.pageY);

    const halfWidth = this.offsetWidth / 2;
    const halfHeight = this.offsetHeight / 2;
    this.style.display = 'none';
    const pointX = event.clientX - shiftX + halfWidth;
    const pointY = event.clientY - shiftY + halfHeight;
    const elemBelow = document.elementFromPoint(pointX, pointY);
    this.style.display = '';

    if (blank === elemBelow) {
      [dropPoint.target, dropPoint.x, dropPoint.y] = [elemBelow, pointX, pointY];
    }
  };

  // (2) move the ball on mousemove
  document.addEventListener('mousemove', onMouseMove);

  // (3) drop the ball, remove unneeded handlers
  window.onmouseup = (event) => {
    document.removeEventListener('mousemove', onMouseMove);
    this.style.position = '';
    this.style.width = '';
    this.style.height = '';
    this.style.zIndex = '';
    this.style.left = '';
    this.style.top = '';
    document.body.removeChild(this);
    blankClone.parentElement.insertBefore(this, blankClone);
    blankClone.parentElement.removeChild(blankClone);
    window.onmouseup = null;

    if (
      Math.abs(x - event.pageX) < 10
      && Math.abs(y - event.pageY) < 10
      && isSwappable
    ) {
      delay(100).then(() => moveChip.bind(this)());
    } else if (
      dropPoint.target
      && dropPoint.x > dropPoint.leftBound()
      && dropPoint.x < dropPoint.rightBound()
      && dropPoint.y > dropPoint.upperBound()
      && dropPoint.y < dropPoint.lowerBound()
    ) {
      swapChip.bind(this)();
    }
  };
}

function resetGrid(grid, field, dim) {
  grid.length = 0;
  for (let i = 0; i < dim * dim; i += 1) {
    const chip = document.createElement('div');
    chip.classList.add('field__chip');
    chip.textContent = i + 1;
    chip.addEventListener('mousedown', dragChip);
    grid.push(chip);
    field.appendChild(chip);
  }
  field.lastElementChild.classList.add('field__chip--blank');
  field.lastElementChild.textContent = '';
  field.lastElementChild.removeEventListener('mousedown', dragChip);
  field.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
  field.style.gridTemplateRows = `repeat(${dim}, 1fr)`;

  // Globals edits
  blank = field.lastElementChild;
  idxBlank = dim * dim - 1;

  rows.length = 0;
  for (let i = 0; i < dim; i += 1) {
    for (let j = 0; j < dim; j += 1) rows.push(i);
  }
}

function toggleImages(grid, index) {
  const imgNumber = index || Math.floor(Math.random() * 150 + 1);
  overlay.style.backgroundColor = '#fff';
  delay(600)
    .then(() => {
      if (isDisplayNumbers) {
        grid.forEach((el) => {
          el.style.backgroundImage = '';
          el.style.color = '';
        });
      } else {
        grid.forEach((el) => {
          if (el.textContent === '') return;
          el.style.backgroundImage = `url("assets/images/${imgNumber}.jpg")`;
          el.style.color = 'transparent';
        });
      }
      overlay.style.backgroundColor = '';
    });
}

function alignImages(grid) {
  grid.forEach((el) => {
    if (el.textContent === '') return;

    const fieldWidth = el.parentElement.offsetWidth;
    const fieldHeight = el.parentElement.offsetHeight;
    el.style.backgroundSize = `${fieldWidth}px ${fieldHeight}px`;

    const idx = el.textContent - 1;

    const posStr = `left -${((idx % dim) * fieldWidth) / dim}px top -${((rows[idx] * fieldHeight) / dim)}px`;
    el.style.backgroundPosition = posStr;
  });
}

/* DOM GENERATION */
function generateDom(dimensions) {
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
  minDisplay.textContent = '00';
  const colon = document.createElement('span');
  colon.textContent = ':';
  const secDisplay = document.createElement('span');
  secDisplay.setAttribute('data-sec', '');
  secDisplay.textContent = '00';
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
  for (let i = 0; i < 6; i += 1) {
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

  resetGrid(grid, field, dimensions);

  main.appendChild(field);

  const audio = document.createElement('audio');
  audio.setAttribute('data-sound', '');
  audio.src = 'assets/sounds/sound.wav';
  main.appendChild(audio);

  return main;
}

document.body.appendChild(generateDom(dim));

/* DOM ELEMENTS */
const field = document.getElementsByClassName('field')[0];
const newGame = document.getElementsByClassName('overlay__button')[0];
const save = document.getElementsByClassName('overlay__button')[1];
const load = document.getElementsByClassName('overlay__button')[2];
const scores = document.getElementsByClassName('overlay__button')[3];
const rules = document.getElementsByClassName('overlay__button')[4];
const settings = document.getElementsByClassName('overlay__button')[5];
[overlay] = document.getElementsByClassName('overlay');
[pause] = document.getElementsByClassName('header__button');
minutes = document.querySelector('[data-min]');
seconds = document.querySelector('[data-sec]');
[navigation] = document.getElementsByClassName('overlay__nav');
sound = document.querySelector('[data-sound]');
/** ************** DOM ELEMENTS */

toggleImages(grid);
alignImages(grid);
/** **************** DOM GENERATION */

/* FUNCTIONS */

function makeChip(num) {
  const chip = document.createElement('div');
  chip.classList.add('field__chip');
  if (num === '') chip.classList.add('field__chip--blank');
  else chip.addEventListener('mousedown', dragChip);
  chip.textContent = num;
  grid.push(chip);
  field.appendChild(chip);
  return chip;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function isSolvable(field) {
  let inversions = 0;
  field.filter((el) => el !== blank).forEach((el, idx, arr) => {
    for (let i = idx + 1; i < arr.length; i += 1) {
      if (el.textContent > arr[i].textContent) inversions += 1;
    }
  });

  if (dim % 2 === 1) {
    if (inversions % 2 === 0) return true;
  } else if (
    (rows[idxBlank] % 2 === 0 && inversions % 2 === 1)
    || (rows[idxBlank] % 2 === 1 && inversions % 2 === 0)
  ) { return true; }
  return false;
}

function relayoutField(field, grid) {
  clearChildren(field, overlay);
  grid.forEach((el) => field.appendChild(el));
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

function resetTime(minutes, seconds) {
  minutes.textContent = '00';
  seconds.textContent = '00';
}

function updateTime(minutes, seconds) {
  if (seconds.textContent === '59') {
    seconds.textContent = '00';
    minutes.textContent = (+minutes.textContent + 1).toString().padStart(2, '0');
  } else {
    seconds.textContent = (+seconds.textContent + 1).toString().padStart(2, '0');
  }
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
    .then(() => { cache.get('rules').style.opacity = '1'; });
}

function hideSubs() {
  cache.forEach((value) => {
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
    const labelSelect = document.createElement('label');
    labelSelect.classList.add('overlay__label');
    labelSelect.textContent = 'Field size:';
    labelSelect.setAttribute('for', 'sizes');
    dropDown.appendChild(labelSelect);
    const select = document.createElement('select');
    select.classList.add('overlay__select');
    select.setAttribute('id', 'sizes');

    const text1 = document.createElement('p');
    text1.textContent = 'Changes saved!';
    text1.classList.add('overlay__text', 'overlay__text--center');
    const text2 = document.createElement('p');
    text2.textContent = 'Start a new game to apply settings.';
    text2.classList.add('overlay__text', 'overlay__text--center');

    for (let i = 2; i < 9; i += 1) {
      const option = document.createElement('option');
      option.textContent = `${i}x${i}`;
      option.setAttribute('value', i);
      if (i === 4) option.setAttribute('selected', '');
      option.classList.add('overlay__option');
      select.appendChild(option);
    }
    dropDown.appendChild(select);
    dropDown.addEventListener('change', (evt) => {
      nextDim = +evt.target.selectedOptions[0].getAttribute('value');
      text1.style.opacity = '1';
      text2.style.opacity = '1';

      setTimeout(() => {
        text1.style.opacity = '';
        text2.style.opacity = '';
      }, 2000);
    });

    const soundHeading = document.createElement('p');
    soundHeading.classList.add('overlay__label');
    soundHeading.textContent = 'Sound:';

    const onOption = document.createElement('div');
    const radioButtonOn = document.createElement('input');
    radioButtonOn.setAttribute('type', 'radio');
    radioButtonOn.setAttribute('name', 'sound');
    radioButtonOn.id = 'soundOn';
    const labelOn = document.createElement('label');
    labelOn.classList.add('overlay__labelText');
    labelOn.setAttribute('for', 'soundOn');
    labelOn.textContent = 'on: ';
    onOption.appendChild(labelOn);
    onOption.appendChild(radioButtonOn);

    const offOption = document.createElement('div');
    const radioButtonOff = document.createElement('input');
    radioButtonOff.setAttribute('type', 'radio');
    radioButtonOff.setAttribute('name', 'sound');
    radioButtonOff.id = 'soundOff';
    const labelOff = document.createElement('label');
    labelOff.classList.add('overlay__labelText');
    labelOff.setAttribute('for', 'soundOff');
    labelOff.textContent = 'off: ';
    offOption.appendChild(labelOff);
    offOption.appendChild(radioButtonOff);

    if (!localStorage.getItem('isSoundOn') || localStorage.getItem('isSoundOn') === 'true') radioButtonOn.setAttribute('checked', '');
    else radioButtonOff.setAttribute('checked', '');

    radioButtonOn.onchange = () => {
      if (!isSoundOn) {
        isSoundOn = true;
        radioButtonOn.setAttribute('checked', '');
        radioButtonOff.removeAttribute('checked');
        localStorage.setItem('isSoundOn', 'true');
      }
    };

    radioButtonOff.onchange = () => {
      if (isSoundOn) {
        isSoundOn = false;
        radioButtonOn.removeAttribute('checked');
        radioButtonOff.setAttribute('checked', '');
        localStorage.setItem('isSoundOn', 'false');
      }
    };

    settings.appendChild(soundHeading);
    settings.appendChild(onOption);
    settings.appendChild(offOption);

    const displayHeading = document.createElement('p');
    displayHeading.classList.add('overlay__label');
    displayHeading.textContent = 'Display:';

    const displayNumbers = document.createElement('div');
    const radioNumbers = document.createElement('input');
    radioNumbers.setAttribute('type', 'radio');
    radioNumbers.setAttribute('name', 'display');
    radioNumbers.id = 'displayNumbers';
    const labelNumbers = document.createElement('label');
    labelNumbers.classList.add('overlay__labelText');
    labelNumbers.setAttribute('for', 'displayNumbers');
    labelNumbers.textContent = 'numbers: ';
    displayNumbers.appendChild(labelNumbers);
    displayNumbers.appendChild(radioNumbers);

    const displayImages = document.createElement('div');
    const radioImages = document.createElement('input');
    radioImages.setAttribute('type', 'radio');
    radioImages.setAttribute('name', 'display');
    radioImages.id = 'displayImages';
    const labelImages = document.createElement('label');
    labelImages.classList.add('overlay__labelText');
    labelImages.setAttribute('for', 'displayImages');
    labelImages.textContent = 'images: ';
    displayImages.appendChild(labelImages);
    displayImages.appendChild(radioImages);

    if (!localStorage.getItem('isDisplayNumbers') || localStorage.getItem('isDisplayNumbers') === 'true') radioNumbers.setAttribute('checked', '');
    else radioImages.setAttribute('checked', '');

    radioNumbers.onchange = () => {
      if (!isDisplayNumbers) {
        isDisplayNumbers = true;
        radioNumbers.setAttribute('checked', '');
        radioImages.removeAttribute('checked');
        localStorage.setItem('isDisplayNumbers', 'true');
        toggleImages(grid);
        alignImages(grid);
      }
    };

    radioImages.onchange = () => {
      if (isDisplayNumbers) {
        isDisplayNumbers = false;
        radioNumbers.removeAttribute('checked');
        radioImages.setAttribute('checked', '');
        localStorage.setItem('isDisplayNumbers', 'false');
        toggleImages(grid);
        alignImages(grid);
      }
    };

    settings.appendChild(displayHeading);
    settings.appendChild(displayNumbers);
    settings.appendChild(displayImages);

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
    .then(() => { cache.get('settings').style.opacity = '1'; });
}

function showPopup(str) {
  let popup = cache.get('popup');
  if (!popup) {
    popup = document.createElement('p');
    popup.classList.add('overlay__text', 'overlay__text--center', 'overlay__text--popup');
    cache.set('popup', popup);
  }
  popup.textContent = str;
  overlay.appendChild(popup);
  delay(100)
    .then(() => {
      popup.style.opacity = '1';
      return delay(2000);
    })
    .then(() => {
      popup.style.opacity = '';

      return delay(500);
    })
    .then(() => {
      overlay.removeChild(overlay.lastElementChild);
    });
}

function showScores() {
  overlay.firstElementChild.style.opacity = '';
  const scores = document.createElement('div');
  scores.classList.add('overlay__sub');
  const title = document.createElement('h2');
  title.classList.add('overlay__header');
  title.textContent = 'Best scores';
  scores.appendChild(title);
  const table = document.createElement('div');
  table.classList.add('overlay__table');
  for (let i = 0; i < 5; i += 1) {
    const head = document.createElement('p');
    head.classList.add('overlay__head');
    table.append(head);
  }
  table.children[0].textContent = '№';
  table.children[1].textContent = 'Date';
  table.children[2].textContent = 'Moves';
  table.children[3].textContent = 'Size';
  table.children[4].textContent = 'Time';

  const scoreEntries = JSON.parse(localStorage.getItem('scores'), (key, value) => {
    if (key !== 'date') return value;
    return new Date(value);
  });

  // There may be no entries if no games has been won
  scoreEntries?.sort(scoreComparator)
    .forEach((el, idx) => {
      const number = document.createElement('p');
      number.classList.add('overlay__cell');
      number.textContent = idx + 1;

      const date = document.createElement('p');
      date.classList.add('overlay__cell');
      date.textContent = `${el.date.getDate()} ${months[el.date.getMonth()]} ${el.date.getFullYear()}`;

      const steps = document.createElement('p');
      steps.classList.add('overlay__cell');
      steps.textContent = el.steps;

      const size = document.createElement('p');
      size.classList.add('overlay__cell');
      size.textContent = `${el.dim}x${el.dim}`;

      const time = document.createElement('p');
      time.classList.add('overlay__cell');
      time.textContent = `${el.minutes}:${el.seconds}`;

      table.appendChild(number);
      table.appendChild(date);
      table.appendChild(steps);
      table.appendChild(size);
      table.appendChild(time);
    });

  const rowsCount = scoreEntries?.length + 1 || 1; // +1 for header row OR 1 if there is no entries
  table.style.gridTemplateRows = `repeat(${rowsCount}, auto)`;
  scores.appendChild(table);

  const btn = document.createElement('button');
  btn.classList.add('overlay__button');
  btn.textContent = 'To main menu';
  btn.addEventListener('click', () => {
    scores.style.opacity = '';
    delay(400).then(showMenu);
  });
  scores.appendChild(btn);
  cache.set('scores', scores);

  delay(400).then(() => {
    clearChildren(overlay);
    overlay.appendChild(cache.get('scores'));
    return delay(100);
  })
    .then(() => { cache.get('scores').style.opacity = '1'; });
}
/** ********** */

/* EVENT LISTENERS */
newGame.addEventListener('click', () => {
  const buttonFade = 300;
  const overlayToWhite = 800;
  const overlayFade = 400;

  buttons.forEach((btn) => {
    btn.style.color = 'transparent';
    btn.style.borderBottom = '2px solid transparent';
    delay(buttonFade)
      .then(() => {
        btn.style.display = 'none';
        btn.style.color = '';
        btn.style.borderBottom = '';

        return delay(overlayToWhite + overlayFade);
      })
      .then(() => { btn.style.display = ''; });
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

pause.addEventListener('click', () => {
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
  if (isWin(grid)) return;
  showPopup('The game is saved!');
  const state = {
    steps: steps.textContent,
    min: minutes.textContent,
    sec: seconds.textContent,
    grid,
    dim,
    // imageIndex: grid.find(el => blank !== el).
  };
  localStorage.setItem('state', JSON.stringify(state, (key, value) => {
    if (key !== 'grid') return value;
    return grid.map((el) => el.textContent);
  }));
});

load.addEventListener('click', () => {
  const state = JSON.parse(localStorage.getItem('state'));
  if (state) {
    showPopup('The game has been loaded!');
    ({
      steps: steps.textContent, min: minutes.textContent, sec: seconds.textContent, dim,
    } = state);
    nextDim = dim;
    pause.textContent = 'Resume';
    pause.style.pointerEvents = '';
    overlay.style.backgroundColor = '#fff';
    delay(600)
      .then(() => {
        clearChildren(field, overlay);
        grid.length = 0;
        grid = state.grid.map(makeChip);
        alignImages(grid);
        field.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
        field.style.gridTemplateRows = `repeat(${dim}, 1fr)`;
        blank = grid.find((el) => el.textContent === '');
        idxBlank = grid.indexOf(blank);
        toggleImages(grid);
        alignImages(grid);
        overlay.style.backgroundColor = '';
      });
  }
});

scores.addEventListener('click', showScores);
/** **************** */
