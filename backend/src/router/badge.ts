import { Router, Request, Response, NextFunction } from "express";
import { Badge, fetchChannelBadges, fetchGlobalBadges } from "../controller/badge.js";
import { IBadge } from "../models/badge.js";
import { addMinutes } from "date-fns";

const badgeRouter = Router();

let lastFetchAllEvent: {
    streamerName?: string,
    lastDate?: Date
} = {};

badgeRouter.get('/fetchglobal', async (req: Request, res: Response, next: NextFunction) =>{
    try {
        await fetchGlobalBadges();
    } catch (error) {
        return next(error);
    }

    res.status(200).json({message:'success'}).end();
});

badgeRouter.get('/fetchchannel', async (req: Request, res: Response, next: NextFunction) => {
    const streamerName = req.query.username

    if (!!streamerName && typeof streamerName === 'string') {
        try {
            await fetchChannelBadges(streamerName);
        } catch (error) {
            return next(error);
        }

        res.status(200).json({messgae:'success'}).end();
    }
    else {
        res.status(401).json({message:'Bad Request'}).end();
    }
});

badgeRouter.get('/fetchall', async (req: Request, res: Response, next: NextFunction) => {
    const streamerName = req.query.username;
    const currentDate = new Date();
    let responseObj = {}

    if (!!lastFetchAllEvent.streamerName && !!lastFetchAllEvent.lastDate) {
        console.debug('FetchAll event exists');
    }
    else {
        lastFetchAllEvent = {
            lastDate: addMinutes(currentDate, -40)
        }
    }

    if (!!streamerName && typeof streamerName === 'string') {
        try {
            if (streamerName !== lastFetchAllEvent.streamerName || currentDate > addMinutes(lastFetchAllEvent.lastDate!, 30)) {
                await fetchGlobalBadges();
                await fetchChannelBadges(streamerName);
                lastFetchAllEvent = {
                    streamerName: streamerName,
                    lastDate: new Date()
                }
                responseObj = {
                    message: 'success'
                }
            }
            else {
                console.debug('Last fetch all was within 30 minutes, nothing to do');
                responseObj = {
                    message: 'Last update was within 30 minutes'
                }
            }
        } catch (error) {
            return next(error);
        }

        res.status(200).json(responseObj).end();
    }
    else {
        res.status(401).json({message:'Bad Request'}).end();
    }
});

badgeRouter.get('/getone', async (req: Request, res: Response, next: NextFunction) => {
    const badgeName = req.query.name;
    const badgeVersion = req.query.version;

    if (!!badgeName && !!badgeVersion && typeof badgeName === 'string' && typeof badgeVersion === 'string') {
        const myBadge = new Badge(badgeName, badgeVersion)
        try {
            await myBadge.setBadgeUrl();
        } catch (error) {
            return next(error);
        }

        if (!!myBadge && !!myBadge.badgeUrl) {
            res.status(200).json(myBadge).end();
        }
        else {
            res.status(500).json({message: 'No badge url has been found'}).end();
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'}).end();
    }
});

badgeRouter.post('/getmany', async (req: Request, res: Response, next: NextFunction) => {
    const badges = req.body as IBadge[];

    if (!!badges) {
        let resolvedBadges: Badge[] = [];

        for (let i = 0; i < badges.length; i++) {
            const badge = badges[i];
            let myBadge: Badge;
            try {
                myBadge = new Badge(badge.name, badge.version);
                await myBadge.setBadgeUrl();
            } catch (error) {
                return next(error);
            }

            if (!!myBadge && !!myBadge.badgeUrl) {
                resolvedBadges.push(myBadge);
            }
            else {
                console.error(badge.name + ' does not have URL');
            }
        }

        if (!!resolvedBadges && resolvedBadges.length > 0) {
            res.status(200).json(resolvedBadges).end();
        }
        else {
            return next(Error('Empty Data'));
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

export default badgeRouter