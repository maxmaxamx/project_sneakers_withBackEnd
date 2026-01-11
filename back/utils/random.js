function getRandomElementFromArray(array) {
  if (Array.isArray(array) && array.length > 0) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  } else {
    return null;
  }
}

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

module.exports = {
  getRandomElementFromArray,
  getRandomInt,
};
