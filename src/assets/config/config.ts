import fs from "fs";
import {SetupDefault} from "../../utils/utils";
import { v4 as uuidV4 } from "uuid";

interface IConfigType {
    lang: string,
    database: {
        type: string,
        url: string
    },
    port: {
        server: number,
        mqtt: number,
        socket: number
    },
    secret: string;
}

export const IConfig: IConfigType = {
    lang: "default",
    database: {
        type: "mongodb",
        url: "mongodb://<user>:<password>@<ip>:<port>/<db>"
    },
    port: {
        server: 3310,
        mqtt: 3311,
        socket: 3312
    },
    secret: uuidV4()
}

export const config = (type: string): IConfigType => {
    // if(type === "default") return IConfig;
    // if(type === "custom") {
        SetupDefault();
        return JSON.parse(fs.readFileSync("./storage/config/config.json").toString());
    // }
}