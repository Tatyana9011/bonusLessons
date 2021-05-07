// eslint-disable-next-line strict
'use strict';
const cartsDiv = document.querySelector('.carts'),
  navigationLink = document.querySelectorAll('.navigation-link'),
  inputAll = document.querySelector('input');

const checkData = () => {
  const data = [];
  return async () => {
    if (data.length) {
      return data;
    }
    const response = await fetch('./../dbHeroes/dbHeroes.json');
    if (response.status !== 200) {
      throw new Error('status network not 200');
    }
    data.push(...(await response.json()));
    return data;
  };
};

const getData = checkData();

class Cart {
  constructor() {
    this.cartActor = [];
  }
  createCartActor({ name, citizenship, birthDay, deathDay, status, actors, photo, movies, gender }) {
    const divInfo = document.createElement('div');
    divInfo.classList.add('cart-actors');
    divInfo.classList.add('col-lg-2');
    divInfo.innerHTML = `
        <img src= './dbHeroes/${photo.replace(/\/$/, '')}'alt="${name}" class="img-actor" ></img>
            <ul class="navigation justify-content-around">
              <li class="navigation-item">
                <p class="info-actors-link" data-field="gender"><span>Character's name:</span> ${name}</p>
              </li>
              <li class="navigation-item">
                <p class="info-actors-link" data-field="category"><span>Actor's name:</span> ${actors}</p>
              </li>
              <li class="navigation-item">
                <p class="info-actors-link" data-field="category"><span>Movies:</span>${movies ? movies : '-'}</p>
              </li>
              <li class="navigation-item">
                <p  class="info-actors-link" data-field="category">
                <span>Birth-day:</span> ${birthDay ? birthDay : '-'} <span>Death-day: 
                </span>${deathDay ? deathDay : '-'} </p>
              </li>
              <li class="navigation-item">
                <p class="info-actors-link"><span>Citizenship:</span> ${citizenship ? citizenship : '-'}</p>
              </li>
              <li class="navigation-item">
                <p  class="info-actors-link"><span>Gender:</span> ${gender}</p>
              </li>
              <li class="navigation-item">
                <p  class="info-actors-link"><span>Status:</span> ${status}</p>
              </li>
            </ul>`;
    return divInfo;
  }
  renderCart(data) {
    cartsDiv.textContent = '';
    this.cartActor = data.map(this.createCartActor);
    cartsDiv.append(...this.cartActor);
  }
  filterCart(field, value) {
    return data => data.filter(actor => actor[field] === value);
  }
}

const cart = new Cart();

const modal = () => {
  const modalElem = document.querySelector('.modal'),
    imgActor = document.querySelectorAll('.img-actor'),
    overlayElem = document.querySelector('.overlay'),
    closeElem = document.querySelector('.modal-close__btn'),
    formAvatar = document.querySelector('.form__avatar');

  imgActor.forEach(item => {
    item.addEventListener('click', () => {
      modalElem.style.display = 'block';
      formAvatar.src = item.src;
    });
  });
  const closeModal = (elem, event) => {
    const target = event.target;
    if (target === elem) {
      modalElem.style.display = 'none';
    }
  };
  closeElem.addEventListener('click', closeModal.bind(null, closeElem));
  overlayElem.addEventListener('click', closeModal.bind(null, overlayElem));

};

getData()
  .then(cart.renderCart.bind(cart))
  .then(modal);

navigationLink.forEach(link => {
  link.addEventListener('change', event => {
    event.preventDefault();
    const target = event.target;
    if (target.matches('select')) {
      const field = target.dataset.field;
      const value = link.options[link.selectedIndex].value;

      if (field && value) {
        getData()
          .then(cart.filterCart(field, value))
          .then(cart.renderCart.bind(cart))
          .then(modal);
      }
    }
  });
});

inputAll.addEventListener('click', event => {
  event.preventDefault();
  getData()
    .then(cart.renderCart.bind(cart))
    .then(modal);
});
