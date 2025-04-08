import { Router, Request, Response, NextFunction } from "express";
import { User } from "../controller/user";

const userRouter = Router();

userRouter.get('/id', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.query.username;
    const lifetime = req.query.lifetime;
    if (!!username && typeof username === 'string' && (typeof lifetime === 'string' || typeof lifetime === 'undefined')) {
        let myUser
        try {
            myUser = new User(username, Number(lifetime));
            await myUser.setTwitchId();
        } catch (error) {
            return next(error);
        }

        try {
            if (!!myUser && !!myUser.twitchId) {
                res.status(200).json(myUser).end();
            }
            else {
                res.status(500).json({message: 'Empty data'}).end();
            }
        }
        catch (error) {
            return next(error);
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

userRouter.get('/pfp', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.query.username;
    const lifetime = req.query.lifetime;
    if (!!username && typeof username === 'string' && (typeof lifetime === 'string' || typeof lifetime === 'undefined')) {
        let myUser
        try {
            myUser = new User(username, Number(lifetime));
            await myUser.setPfpUrl();
        }
        catch (error) {
            return next(error);
        }

        try {
            if (!!myUser && !!myUser.twitchId) {
                res.status(200).json(myUser).end();
            }
            else {
                res.status(500).json({message: 'Empty data'}).end();
            }
        }
        catch (error) {
            return next(error);
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

export default userRouter;