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
const restaurantHeading = menu.querySelector('.section-heading');

let login = localStorage.getItem('userName');

const getData = async function(url) {

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
    }

    return await response.json();
};

const valid = function(str) {
    const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/
    return nameReg.test(str);
};

function toggleModal() {
    modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function returnMain() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
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
    returnMain();
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
       if (valid(logInInput.value.trim())) {
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

function createCardRestaurant(restaurant) {

    const {
        image,
        name,
        time_of_delivery: timeOfDelivery,
        stars,
        price,
        kitchen,
        products
    } = restaurant;

    const card = `
                <a class="card card-restaurant" 
                data-products="${products}" data-name="${name}" data-stars="${stars}" data-price="${price}" data-kitchen="${kitchen}">
                    <img src="${image}" alt="image" class="card-image">
                    <div class="card-text">
                        <div class="card-heading">
                            <h3 class="card-title">${name}</h3>
                            <span class="card-tag tag">${timeOfDelivery} мин</span>
                        </div>

                        <div class="card-info">
                            <div class="rating">${stars}</div>
                            <div class="price">От ${price} ₽</div>
                            <div class="category">${kitchen}</div>
                        </div>
                    </div>
               </a>
    `;

    cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood(goods) {

    const {
        id,
        description,
        image,
        name,
        price
    } = goods;

    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML("beforeend", `
            <img src="${image}" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>

            <div class="card-info">
                <div class="ingredients">${description}
                </div>
            </div>

            <div class="card-buttons">
                <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price-bold">${price} ₽</strong>
            </div>
    `);

    cardsMenu.insertAdjacentElement("beforeend", card);
}

function createRestaurantHeading(name, stars, price, kitchen) {

    restaurantHeading.textContent = '';

    const heading = `
			<h2 class="section-title restaurant-title">${name}</h2>
			<div class="card-info">
			<div class="rating">
				${stars}
		    </div>
			<div class="price">От ${price} ₽</div>
			<div class="category">${kitchen}</div>
    `;

    restaurantHeading.insertAdjacentHTML("beforeend", heading);
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
            createRestaurantHeading(restaurant.dataset.name, restaurant.dataset.stars, restaurant.dataset.price, restaurant.dataset.kitchen);
            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardGood);
            });
        }
    }
}

function init() {
    getData('./db/partners.json').then((data) => {
        data.forEach(createCardRestaurant)
    });

    cardsRestaurants.addEventListener('click', openGoods);

    cartButton.addEventListener("click", toggleModal);

    close.addEventListener("click", toggleModal);

    logo.addEventListener('click', returnMain);

    checkAuth();

    new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000
        },
        sliderPerView: 3
    });
}

init();
