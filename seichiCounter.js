import data from "./data.json" with {type: 'json'};

const seichiCounter = document.querySelector(".seichiCounter");

const numSeichi = data.length;

seichiCounter.insertAdjacentText('beforeend', `収録済みの聖地 ${numSeichi} 個`);
