const textArea = document.getElementsByClassName('text-input')[0];
let capslockable = []; // For CAPSLOCKable buttons
let caretPosition = 0;

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
      btn.classList.add('keyboard__key');
      btn.addEventListener('click', () => caretPosition = textArea.selectionStart);
      
      if (letter.length === 1) // for regular keys
      {
        btn.textContent = letter;
        btn.addEventListener('click', function() {
          textArea.value = textArea.value.slice(0, textArea.selectionStart) + this.textContent + textArea.value.slice(textArea.selectionStart);
          caretPosition++;
        });
        // Add to CAPSLOCKable list if the letter is really a letter
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
            btn.addEventListener('click', hideKbd);
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
    });
    
    fragment.appendChild(btn);
  });
  
  return fragment;
}

function toggleCaps()
{
  if (this.classList.toggle('keyboard__key--active')) 
  {
    for (let btn of capslockable) btn.textContent = btn.textContent.toUpperCase();
  }
  else
  {
    for (let btn of capslockable) btn.textContent = btn.textContent.toLowerCase();
  }
}

function showKbd()
{
  keyboard.classList.remove('keyboard--hidden');
}

function hideKbd() {
  keyboard.classList.add('keyboard--hidden');
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

document.getElementsByClassName('text-input')[0].addEventListener('click', showKbd);