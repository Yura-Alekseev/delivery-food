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
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');
const inputSearch = document.querySelector('.input-search');

let login = localStorage.getItem('userName');

let cart = [];

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
    localStorage.removeItem('cart');

    userName.style.display = '';
    buttonOut.style.display = '';
    buttonAuth.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'flex';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
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
                data-products="${products}" 
                data-attr="${[name, stars, price, kitchen]}"
                >
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
                <button class="button button-primary button-add-cart" id="${id}">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price card-price-bold">${price} ₽</strong>
            </div>
    `);

    cardsMenu.insertAdjacentElement("beforeend", card);
}

function createRestaurantHeading(attr) {

    const [
        name,
        stars,
        price,
        kitchen
    ] = attr;

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
            createRestaurantHeading(restaurant.dataset.attr.split(','));
            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardGood);
            });
        }
    }
}

function addToCart(event) {
    const target = event.target;
    const buttonAddToCart = target.closest('.button-add-cart');

    if (buttonAddToCart) {
        const card = target.closest('.card');

        const title = card.querySelector('.card-title').textContent;
        const cost = card.querySelector('.card-price').textContent;
        const id = buttonAddToCart.id;

        const food = cart.find(function (item) {
            return item.id === id;
        });

        if (food) {
            food.count++;
        } else {
            cart.push({
                title,
                cost,
                id,
                count: 1
            });
        }
    }
    setCart(cart);
}

function setCart(item) {
    localStorage.setItem('cart', JSON.stringify(item));
}

function renderCart() {
    if (localStorage.getItem('cart') !== null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    } else {
        cart = [];
    }

    modalBody.textContent = '';
    cart.forEach(function (item) {

        const {
            id,
            title,
            cost,
            count
        } = item;

        const itemCart = `
        <div class="food-row">
            <span class="food-name">${title}</span>
            <strong class="food-price">${cost}</strong>
            <div class="food-counter">
                <button class="counter-button counter-minus" data-id="${id}">-</button>
                <span class="counter">${count}</span>
                <button class="counter-button counter-plus" data-id="${id}">+</button>
            </div>
        </div>
        `;

        modalBody.insertAdjacentHTML('afterbegin', itemCart);
    });

    const totalPrice = cart.reduce(function (result, item) {
        return result + (parseFloat(item.cost) * item.count);

    }, 0);

    modalPrice.textContent = totalPrice + ' ₽';
    setCart(cart)
}

function changeCount(event) {
    const target = event.target;

    if (target.classList.contains('counter-button')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });

        if (target.classList.contains('counter-minus')) {
            food.count--;
            if (food.count === 0) {
                cart.splice(cart.indexOf(food), 1)
            }
        }

        if (target.classList.contains('counter-plus')) {
            food.count++;
        }
        setCart(cart);
        renderCart();
    }
}

function init() {
    getData('./db/partners.json').then((data) => {
        data.forEach(createCardRestaurant)
    });

    cardsRestaurants.addEventListener('click', openGoods);

    cartButton.addEventListener("click", function () {
        renderCart();
        toggleModal();
    });

    buttonClearCart.addEventListener('click', function () {
        cart.length = 0;
        setCart(cart);
        renderCart();
    });

    modalBody.addEventListener('click', changeCount);

    cardsMenu.addEventListener('click', addToCart);

    close.addEventListener("click", toggleModal);

    logo.addEventListener('click', returnMain);

    inputSearch.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            const target = event.target;
            const value = target.value.toLowerCase().trim();
            target.value= '';
            if (!value || value.length < 2) {
                target.style.backgroundColor = 'tomato';
                setTimeout(function () {
                    target.style.backgroundColor = '';
                },2000);
                return;
            }

            const goods = [];

            getData('./db/partners.json')
                .then(function (data) {
                    const products = data.map(function (item) {
                        return item.products;
                    });
                    console.log(products);

                    products.forEach(function (product) {
                        getData(`./db/${product}`)
                            .then(function (data) {
                                goods.push(...data);
                                const searchGoods = goods.filter(function (item) {
                                    return  item.name.toLowerCase().includes(value);
                                });

                                cardsMenu.textContent = '';

                                containerPromo.classList.add('hide');
                                restaurants.classList.add('hide');
                                menu.classList.remove('hide');

                                restaurantHeading.textContent = '';

                                const heading = `
			                            <h2 class="section-title restaurant-title">Результат поиска</h2>`;

                                restaurantHeading.insertAdjacentHTML("beforeend", heading);

                                return searchGoods;
                            })
                            .then(function (data) {
                                data.forEach(createCardGood);
                            })
                    })
                });

        }
    });

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
