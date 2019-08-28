'use strict';

const _ = require('lodash'),
  Pizza = require('../models/pizza'),
  ImageStore = require('../lib/imageStore'),
  PizzaStore = require('./pizzaStore'),
  pizzas = {};

function createPizza (name, toppings, img, username, callback) {
  ImageStore.saveImage(name.replace(/ /g, '-'), img, (err, imgUrl) => {
    if (err) throw err;

    let pizza = new Pizza(name, toppings, imgUrl, username);
    // pizzas[pizza.id] = pizza;
    // callback(null, pizza);
    PizzaStore.create(prepPizza(pizza)).then(() => {
      callback(null, pizza);
    })
  });
}

// for mocks that don't need pizza images saved
function importPizza (name, toppings, imgUrl, username) {
  let pizza = new Pizza(name, toppings, imgUrl, username);
  PizzaStore.create(prepPizza(pizza));
}

function getPizzaForUser (username, callback) {
  PizzaStore.findAll({
    where: { username: username }
  }).then((pizzas) => {
    callback(null, debriefPizza(pizzas));
  });
  // let userPizzas = _.filter(pizzas, (pizza) => {
  //   return pizza.username === username;
  // });
  // callback(null, userPizzas);
}

function getRecentPizzas (callback) {
  // let recentPizzas = _.orderBy(pizzas, ['created'], ['desc']);
  // callback(null, _.values(recentPizzas).splice(0, 5));

  PizzaStore.findAll({
    order: [['created', 'DESC']],
    limit: 4
  }).then((pizzas) => {
    callback(null, debriefPizza(pizzas));
  });
}

function getPizza (pizzaId, callback) {
  // if (!pizzas[pizzaId]) callback('Pizza not found');
  // else callback(null, pizzas[pizzaId]);

  PizzaStore.find({
    where: { id: pizzaId }
  }).then((pizza => {
    if (!pizza) {
      callback('Could not find pizza');
    } else {
      callback(null, debriefPizza(pizza));
    }
  }))
}

function prepPizza(pizza) {
  return _.assign(pizza, {toppings: JSON.stringify(pizza.toppings)})
}

function debriefPizza(pizza) {
  return _.assign(pizza, {toppings: JSON.parse(pizza.toppings)})
}

function debriefPizzas(pizzas) {
  return pizzas.map((pizza) => {
    return debriefPizza(pizza)
  });
}

module.exports.createPizza = createPizza;
module.exports.importPizza = importPizza;
module.exports.getPizzaForUser = getPizzaForUser;
module.exports.getPizza = getPizza;
module.exports.getRecentPizzas = getRecentPizzas;
