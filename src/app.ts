import express from "express";
import cors from "cors";
import morgan from "morgan";
import expressUpload from "express-fileupload";
import http from "http";
import BrokerService from "./services/brokerService/BrokerService";
import Route from "./routes/route";
import {FileService} from "./services/fileService/FileService";
import {ConnectDb} from "./database/database";
import {createResponse} from "./utils/utils";

const app = express();

app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
    credentials: true
}));
app.use(expressUpload({limits: {fileSize: 50 * (1024*1024)}}));
app.use(express.json({limit: 5 * (1024*1024)}));
app.use(express.urlencoded({extended: false}));
app.use(morgan("dev"));

/* cek require file */
FileService().then(async () => {
    try{
        /* Route Url */
        app.use("/", Route());
        app.use("/favicon.ico", express.static("./storage/icon/icon_32x32.ico"));
        app.use((req, res) => {
            createResponse(res, 404, {
                info: "server is running",
                error: "url not found"
            });
        });
        const server = http.createServer(app);

        /* prepare to start server */
        await ConnectDb();
        await BrokerService();
        server.listen(3310, () => {
            console.log(`Server Running in >> http://localhost:3310`);
        });
    }catch (error){
        console.log(error);
    }
}).catch(error => {
    console.log(error);
});
