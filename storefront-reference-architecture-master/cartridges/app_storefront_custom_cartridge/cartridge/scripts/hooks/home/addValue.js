const addValue = (viewData) => {
    viewData.randomNumber = getRandomNumber(0, 10);
    return viewData;
};
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
module.exports = {
    addValue,
};
