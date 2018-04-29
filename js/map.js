'use strict'

// Data

var listingTitle = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде']
var listingType = ['palace', 'flat', 'house', 'bungalo']
var listingTime = ['12:00', '13:00', '14:00']
var listingFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
var listingPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']

// Elements

var map = document.querySelector('.map')
var mainPin = document.querySelector('.map__pin--main')
var adForm = document.querySelector('.ad-form')
var adFormFieldset = adForm.querySelectorAll('fieldset')
var fieldsetAddress = adForm.querySelector('#address')
var pinList = document.querySelector('.map__pins')
var pinTemplate = pinList.querySelector('.map__pin')
var pinImage = pinTemplate.querySelector('img')
var cardTemplate = document.querySelector('template').content.querySelector('.map__card')
var filtersContainer = document.querySelector('.map__filters-container')

// Helper functions

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  };

  return array
}

var getRandomValue = function (array) {
  return array[getRandomNumber(0, array.length - 1)]
}

var getArrayOfRandomLength = function (initialArray) {
  var newArray = []

  for (var i = 0; i < getRandomValue(0, initialArray.length); i++) {
    var randomValue = initialArray[getRandomNumber(0, initialArray.length - 1)]
    newArray.push(randomValue)
  }

  return newArray
}

// Main functions

var generateSimilarListings = function () {
  var similarListings = []

  for (var i = 0; i < 8; i++) {
    var x = getRandomNumber(300, 900)
    var y = getRandomNumber(150, 500)

    var listing = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },

      'offer': {
        'title': getRandomValue(listingTitle),
        'address': x + ', ' + y,
        'price': getRandomNumber(1000, 1000000),
        'type': getRandomValue(listingType),
        'rooms': getRandomNumber(1, 5),
        'guests': getRandomNumber(0, 3),
        'checkin': getRandomValue(listingTime),
        'checkout': getRandomValue(listingTime),
        'features': getArrayOfRandomLength(listingFeatures),
        'description': '',
        'photos': shuffleArray(listingPhotos)
      },

      'location': {
        'x': x,
        'y': y
      }
    }

    similarListings.push(listing)
  };

  return similarListings
}

var createPins = function (pin) {
  var element = pinTemplate.cloneNode(true)
  var elementImage = element.querySelector('img')

  element.style.left = (pin.location.x - pinImage.width / 2) + 'px'
  element.style.top = (pin.location.y - pinImage.height) + 'px'
  elementImage.src = pin.author.avatar
  elementImage.alt = pin.offer.title

  return element
}

var renderPins = function () {
  var listings = generateSimilarListings()
  var fragment = document.createDocumentFragment()
  for (var i = 0; i < listings.length; i++) {
    var pin = createPins(listings[i])
    pin.dataset.index = i
    fragment.appendChild(pin)
  }

  pinList.appendChild(fragment)

  var pins = pinList.querySelectorAll('.map__pin')
  var cardGenerated = generateCard()

  for (i = 1; i < pins.length; i++) {
    var createEventListener = function (x) {
      pins[i].addEventListener('click', function () {
        var card = generateCardData(cardGenerated, listings[pins[x].dataset.index])
      })
    }

    createEventListener(i)
  }
}

var generateCard = function (place) {
  var card = cardTemplate.cloneNode(true)

  document.querySelector('.map').insertBefore(card, filtersContainer)

  return card
}

var generateCardData = function (card, place) {
  card.querySelector('.popup__title').textContent = place.offer.title
  card.querySelector('.popup__text--address').textContent = place.location.x + ', ' + place.location.y
  card.querySelector('.popup__text--price').textContent = place.offer.price + '₽/ночь'

  if (place.offer.type === 'flat') {
    card.querySelector('.popup__type').textContent = 'Квартира'
  } else if (place.offer.type === 'house') {
    card.querySelector('.popup__type').textContent = 'Дом'
  } else if (place.offer.type === 'palace') {
    card.querySelector('.popup__type').textContent = 'Дворец'
  }

  card.querySelector('.popup__text--capacity').textContent = place.offer.rooms + ' комнаты для ' + place.offer.guests + ' гостей'
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + place.offer.checkin + ', выезд до ' + place.offer.checkout
  for (var i = 0; i < listingFeatures.length; i++) {
    card.querySelector('.popup__feature').textContent = listingFeatures[i]
  }
  card.querySelector('.popup__description').textContent = place.offer.description
  var fragment = document.createDocumentFragment()
  for (i = 0; i < place.offer.photos.length; i++) {
    var cardPhoto = card.querySelector('.popup__photo').cloneNode()
    cardPhoto.src = place.offer.photos[i]
    fragment.appendChild(cardPhoto)
  }
  card.querySelector('.popup__photos').appendChild(fragment)
  card.querySelector('.popup__photo').remove()
  card.querySelector('.popup__avatar').src = place.author.avatar
}

// Event listeners

var activateForm = function () {
  map.classList.remove('map--faded')
  adForm.classList.remove('ad-form--disabled')
  adFormFieldset.forEach(function (element) {
    element.removeAttribute('disabled')
  })
}

var defineAddressUnactivated = function () {
  var xInitial = parseInt(mainPin.style.left, 10)
  var yInitial = parseInt(mainPin.style.top, 10)
  fieldsetAddress.value = xInitial + ', ' + yInitial
}

var defineAddressActivated = function () {
  var xAfterDragged = parseInt(pinTemplate.style.left, 10) + pinImage.width / 2
  var yAfterDragged = parseInt(pinTemplate.style.top, 10) - pinImage.height
  fieldsetAddress.value = xAfterDragged + ', ' + yAfterDragged
}

var activatePage = function () {
  activateForm()
  defineAddressActivated()
  renderPins()
  mainPin.removeEventListener('mouseup', activatePage)
}

// Execution
defineAddressUnactivated()
mainPin.addEventListener('mouseup', activatePage)
