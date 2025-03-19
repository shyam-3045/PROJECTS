'use strict';

const score0EL = document.getElementById('score--0');
const score1EL = document.querySelector('#score--1');
const dice = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');

const current0EL = document.getElementById('current--0');
const current1EL = document.getElementById('current--1');

let score = [0, 0];
let activePlayer = 0;
let currentScore1 = 0;
score0EL.textContent = 0;
score1EL.textContent = 0;
dice.classList.add('hidden');

btnRoll.addEventListener('click', () => {
  const diceNo = Math.trunc(Math.random() * 6) + 1;
  dice.classList.remove('hidden');
  dice.src = `dice-${diceNo}.png`;

  if (diceNo !== 1) {
    currentScore1 += diceNo;
    document.getElementById(`current--${activePlayer}`).textContent =
      currentScore1;
  } else {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    currentScore1 = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    player0.classList.toggle('player--active');
    player1.classList.toggle('player--active');
  }
});

btnHold.addEventListener('click', () => {
  if (activePlayer === 0) {
    document.getElementById('current--0').textContent = 0;
    score[0] += currentScore1;
    score0EL.textContent = score[0];
    currentScore1 = 0;
    activePlayer = 1;
    player0.classList.remove('player--active');
    player1.classList.add('player--active');
  } else {
    document.getElementById('current--1').textContent = 0;
    score[1] += currentScore1;
    score1EL.textContent = score[1];
    currentScore1 = 0;
    activePlayer = 0;
    player1.classList.remove('player--active');
    player0.classList.add('player--active');
  }
});

btnNew.addEventListener('click', () => {
  activePlayer = 0;
  document.getElementById('current--0').textContent = 0;
  document.getElementById('current--1').textContent = 0;
  score0EL.textContent = 0;
  score1EL.textContent = 0;
  dice.classList.add('hidden');
  currentScore1=0;
  score=[0,0];
});
