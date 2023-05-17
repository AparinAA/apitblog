import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();
let db;

async function connetToDB(cb) {
    let client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.cixpwtm.mongodb.net/?retryWrites=true&w=majority`);
    await client.connect();
    db = client.db('myFirstDatabase');
    cb();
}

export {
    db,
    connetToDB
};


/*
[
    {
        id: "1",
        date: "1684222374400",
        authorId: "1",
        article: 'text'
    },
    {
        id: "2",
        date: "1684222374400",
        authorId: "1",
        article: 'text'
    },
    {
        id: "3",
        date: "1684222374400",
        authorId: "1",
        article: 'text'
    },
]*/