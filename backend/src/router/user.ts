import { Router, Request, Response } from "express";
import { User } from "../controller/user";

const userRouter = Router();

userRouter.get('/id', async (req: Request, res: Response) => {
    const username = req.query.username;
    const lifetime = req.query.lifetime;
    if (!!username && typeof username === 'string' && (typeof lifetime === 'string' || typeof lifetime === 'undefined')) {
        let myUser
        try {
            myUser = new User(username, Number(lifetime));
            await myUser.setTwitchId();
        } catch (error) {
            console.error(error);
            res.status(500).json({message:`${error}`}).end();
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
            console.error(error);
            res.status(500).json({message:`${error}`}).end();
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

userRouter.get('/pfp', async (req: Request, res: Response) => {
    const username = req.query.username;
    const lifetime = req.query.lifetime;
    if (!!username && typeof username === 'string' && (typeof lifetime === 'string' || typeof lifetime === 'undefined')) {
        let myUser
        try {
            myUser = new User(username, Number(lifetime));
            await myUser.setPfpUrl();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({message:`${error}`}).end();
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
            console.error(error);
            res.status(500).json({message:`${error}`}).end();
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

export default userRouter;