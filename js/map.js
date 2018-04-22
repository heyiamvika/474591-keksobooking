'use strict'

// Data

var similarListings = []
var listingTitle = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде']
var listingType = ['palace', 'flat', 'house', 'bungalo']
var listingTime = ['12:00', '13:00', '14:00']
var listingFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
var listingPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']

// Elements

var map = document.querySelector('.map')
var pinList = document.querySelector('.map__pins')
var pinTemplate = document.querySelector('.map__pin')
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
  for (var i = 0; i < 8; i++) {
    var listing = {
      'author': {
        'avatar': 'img/avatars/user0' + getRandomNumber(1, 8) + '.png'
      },

      'offer': {
        'title': getRandomValue(listingTitle),
        'address': location.x + ', ' + location.y,
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
        'x': getRandomNumber(300, 900),
        'y': getRandomNumber(150, 500)
      }
    }

    similarListings.push(listing)
  };

  return similarListings
}

var createPins = function (pin) {
  var element = pinTemplate.cloneNode(true)

  element.style.left = (pin.location.x - pinImage.width / 2) + 'px'
  element.style.top = (pin.location.y - pinImage.height) + 'px'
  element.style.src = pin.author.avatar
  // Why is  there an empty string, when I console.log()???
  element.style.alt = pin.offer.title

  return element
}

var renderPins = function () {
  var fragment = document.createDocumentFragment()

  for (var i = 0; i < similarListings.length; i++) {
    fragment.appendChild(createPins(similarListings[i]))
  }

  pinList.appendChild(fragment)
}

var generateCard = function (place) {
  var card = cardTemplate.cloneNode(true)
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
  for (i = 0; i < place.offer.photos.length; i++) {
    var cardPhoto = card.querySelector('.popup__photo').cloneNode()
    cardPhoto.src = place.offer.photos[i]
    card.querySelector('.popup__photos').appendChild(cardPhoto)
  }
  card.querySelector('.popup__photo').remove()
  card.querySelector('.popup__avatar').src = place.author.avatar

  document.querySelector('.map').insertBefore(card, filtersContainer)
}

// Execution

map.classList.remove('map--faded')
generateSimilarListings()
renderPins()
generateCard(similarListings[0])
