import { Router, Request, Response, NextFunction } from "express";
import { deleteAllCache, deleteBadgeCache, deleteEmoteCache, deleteUserCache } from "../controller/system";

const systemRouter = Router();

systemRouter.get('/dropusers', async (req: Request, res: Response, next: NextFunction) => {
    let itemCount: number | void
    try {
        itemCount = await deleteUserCache();
    } catch (error) {
        return next(error);
    }

    if (!!itemCount && typeof itemCount === 'number') {
        res.status(200).json({message: 'Deleted ' + itemCount + ' item from user cache'});
    }
    else {
        res.status(500).json({message: 'Unable to determine success'}).end();
    }
});

systemRouter.get('/dropemotes', async (req: Request, res: Response, next: NextFunction) => {
    let itemCount: number | void
    try {
        itemCount = await deleteEmoteCache();
    } catch (error) {
        return next(error);
    }

    if (!!itemCount && typeof itemCount === 'number') {
        res.status(200).json({message: 'Deleted ' + itemCount + ' item from emote cache'});
    }
    else {
        res.status(500).json({message: 'Unable to determine success'}).end();
    }
});

systemRouter.get('/dropbadges', async (req: Request, res: Response, next: NextFunction) => {
    let itemCount: number | void
    try {
        itemCount = await deleteBadgeCache();
    } catch (error) {
        return next(error);
    }

    if (!!itemCount && typeof itemCount === 'number') {
        res.status(200).json({message: 'Deleted ' + itemCount + ' item from badge cache'});
    }
    else {
        res.status(500).json({message: 'Unable to determine success'}).end();
    }
});

systemRouter.get('/dropall', async (req: Request, res: Response, next: NextFunction) => {
    let itemCount: number | void
    try {
        itemCount = await deleteAllCache();
    } catch (error) {
        return next(error);
    }

    if (!!itemCount && typeof itemCount === 'number') {
        res.status(200).json({message: 'Deleted ' + itemCount + ' item from cache'});
    }
    else {
        res.status(500).json({message: 'Unable to determine success'}).end();
    }
});

export default systemRouter;