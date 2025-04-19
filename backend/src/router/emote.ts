import { Router, Request, Response, NextFunction } from "express";
import { Emote, fetchSTvEmotes, fetchTwitchChannelEmotes, fetchTwitchGlobalEmotes, getAllNames } from "../controller/emote";
import { addMinutes } from "date-fns/addMinutes";
import { IEmote } from "../models/emote";

const emoteRouter = Router();

let lastFetchAllEvent: {
    streamerName?: string,
    lastDate?: Date
} = {};

emoteRouter.get('/fetchall', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.query.username;
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

    if (!!username && typeof username === 'string') {
        try {
            if (username !== lastFetchAllEvent.streamerName || currentDate > addMinutes(lastFetchAllEvent.lastDate!, 30)) {
                await fetchTwitchGlobalEmotes();
                await fetchTwitchChannelEmotes(username);
                await fetchSTvEmotes(username);
                lastFetchAllEvent = {
                    streamerName: username,
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

            res.status(200).json(responseObj).end();
        } catch (error) {
            return next(error);
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'}).end();
    }
});

emoteRouter.get('/fetchglobal', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fetchTwitchGlobalEmotes();
    } catch (error) {
        return next(error);
    }
});

emoteRouter.get('/fetchchannel', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.query.username;
    
    if (!!username && typeof username === 'string') {
        try {
            await fetchTwitchChannelEmotes(username);

            res.status(200).json({message: 'Success'}).end();
        } catch (error) {
            return next(error);
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

emoteRouter.get('/fetchstv', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.query.username;
    
    if (!!username && typeof username === 'string') {
        try {
            await fetchSTvEmotes(username);

            res.status(200).json({message: 'Success'}).end();
        } catch (error) {
            return next(error);
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

emoteRouter.get('/fetchstreamer', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.query.username;
    
    if (!!username && typeof username === 'string') {
        try {
            await fetchSTvEmotes(username);
            await fetchTwitchChannelEmotes(username);

            res.status(200).json({message: 'Success'}).end();
        } catch (error) {
            return next(error);
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

emoteRouter.get('/getone', async (req: Request, res: Response, next: NextFunction) => {
    const name = req.query.name;
    const id = req.query.id;

    if (!!name && !!id && typeof name === 'string' && typeof id === 'string') {
        const myEmote = new Emote(name, id);
        try {
            await myEmote.setEmoteUrl();

            res.status(200).json(myEmote).end();
        } catch (error) {
            return next(error);
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

emoteRouter.post('/getmany', async (req: Request, res: Response, next: NextFunction) => {
    const emotes = req.body as IEmote[];

    if (!!emotes) {
        let resolvedEmotes: Emote[] = [];

        for (let i = 0; i < emotes.length; i++) {
            const emote = emotes[i];
            let myEmote: Emote;
            try {
                myEmote = new Emote(emote.name, emote.sourceId);
                await myEmote.setEmoteUrl();
            } catch (error) {
                return next(error);
            }

            if (!!myEmote && !!myEmote.emoteUrl) {
                resolvedEmotes.push(myEmote);
            }
            else {
                console.error(emote.name + ' does not have URL');
            }
        }

        if (!!resolvedEmotes && resolvedEmotes.length > 0) {
            res.status(200).json(resolvedEmotes).end();
        }
        else {
            return next(Error('Empty Data'));
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});


emoteRouter.get('/getallnames', async (req: Request, res: Response, next: NextFunction) => {
    let names: string[] | undefined | void
    try {
        names = await getAllNames();
    } catch (error) {
        return next(error);
    }

    if (!!names && names.length > 0) {
        res.status(200).json(names).end();
    }
    else {
        res.status(500).json({message: 'Query returned empty result'})
    }
});

export default emoteRouter;