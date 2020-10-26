const joinBtn=document.querySelector('#join');
const createBtn=document.querySelector('#create');

const form=document.querySelector('#lobby-form');
const backBtn=form.querySelector('#back');

const showForm=function(){
    if(form.classList.contains('hidden')){
        form.classList.remove('hidden');
        form.classList.add('visible');
    }
}

const hideForm=function(){
    if(form.classList.contains('visible')){
        form.classList.remove('visible');
        form.classList.add('hidden');
    }
}

joinBtn.addEventListener('click',showForm);
createBtn.addEventListener('click',showForm);

backBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    hideForm()});