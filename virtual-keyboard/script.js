/**** DOM CONSTS ****/
const textArea = document.getElementsByClassName('text-input')[0];
/********************/

/**** MISC VARIABLES ****/
const buttons = []; // For CAPSLOCKable buttons
let caretPosition = 0;
let isCapital = false;

const shiftsEn = {
  1: '!',
  2: '@',
  3: '#',
  4: '$',
  5: '%',
  6: '^',
  7: '&',
  8: '*',
  9: '(',
  0: ')',
  '[': '{',
  ']': '}',
  ';': ':',
  '\'': '"',
  ',': '<',
  '.': '>',
  '?': '/'
};
const shiftsRu = {
  1: '!',
  2: '"',
  3: '№',
  4: ';',
  5: '%',
  6: ':',
  7: '?',
  8: '*',
  9: '(',
  0: ')',
  '.': ','
};
let isShifted = false;

let isEn = true;
let enToRu = {
  'q': 'й',
  'w': 'ц',
  'e': 'у',
  'r': 'к',
  't': 'е',
  'y': 'н',
  'u': 'г',
  'i': 'ш',
  'o': 'щ',
  'p': 'з',
  '[': 'х',
  ']': 'ъ',
  'a': 'ф',
  's': 'ы',
  'd': 'в',
  'f': 'а',
  'g': 'п',
  'h': 'р',
  'j': 'о',
  'k': 'л',
  'l': 'д',
  ';': 'ж',
  '\'': 'э',
  'z': 'я',
  'x': 'ч',
  'c': 'с',
  'v': 'м',
  'b': 'и',
  'n': 'т',
  'm': 'ь',
  ',': 'б',
  '.': 'ю',
  '?': '.'
};
/************************/

function createKeys() {
  const fragment = document.createDocumentFragment();
  const letters = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    'backspace',
    'br',
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    '[',
    ']',
    'br',
    'keyboard_capslock',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    ';',
    '\'',
    'keyboard_return',
    'br',
    'arrow_upward',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
    ',',
    '.',
    '?',
    'br',
    'check_circle',
    'en',
    'space_bar',
    'keyboard_arrow_left',
    'keyboard_arrow_right'
  ];
  
  letters.forEach((letter) => {
    let btn;
    
    if (letter !== 'br')
    {
      btn = document.createElement('div');
      btn.classList.add('keyboard__key');
      btn.addEventListener('click', () => caretPosition = textArea.selectionStart);
      
      if (letter.length === 1) // for regular keys
      {
        btn.textContent = letter;
        btn.addEventListener('click', function() {
          textArea.value = textArea.value.slice(0, textArea.selectionStart) + this.textContent + textArea.value.slice(textArea.selectionStart);
          caretPosition++;
        });
        buttons.push({btn, value: btn.textContent});
      }
      else // for command keys
      {
        btn.classList.add('keyboard__key--large');
        const span = document.createElement('span');
        span.textContent = letter;
        span.classList.add('material-icons');
        btn.appendChild(span);
        
        // Switch for command keys
        switch (letter)
        {
          case 'backspace':
          {
            btn.addEventListener('click', () => {
              if (caretPosition !== 0)
              {
                textArea.value = textArea.value.slice(0, textArea.selectionStart - 1) + textArea.value.slice(textArea.selectionStart);
                caretPosition--;
              }
            });
            break;
          }
          case 'keyboard_capslock':
          {
            btn.classList.add('keyboard__key--toggle');
            btn.addEventListener('click', toggleCaps);
            break;
          }
          case 'space_bar':
          {
            btn.classList.add('keyboard__key--space');
            btn.addEventListener('click', () => {
              textArea.value = textArea.value.slice(0, textArea.selectionStart) + ' ' + textArea.value.slice(textArea.selectionStart);
              caretPosition++;
            });
            break;
          }
          case 'keyboard_return':
          {
            btn.addEventListener('click', () => {
              textArea.value = textArea.value.slice(0, textArea.selectionStart) + '\n' + textArea.value.slice(textArea.selectionStart);
              caretPosition++;
            });
            break;
          }
          case 'check_circle':
          {
            btn.classList.add('keyboard__key--dark')
            btn.addEventListener('click', hideKbd);
            break;
          }
          case 'arrow_upward':
          {
            btn.classList.add('keyboard__key--toggle');
            btn.addEventListener('click', toggleShift);
            break;
          }
          case 'keyboard_arrow_left':
          {
            btn.classList.remove('keyboard__key--large');
            btn.addEventListener('click', () => {
              if (caretPosition !== 0)
              {
                textArea.selectionStart = textArea.selectionEnd = --caretPosition;
              }
            });
            break;
          }
          case 'keyboard_arrow_right':
          {
            btn.classList.remove('keyboard__key--large');
            btn.addEventListener('click', () => {
              if (caretPosition !== textArea.value.length)
              {
                textArea.selectionStart = textArea.selectionEnd = ++caretPosition;
              }
            });
            break;
          }
          case 'en':
          {
            span.classList.remove('material-icons');
            btn.addEventListener('click', () => {
              if (btn.textContent == 'en')
              {
                isEn = false;
                btn.textContent = 'ru';
                buttons.forEach(({btn, value}) => {
                  // Don't change the keycap value if it's a number
                  if (/\d/.test(btn.textContent)) return;
                  
                  btn.textContent = shiftsRu[value] || enToRu[value];
                  if (isCapital && !isShifted || !isCapital && isShifted) btn.textContent = btn.textContent.toUpperCase();
                });
              }
              else
              {
                isEn = true;
                btn.textContent = 'en';
                buttons.forEach(({btn, value}) => {
                  // Don't change the keycap value if it's a number
                  if (/\d/.test(btn.textContent)) return;
                  
                  btn.textContent = shiftsEn[value] || value;
                  if (isCapital && !isShifted || !isCapital && isShifted) btn.textContent = btn.textContent.toUpperCase();
                });
              }
            });
            break;
          }
        }
      }
    }
    else
    {
      btn = document.createElement('br');
    }
    
    btn.addEventListener('click', () => {
      textArea.focus();
      textArea.selectionStart = textArea.selectionEnd = caretPosition;
      
      // btn.style.backgroundColor = '#FFFA';
      // btn.style.transform = 'scale(.93)';
      // setTimeout(() => {
      //   btn.style.backgroundColor = '#FFF5';
      //   btn.style.transform = '';
      // }, 200);
    });
    
    fragment.appendChild(btn);
  });
  
  return fragment;
}

// Changes layout based on SHIFT button
function toggleCaps()
{
  if (this.classList.toggle('keyboard__key--active'))
  {
    isCapital = true;
    if (isShifted)
    {
      buttons.forEach(({btn}) => btn.textContent = btn.textContent.toLowerCase());
    }
    else
    {
      buttons.forEach(({btn}) => btn.textContent = btn.textContent.toUpperCase());
    }
  }
  else
  {
    isCapital = false;
    if (isShifted)
    {
      buttons.forEach(({btn}) => btn.textContent = btn.textContent.toUpperCase());
    }
    else
    {
      buttons.forEach(({btn}) => btn.textContent = btn.textContent.toLowerCase());
    }
  }
}

function toggleShift()
{
  if (this.classList.toggle('keyboard__key--active'))
  {
    isShifted = true;
    buttons.forEach(({btn, value}) => {
      if (isEn) btn.textContent = shiftsEn[value] || value;
      else btn.textContent = shiftsRu[enToRu[value]] || shiftsRu[value] || enToRu[value];
      
      if (!isCapital) btn.textContent = btn.textContent.toUpperCase();
    });
  }
  else
  {
    isShifted = false;
    buttons.forEach(({btn, value}) => {
      if (isEn) btn.textContent = value;
      else btn.textContent = enToRu[value] || value;
      
      if (isCapital) btn.textContent = btn.textContent.toUpperCase();
    });
  }
}

function showKbd()
{
  keyboard.classList.remove('keyboard--hidden');
}

function hideKbd() {
  keyboard.classList.add('keyboard--hidden');
}

/**** KEYBOARD GENERATION ****/
const fragment = document.createDocumentFragment();

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
keyboard.classList.add('keyboard--hidden');

const keys = document.createElement('div');
keys.classList.add('keyboard__keys');

keys.appendChild(createKeys());
keyboard.appendChild(keys);
document.body.appendChild(keyboard);

document.getElementsByClassName('text-input')[0].addEventListener('click', showKbd);
/*****************************/

document.addEventListener('keydown', logKey);
document.addEventListener('keyup', e => {
  let letter = e.code[3].toLowerCase();
  buttons.find(({value}) => value === letter).btn.classList.remove('keyboard__key--pressed');
  e.isDown = false;
});

function logKey(e) {
  showKbd();
  if (e.code.startsWith('Key'))
  {
    e.preventDefault();
    let letter = e.code[3].toLowerCase();
    if (!e.isDown)
    {
      e.isDown = true;
      buttons.find(({value}) => value === letter).btn.classList.add('keyboard__key--pressed');
    }
    buttons.find(({value}) => value === letter).btn.click();
  }
}