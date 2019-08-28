const Sequalize = require('sequelize');

const database = 'pizza_luvrs',
    host = 'pizza-db.crxqora79nmq.us-east-1.rds.amazonaws.com',
    username = 'ryan',
    password = '6NaulO02m78y';

const pgClient = new Sequalize(database, username, password, {
    host: host,
    dialect: 'postgres'
});

const Pizza = pgClient.define('pizza', {
    id: {type: Sequalize.STRING, primaryKey: true },
    name: {type: Sequalize.STRING },
    img: {type: Sequalize.STRING },
    username: {type: Sequalize.STRING },
    created: {type: Sequalize.BIGINT }
});

Pizza.sync().then(() => {
    console.log('Postgres connection ready')
});

module.exports = Pizza;
