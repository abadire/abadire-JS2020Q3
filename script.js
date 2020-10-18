const textArea = document.getElementsByClassName('text-input')[0];
let capslockable = []; // For CAPSLOCKable buttons

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
    'keyboard_return',
    'br',
    'check_circle',
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
    'space_bar'
  ];
  
  letters.forEach((letter) => {
    let btn;
    
    if (letter !== 'br')
    {
      btn = document.createElement('div');
      btn.classList.add('keyboard__key')
      
      if (letter.length === 1) // for regular keys
      {
        btn.textContent = letter;
        btn.addEventListener('click', function() {
          textArea.value += this.textContent;
        });
        if (/[a-zA-Z]/.test(letter)) capslockable.push(btn);
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
              textArea.value = textArea.value.slice(0, -1); 
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
              btn.addEventListener('click', () => {
                textArea.value += ' ';
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
    
    fragment.appendChild(btn);
  });
  
  fragment.lastElementChild.classList.add('keyboard__key--space');
  
  return fragment;
}

function toggleCaps() {
    if (this.classList.toggle('keyboard__key--active')) 
    {
     for (let btn of capslockable) btn.textContent = btn.textContent.toUpperCase();
    }
    else
    {
      for (let btn of capslockable) btn.textContent = btn.textContent.toLowerCase();
    }
}

function showKbd() {
  keyboard.classList.remove('keyboard--hidden');
}

const fragment = document.createDocumentFragment();

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
keyboard.classList.add('keyboard--hidden');

const keys = document.createElement('div');
keys.classList.add('keyboard__keys');

keys.appendChild(createKeys());
keyboard.appendChild(keys);
document.body.appendChild(keyboard);

document.getElementsByClassName('text-input')[0].addEventListener('focus', () => {
  showKbd();
});