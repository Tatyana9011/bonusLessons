// eslint-disable-next-line strict
'use strict';
const cartsDiv = document.querySelector('.carts'),
  navigationLink = document.querySelectorAll('.navigation-link');

const checkData = url => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.setRequestHeader('Content-type', 'application/json');

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      const response = JSON.parse(request.responseText);
      resolve(response);
    } else {
      reject(request.statusText);
    }
  });
  request.send();
});

const getData = checkData('./../dbHeroes/dbHeroes.json');

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

}

const cart = new Cart();
const filterCart = (field, value) => {
  getData
    .then(data => data.filter(actor => actor[field] === value))
    .then(cart.renderCart.bind(cart));
};

navigationLink.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    if (target.type.toLowerCase() !== 'button') {
      const field = target.dataset.field;
      const value = link.options[link.selectedIndex].value;

      if (field && value) {
        filterCart(field, value);
      } else {
        getData
          .then(cart.renderCart.bind(cart))
          .catch(error => console.log(error));
      }
    }
    getData
      .then(cart.renderCart.bind(cart))
      .catch(error => console.log(error));

  });
});

getData
  .then(cart.renderCart.bind(cart))
  .catch(error => console.log(error));



