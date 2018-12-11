//https://medium.com/@lachlanmiller_52885/graphql-basics-and-practical-examples-with-vue-6b649b9685e0

const express = require('express');
const { graphql, buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');

const Champion = require('./champion.js');

const champions = [
    new Champion('Ashe', 100),
    new Champion('Vayne', 200)
];

const events = [];

const schema = buildSchema(`
    type RootQuery {
        language: String
        getChampions: [Champion]
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput) : Event
    }

    type Champion {
        name: String
        attackDamage: Float
    }

    type Event {
        _id: ID
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

const rootValue = {
    language: () => 'GraphQL',
    getChampions: () => champions,
    events: () => events,
    createEvent: args => {
        const event = {
            _id: Math.random().toString(),
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: args.eventInput.date
        };
        events.push(event);
        return event;
    }
};

const app = express();
app.use(cors());

app.use('/graphql', graphqlHTTP({
    rootValue, 
    schema, 
    graphiql: true
}));

app.listen(4000, () => console.log('Listening on 4000'));