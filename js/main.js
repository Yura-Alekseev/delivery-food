const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

/*-----------------------------------*/


const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');



let login = localStorage.getItem('userName');

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function authorized() {
  function logOut() {
    login = null; 
    localStorage.removeItem('userName');

    userName.style.display = '';
    buttonOut.style.display = '';
    buttonAuth.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'flex';
  buttonOut.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}


function notAuthorized() {
   function logIn(event) {
      event.preventDefault();
       if (logInInput.value === '') {
           alert('Введите Ваш логин');
       } else {
           login = logInInput.value;
           localStorage.setItem('userName', login);
           toggleModalAuth();
           logInForm.reset();
       }
       buttonAuth.removeEventListener('click', toggleModalAuth);
       closeAuth.removeEventListener('click', toggleModalAuth);
       logInForm.removeEventListener('submit', logIn);
       checkAuth();
   }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);

  logInForm.addEventListener('submit', logIn)
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();
