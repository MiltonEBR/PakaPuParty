const joinBtn=document.querySelector('#join');
const createBtn=document.querySelector('#create');

const form=document.querySelector('#lobby-form');
const backBtn=form.querySelector('#back');

const playerInput=document.querySelector('#players');
const roomInput=document.querySelector('#room');
const passInput=document.querySelector('#password');

const joinForm=function(){

    if(form.classList.contains('hidden')){
        form.classList.remove('hidden');
        form.classList.add('visible');
    }

    if(roomInput.classList.contains('disabled')){
        roomInput.classList.remove('disabled');
    }

    if(!playerInput.classList.contains('disabled')){
        playerInput.classList.add('disabled');
    }
}

const createForm=function(){
    if(form.classList.contains('hidden')){
        form.classList.remove('hidden');
        form.classList.add('visible');
    }

    if(!roomInput.classList.contains('disabled')){
        roomInput.classList.add('disabled');
    }

    if(playerInput.classList.contains('disabled')){
        playerInput.classList.remove('disabled');
    }
}

const hideForm=function(){
    if(form.classList.contains('visible')){
        form.classList.remove('visible');
        form.classList.add('hidden');
    }
}

joinBtn.addEventListener('click',joinForm);
createBtn.addEventListener('click',createForm);

backBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    roomInput.value='';
    passInput.value='';
    hideForm()});