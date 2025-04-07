import { Router, Request, Response } from "express";
import { Badge, fetchGlobalBadges } from "../controller/badge";

const badgeRouter = Router();

badgeRouter.get('/fetchglobal', async (req: Request, res: Response) =>{
    try {
        await fetchGlobalBadges();
    } catch (error) {
        res.status(500).json({message:`${error}`}).end();
    }

    res.status(200).json({message:'success'}).end();
});

export default badgeRouter