 ' use strict';

const model = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModel = document.querySelector('.close-modal');
const btnOpenModel = document.querySelectorAll('.show-modal');

console.log(btnOpenModel)

const closeModel =()=>
{
  model.classList.add('hidden');
  overlay.classList.add('hidden');
}

const openModel =()=>
  {
    model.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

for(let i=0;i<btnOpenModel.length;i++)
{
  btnOpenModel[i].addEventListener('click',openModel);
}

btnCloseModel.addEventListener('click',closeModel)

overlay.addEventListener('click',closeModel)
document.addEventListener('keydown',(e)=>
{
  if(e.key === 'Escape' && !model.classList.contains('hidden')){
    closeModel();
  }
})