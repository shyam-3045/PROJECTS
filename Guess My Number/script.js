'use strict';

let randomNumber = Math.trunc(Math.random() *20) +1;
let score =20;
let highestScore =0;

document.querySelector('.check').addEventListener('click',()=>
{ 
  const guessNumber = Number(document.querySelector('.guess').value);

  if(! guessNumber){
    document.querySelector('.message').textContent ='No Number is Entered ';

  }else if(randomNumber === guessNumber){
    
    document.querySelector('.message').textContent ='Correct Answer ! ';
    document.querySelector('body').style.backgroundColor=' blue';
    document.querySelector('.number').style.width='30rem';
    document.querySelector('.number').textContent = randomNumber;

    if(score > highestScore){
      highestScore= score;
      document.querySelector('.highscore').textContent = highestScore;

    }
    


  }
  else if(randomNumber < guessNumber){
    if (score > 1){
      document.querySelector('.message').textContent ='Too high ';

      score --;
      document.querySelector('.score').textContent =score;

    }else{
      document.querySelector('.message').textContent ='You lost the game ! ';
      document.querySelector('.score').textContent =0;
    }
  }
  else if(randomNumber > guessNumber){
    if (score > 1){
      document.querySelector('.message').textContent ='Too low ';

      score --;
      document.querySelector('.score').textContent =score;

    }else{
      document.querySelector('.message').textContent ='You lost the game ! ';
      document.querySelector('.score').textContent =0;
    }}
}
)

document.querySelector('.again').addEventListener('click',()=>{
  document.querySelector('.message').textContent='Start guessing';
  score =20;
  document.querySelector('.score').textContent=score;
  randomNumber = Math.trunc(Math.random() *20) +1;
  document.querySelector('.number').textContent = randomNumber;
  document.querySelector('.guess').value='';
  document.querySelector('body').style.backgroundColor=' #222';
  document.querySelector('.number').style.width='15rem';
  document.querySelector('.number').textContent = '?';





})