'use strict'

//Data

var similarListings = [];
var listingTitle = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var listingType = [palace, flat, house, bungalo];
var listingTime = ["12:00", "13:00", "14:00"];
var listingFeatures = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var listingPhotos = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

// Helper functions

var getRandomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var shuffleArray = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };

  return array;
}

var getRandomValue = function(array) {
  return array[getRandomNumber(0, array.length - 1)];
}

var getArrayOfRandomLength = function(initialArray) {
  var newArray = [];

  for(var i = 0; i < initialArray(0, initialArray.length); i++) {
  var randomValue = initialArray[getRandomNumber(0, initialArray.length - 1)];
  newArray.push(randomValue);
  }

  return newArray;
}

// Main functions

var generateSimilarListings = function() {
  for (i = 0; i < 8; i++) {

    var listing = {
      "author": {
        "avatar": 'img/avatars/user0' + getRandomNumber(1, 8) + '.png'
      },

      "offer": {
        "title": getRandomValue(listingTitle)
        "address": this.location.x + ', ' + this.location.y;

        "price": getRandomNumber(1000, 1000000);
        "type": getRandomValue(listingType);
        "rooms": getRandomNumber(1, 5);
        "guests": getRandomNumber(0, 3);
        "checkin": getRandomValue(listingTime);
        "checkout": getRandomValue(listingTime);
        "features": getArrayOfRandomLength(listingFeatures);
        "description": '',
        "photos": shuffleArray(listingPhotos);
      },

      "location": {
        "x": getRandomNumber(300, 900);
        "y": getRandomNumber(150, 500);
      }
    };

    similarListings.push(listing);
  };
}

// Execution

generateSimilarListings();
