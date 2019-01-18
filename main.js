let root = window.location.origin;
let otherPerson = null;

const options = {
  rock: '✊',
  paper: '✋',
  scissors: '✌',
};

function matchOutcome(optionA, optionB) {
  if (optionA === optionB) {
    return 'It\'s a tie!';
  }

  if (
    (optionA === 'rock' && optionB === 'scissors')
    || (optionA === 'paper' && optionB === 'rock')
    || (optionA === 'scissors' && optionB === 'paper')
  ) {
    return 'You won!';
  }

  return 'You loose...';
}

function onSubmit(option) {
  const result = document.getElementById('result');

  const text = document.createElement('div');

  if (otherPerson) {
    const otherPersonPick = atob(otherPerson);

    const outcome = matchOutcome(option, otherPersonPick);

    text.innerHTML = `
        <h2>${outcome}</h2>
        <p style="font-size: 2em">
            ${options[option]} VS ${options[otherPersonPick]}
        </p>
        
        <p><a href="?">Retry</a></p>
    `;
  } else {
    const encodedPick = btoa(option);
    text.innerText = `Share the following link with the one your challenge: ${root}?c=${encodedPick}`;
  }


  result.appendChild(text);
}

function createButton(value) {
  const button = document.createElement('button');

  button.addEventListener('click', () => onSubmit(value));

  button.innerText = options[value];
  button.value = value;
  button.style.fontSize = '3em';
  button.type = 'button';

  return button;
}

function createForm() {
  const form = document.createElement('form');

  const rock = createButton('rock');
  const paper = createButton('paper');
  const scissors = createButton('scissors');

  form.appendChild(rock);
  form.appendChild(paper);
  form.appendChild(scissors);

  return form;
}

function createIntro(text) {
  const intro = document.createElement('h1');
  intro.innerText = text;

  return intro;
}

function init() {
  const content = document.getElementById('content');

  const urlParams = new URLSearchParams(window.location.search);
  otherPerson = urlParams.get('c');

  if (otherPerson) {
    content.appendChild(createIntro('You got challenged to rock paper scissors! What do you pick?'));
  } else {
    content.appendChild(createIntro('Challenge someone to rock paper scissors! What do you pick?'));
  }

  const result = document.createElement('div');
  result.setAttribute('id', 'result');

  content.appendChild(createForm());
  content.appendChild(result);
}

init();
