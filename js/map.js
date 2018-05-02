'use strict'

// Data

var listingTitle = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде']
var listingType = ['bungalo', 'flat', 'house', 'palace']
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

var renderPin = function (pin) {
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
  var cardGenerated = generateCard()
  var fragment = document.createDocumentFragment()
  for (var i = 0; i < listings.length; i++) {
    var pin = renderPin(listings[i])
    pin.dataset.index = i
    fragment.appendChild(pin)
  }

  pinList.appendChild(fragment)

  var pins = pinList.querySelectorAll('.map__pin')

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
  for (var i = 0; i < 2; i++) {
    var cardPhoto = card.querySelector('.popup__photo').cloneNode()
    card.querySelector('.popup__photos').appendChild(cardPhoto)
  }
  document.querySelector('.map').insertBefore(card, filtersContainer)
  return card
}

var generateCardData = function (card, place) {
  var photosArray = card.querySelector('.popup__photos')
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
    var photo = photosArray.children[i]
    photo.src = place.offer.photos[i]
  }
  card.querySelector('.popup__avatar').src = place.author.avatar
}

// Event listeners

var defineAddressUnactivated = function () {
  var xInitial = parseInt(mainPin.style.left, 10)
  var yInitial = parseInt(mainPin.style.top, 10)

  return xInitial + ', ' + yInitial
}

var defineAddressActivated = function () {
  var xAfterDragged = parseInt(pinTemplate.style.left, 10) + pinImage.width / 2
  var yAfterDragged = parseInt(pinTemplate.style.top, 10) - pinImage.height
  return xAfterDragged + ', ' + yAfterDragged
}

var checkMinPrice = function () {
  var housingType = document.querySelector('#type')
  var housingPrice = document.querySelector('#price')
  var price = [0, 1000, 5000, 10000]

  housingType.addEventListener('change', function () {
    for (var i = 0; i < listingType.length; i++) {
      var housingTypeValue = housingType.value
      var index = listingType.indexOf(housingTypeValue)
      housingPrice.minlength = price[index]

      housingPrice.placeholder = housingPrice.minlength
    }
  })
}

var syncTimeInTimeOut = function () {
  var timeIn = document.querySelector('#timein')
  var timeOut = document.querySelector('#timeout')

  timeIn.addEventListener('change', function () {
    timeOut.value = timeIn.value
  })
}

var syncGuestsAndRooms = function () {
  var roomNumber = document.querySelector('#room_number')
  var capacity = document.querySelector('#capacity')
  var roomNumbers = [1, 2, 3, 100]
  var capacityValues = [1, 2, 3, 0]

  roomNumber.addEventListener('change', function () {
    var roomValue = Number(roomNumber.value)
    var index = roomNumbers.indexOf(roomValue)
    capacity.value = capacityValues[index]

    for (var i = 0; i < capacity.length; i++) {
      if (capacity[i].hasAttribute('disabled')) {
        capacity[i].removeAttribute('disabled')
      }
    }

    if (roomValue === 1) {
      capacity[1].setAttribute('disabled', '')
      capacity[2].setAttribute('disabled', '')
      capacity[3].setAttribute('disabled', '')
    } else if (roomValue === 2) {
      capacity[2].setAttribute('disabled', '')
      capacity[3].setAttribute('disabled', '')
    } else if (roomValue === 3) {
      capacity[3].setAttribute('disabled', '')
    } else {
      capacity[0].setAttribute('disabled', '')
      capacity[1].setAttribute('disabled', '')
      capacity[2].setAttribute('disabled', '')
    }
  })
}

var checkFormSuccess = function () {
  var successMessage = document.querySelector('.success')

  adForm.addEventListener('submit', function (evt) {
    if (adForm.checkValidity() === true) {
      successMessage.removeAttribute('hidden')
    }
  })
}

var activateForm = function () {
  map.classList.remove('map--faded')
  adForm.classList.remove('ad-form--disabled')
  adFormFieldset.forEach(function (element) {
    element.removeAttribute('disabled')
  })
  fieldsetAddress.value = defineAddressActivated()
  checkMinPrice()
  syncTimeInTimeOut()
  syncGuestsAndRooms()
  checkFormSuccess()
}

var activatePage = function () {
  activateForm()
  renderPins()
  mainPin.removeEventListener('mouseup', activatePage)
}

// Execution
fieldsetAddress.value = defineAddressUnactivated()
mainPin.addEventListener('mouseup', activatePage)
