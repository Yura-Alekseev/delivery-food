'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('userName');

function toggleModal() {
    modal.classList.toggle("is-open");
}

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
       if (logInInput.value.trim()) {
           login = logInInput.value;
           localStorage.setItem('userName', login);
           toggleModalAuth();
           buttonAuth.removeEventListener('click', toggleModalAuth);
           closeAuth.removeEventListener('click', toggleModalAuth);
           logInForm.removeEventListener('submit', logIn);
           checkAuth();
           logInForm.reset();
       } else {
           alert('Введите Ваш логин');
       }
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

function createCardRestaurant() {

    const card = `
                <a class="card card-restaurant">
                    <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image">
                    <div class="card-text">
                        <div class="card-heading">
                            <h3 class="card-title">Пицца плюс</h3>
                            <span class="card-tag tag">50 мин</span>
                        </div>

                        <div class="card-info">
                            <div class="rating">4.5</div>
                            <div class="price">От 900 ₽</div>
                            <div class="category">Пицца</div>
                        </div>
                    </div>
               </a>
    `;

    cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood() {
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML("beforeend", `
            <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                <h3 class="card-title card-title-reg">Пицца Везувий</h3>
            </div>

            <div class="card-info">
                <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец 
                    «Халапенье», соус «Тобаско», томаты.
                </div>
            </div>

            <div class="card-buttons">
                <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price-bold">545 ₽</strong>
            </div>
    `);

    cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
    if (!login) {
        toggleModalAuth();
    } else {
        const target = event.target;
        const restaurant = target.closest('.card-restaurant');

        if (restaurant) {
            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            createCardGood();
        }
    }
}



cardsRestaurants.addEventListener('click', openGoods);

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
});

checkAuth();
createCardRestaurant();
