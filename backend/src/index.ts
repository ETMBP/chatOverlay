import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 5001;
var statusCode: number = 200;
var statusMessage: string = "All system is green";

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
  
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});