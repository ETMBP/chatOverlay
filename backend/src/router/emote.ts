import { Router, Request, Response, NextFunction } from "express";
import { Emote, fetchSTvEmotes, fetchTwitchChannelEmotes, fetchTwitchGlobalEmotes, getAllNames } from "../controller/emote";

const emoteRouter = Router();

emoteRouter.get('/fetchall', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.query.username;

    if (!!username && typeof username === 'string') {
        try {
            await fetchTwitchGlobalEmotes();
            await fetchTwitchChannelEmotes(username);
            await fetchSTvEmotes(username);

            res.status(200).json({message: 'Succes'}).end();
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