import * as fs from "fs";
import { Buffer } from "buffer";
import {icon} from "../../assets/icon/icon";

interface IData {
    configuration: string;
    description: string;
}

const data: IData = {
    configuration: "default",
    description: `if you want use custom language and config set configuration to custom. ` +
        `By default server running in 3310, mqtt in 3310, ws mqtt in 3311. ` +
        `Please setup secret code before you use`
}

let IConfig = "";

export const FileService = async () => {
    if(!fs.existsSync("./storage"))
        fs.mkdirSync("./storage");
    if(!fs.existsSync("./storage/setup.json"))
        fs.writeFileSync("./storage/setup.json", JSON.stringify(data, null, 5));
    if(!fs.existsSync("./storage/icon")){
        await fs.mkdirSync("./storage/icon");

        // const base64 = `${fs.readFileSync("./src/assets/icon/icon_32x32.ico", "base64")}`;
        // fs.writeFileSync("base64.txt", base64);
        const buffer = Buffer.from(icon, "base64");
        fs.writeFileSync("./storage/icon/icon_32x32.ico", buffer);
    }
    return "ok";
}

export const GetConfig = (): string | undefined => {
    if(!fs.existsSync("./storage/setup.json")) return undefined;
    if(IConfig === "") {
        const dataRead = JSON.parse(fs.readFileSync("./storage/setup.json").toString()) as IData;
        if(!dataRead.configuration || dataRead.configuration === "") {
            IConfig = "default";
            return "default";
        }
        IConfig = dataRead.configuration;
        return dataRead.configuration;
    }
    return IConfig;
}