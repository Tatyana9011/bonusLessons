// eslint-disable-next-line strict
'use strict';
const dropdownListsListDefault = document.querySelector('.dropdown-lists__list--default'),
  dropdownListsListSelect = document.querySelector('.dropdown-lists__list--select'),
  dropdownListsListAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
  selectCities = document.getElementById('select-cities'),
  button = document.querySelector('.button'),
  closeButton = document.querySelector('.close-button');
dropdownListsListDefault.style.display = 'none';
button.setAttribute("disabled", true);

const classNameCountry = ['total-line', 'country'];
const classNameCity = ['line', 'city'];
const citiesList = [];
const countryList = [];

const checkData = async () => {
  const response = await fetch('./db_cities.json');
  if (response.status !== 200) {
    throw new Error('status network not 200');
  }
  return response.json();
};

const getData = data => {
  const citiesListStart = [];
  data['RU'].forEach(item => {
    citiesListStart.push(item.cities);
    countryList.push([item.country, item.count, item.cities]);
  });

  for (let i = 0; i < citiesListStart.length; i++) {
    citiesListStart[i].forEach(item => {
      citiesList.push([item.name, item.count, item.link]);
    });
  }
};

class Cities {
  defaultListContent() {
    dropdownListsListDefault.textContent = '';
    const element = new Map();
    element.clear();
    for (let i = 0; i < countryList.length; i++) {
      const countFist = countryList[i][0];
      const countSecond = countryList[i][1];
      element.set(countFist, this.createCountryList(countFist, countSecond, classNameCountry));
      for (let j = 0; j < 3; j++) {
        const cityFist = countryList[i][2][j].name;
        const citySecond = countryList[i][2][j].count;
        const cityLink = countryList[i][2][j].link;
        element.set(cityFist, this.createCountryList(cityFist, citySecond, classNameCity, cityLink));
      }
    }
    element.forEach(item => {
      const country = document.createElement('div');
      country.className = "dropdown-lists__col";
      country.innerHTML = `<div class="dropdown-lists__countryBlock">
      ${item.outerHTML}
      </div>`;
      dropdownListsListDefault.append(country);
    });
  }

  selectListContent(event) {
    const target = event.target;
    const value = target.textContent;
    const element2 = new Map();
    element2.clear();
    dropdownListsListSelect.textContent = '';

    for (let elem in countryList) {
      if (countryList[elem][0] === value) {
        element2.set(countryList[elem][0],
          this.createCountryList(countryList[elem][0], countryList[elem][1], classNameCountry));
        countryList[elem][2].forEach(item => {
          element2.set(item.name, this.createCountryList(item.name, item.count, classNameCity, item.link));
        });
      }
    }

    element2.forEach(item => {
      const country = document.createElement('div');
      country.innerHTML = '';
      country.className = "dropdown-lists__col";
      country.innerHTML = `<div class="dropdown-lists__countryBlock">
        ${item.outerHTML}
        </div>`;
      dropdownListsListSelect.append(country);
    });
  }

  selectAutocomplete(event) {
    dropdownListsListAutocomplete.textContent = '';
    const element2 = new Map();
    const element = [];
    const regX = new RegExp("^" + event.target.value.toLowerCase() + ".*");

    for (let i = 0; i < citiesList.length; i++) {
      element.push([citiesList[i][0], citiesList[i][1], citiesList[i][2]]);
    }

    let result = '';
    result = element.filter(elem => elem[0].toLowerCase().match(regX));
    if (result.length) {
      result.forEach(item => {
        element2.set(item[0], this.createCountryList(item[0], item[1], classNameCity, item[2]));
      });
    } else {
      element2.set('zero-key', this.createCountryList(`${event.target.value} в списке не найдено`, ' ', classNameCity));
    }

    element2.forEach(item => {
      const country = document.createElement('div');
      country.innerHTML = '';
      country.className = "dropdown-lists__col";
      country.innerHTML = `<div class="dropdown-lists__countryBlock">
        ${item.outerHTML}
        </div>`;
      dropdownListsListAutocomplete.append(country);
    });
  }

  createCountryList(countFist, countSecond, className, url) {
    const element = document.createElement('div');
    element.className = `dropdown-lists__${className[0]}`;
    element.dataset.url = `${url ? url : ''}`;
    element.innerHTML = `
        <div class="dropdown-lists__${className[1]}">${countFist}</div>
        <div class="dropdown-lists__count">${countSecond}</div>
      `;
    return element;
  }
}

const cities = new Cities();
checkData().then(getData).then(cities);

const cityResult = select => {
  //кликаем на город
  const dropdownListLine = select.querySelectorAll('.dropdown-lists__line');

  dropdownListLine.forEach(elem => {
    elem.addEventListener('click', event => {
      closeButton.style.display = 'block';
      const target = event.target;
      selectCities.focus();
      selectCities.value = target.textContent;
      const url = elem.dataset.url;
      button.href = url;
      button.removeAttribute("disabled");
    });
  });
};

const recursDefault = () => {
  //кликаем на страну и вернутся к главному списку
  const dropdownListsTotalLineSelect = dropdownListsListSelect.querySelectorAll('.dropdown-lists__total-line');

  dropdownListsTotalLineSelect.forEach(item => {
    item.addEventListener('click', () => {
      closeButton.style.display = 'block';
      cities.defaultListContent();
      startClickSelect();
      dropdownListsListDefault.style.display = 'block';
      dropdownListsListSelect.style.display = 'none';
      dropdownListsListAutocomplete.style.display = 'none';
    });
  });
  cityResult(dropdownListsListSelect);
};

const startClickSelect = () => {
  //кликаем на страну в списке дефолт
  const dropdownListTotalLine = document.querySelectorAll('.dropdown-lists__total-line');
  dropdownListTotalLine.forEach(elem => {
    elem.addEventListener('click', event => {
      closeButton.style.display = 'block';
      cities.selectListContent(event);
      recursDefault();
      dropdownListsListDefault.style.display = 'none';
      dropdownListsListSelect.style.display = 'block';
      dropdownListsListAutocomplete.style.display = 'none';
    });
  });
  cityResult(document);
};

const startClickInput = () => {
  //кликаем на импут
  selectCities.addEventListener('click', event => {
    let target = event.target;
    target = target.closest('#select-cities');
    cities.defaultListContent();
    startClickSelect();


    if (target || target.value === '' && dropdownListsListAutocomplete.innerHTML === '') {
      dropdownListsListAutocomplete.style.display = 'none';
      dropdownListsListDefault.style.display = 'block';
      dropdownListsListSelect.style.display = 'none';
    } else {
      dropdownListsListSelect.style.display = 'none';
      dropdownListsListAutocomplete.style.display = 'none';
    }

    //вводим велуе высвечивается список городов
    selectCities.addEventListener('input', () => {
      selectCities.focus();
      cities.selectAutocomplete(event);
      if (selectCities.value === '') {
        dropdownListsListAutocomplete.style.display = 'none';
        dropdownListsListDefault.style.display = 'block';
        return;
      }
      dropdownListsListAutocomplete.style.display = 'block';
      dropdownListsListDefault.style.display = 'none';
      dropdownListsListSelect.style.display = 'none';
      cityResult(dropdownListsListAutocomplete);
    });
  });
};

button.addEventListener('click', () => {
  button.setAttribute("disabled", true);
  selectCities.value = '';
});

closeButton.addEventListener('click', () => {
  button.setAttribute("disabled", true);
  dropdownListsListAutocomplete.style.display = 'none';
  dropdownListsListDefault.style.display = 'none';
  dropdownListsListSelect.style.display = 'none';
  selectCities.value = '';
});

startClickInput();



