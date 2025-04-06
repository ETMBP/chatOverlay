import { Router, Request, Response } from "express";
import { User } from "../controller/user";

const userRouter = Router();

userRouter.get('/id', async (req: Request, res: Response) => {
    const username = req.query.username;
    if (!!username && typeof username === 'string') {
        let myUser = new User(username);
        try {
            await myUser.setTwitchId();
            if (!!myUser.twitchId) {
                res.status(200).json(myUser).end();
            }
            else {
                res.status(500).json({message: 'Empty data'}).end();
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message:`${error}`}).end();
        }
    }
    else {
        res.status(401).json({message: 'Bad Request'});
    }
});

export default userRouter;