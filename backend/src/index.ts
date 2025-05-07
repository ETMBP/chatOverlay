import express, { NextFunction, Request, Response } from "express";
import { dbConnection, collections } from "./controller/dbConnection.js";
import { twitchApiConnection } from "./controller/twitchAuth.js";
import userRouter from "./router/user.js";
import badgeRouter from "./router/badge.js";
import emoteRouter from "./router/emote.js";
import systemRouter from "./router/router.js";

const app = express();
const port = process.env.PORT || 5000;
let statusCode: number = 200;
let statusMessage: string = "All system is green";

dbConnection()
    .then(res => {
        if (collections.users) {
            console.log('Connecting to DB was sucessfull');
        }
        else {
            throw new Error('Unexpected error');
        }
    })
    .catch(error => {
        console.error(error);
        statusCode = 500;
        statusMessage = `DB Connection failed: ${error}`;
    });

try {
    twitchApiConnection();
} catch (error) {
    console.error(error);
}

app.use(express.json());
app.use(function(req: Request, res: Response, next) {
    const origin = req.headers.origin;
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next();
});

app.get('/status', (req: Request, res: Response) => {
    res.status(statusCode).json({
        "status":statusMessage
    });
});

app.use('/user', userRouter);
app.use('/badge', badgeRouter);
app.use('/emote', emoteRouter);
app.use('/system', systemRouter);
app.use((error: Error, req: Request, res: Response, next: NextFunction) =>{
    console.error(`${error}`);
    res.status(500).json({message: `${error}`});
});
  
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});