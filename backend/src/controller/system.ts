import { ObjectId } from "mongodb";
import collections from "./dbConnection.js";

export async function deleteUserCache(): Promise<number | void> {
    const dbConn = collections.users;

    if (!!dbConn) {
        const searchQuery = {};
        let docCount: number

        try {
            docCount = await dbConn.countDocuments(searchQuery);
            const dbResult = await dbConn.deleteMany(searchQuery);
        } catch (error) {
            throw error;
        }

        if (!!docCount) {
            return docCount
        }
    }
    else {
        throw Error('No DB connection');
    }
}

export async function deleteEmoteCache(): Promise<number | void> {
    const dbConn = collections.emotes;

    if (!!dbConn) {
        const searchQuery = {};
        let docCount: number;

        try {
            docCount = await dbConn.countDocuments(searchQuery);
            const dbResult = await dbConn.deleteMany(searchQuery);
        } catch (error) {
            throw error;
        }

        if (!!docCount) {
            return docCount;
        }
    }
    else {
        throw Error('No DB connection');
    }
}

export async function deleteBadgeCache(): Promise<number | void> {
    const dbConn = collections.badges;

    if (!!dbConn) {
        const searchQuery = {};
        let docCount: number;

        try {
            docCount = await dbConn.countDocuments(searchQuery);
            const dbResult = await dbConn.deleteMany(searchQuery);
        } catch (error) {
            throw error;
        }

        if (!!docCount) {
            return docCount;
        }
    }
    else {
        throw Error('No DB connection');
    }
}

export async function deleteAllCache(): Promise<number | void> {
    let userCount: number | void;
    let emoteCount: number | void;
    let badgeCount: number | void;

    try {
        userCount = await deleteUserCache();
        emoteCount = await deleteEmoteCache();
        badgeCount = await deleteBadgeCache();
    } catch (error) {
        throw error
    }

    if (!!userCount && !!emoteCount && !!badgeCount) {
        return userCount + emoteCount + badgeCount
    }
}