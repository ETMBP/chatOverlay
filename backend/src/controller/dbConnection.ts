import * as mongoDB from "mongodb";

export const collections: { 
    badges?: mongoDB.Collection
    emotes?: mongoDB.Collection
    users?: mongoDB.Collection
} = {}

export async function dbConnection():Promise<void> {
    if (undefined !== process.env.DB_CONNECTION_STRING && undefined !== process.env.DB_NAME) {
        try {
            const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONNECTION_STRING);
            await client.connect();
            const db: mongoDB.Db = client.db(process.env.DB_NAME);
            const badgesCollection: mongoDB.Collection = db.collection('badges');
            const emotesCollection: mongoDB.Collection = db.collection('emotes');
            const usersCollection: mongoDB.Collection = db.collection('users');
    
            collections.badges = badgesCollection;
            collections.emotes = emotesCollection;
            collections.users = usersCollection;
        }
        catch (error) {
            console.error('DB Connection failed', error);
        }
    }
    else {
        throw Error('Not enough data to establish DB connection. Make sure env variables exists')
    }
}

export default collections