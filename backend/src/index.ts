import express, { NextFunction, Request, Response } from "express";
import { dbConnection } from "./controller/dbConnection";
import { twitchApiConnection } from "./controller/twitchAuth";
import userRouter from "./router/user";
import badgeRouter from "./router/badge";
import emoteRouter from "./router/emote";

const app = express();
const port = process.env.PORT || 5001;
var statusCode: number = 200;
var statusMessage: string = "All system is green";

dbConnection()
    .then(res => console.log('Connecting to DB was sucessfull'))
    .catch(error => console.error(error));

try {
    twitchApiConnection();
} catch (error) {
    console.error(error);
}

app.use(express.json());
app.use(function(req: Request, res: Response, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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
app.use((error: Error, req: Request, res: Response, next: NextFunction) =>{
    console.error(`${error}`);
    res.status(500).json({message: `${error}`});
});
  
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});