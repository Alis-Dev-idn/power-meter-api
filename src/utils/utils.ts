import fs from "fs";
import {ILangDefault} from "../assets/lang/lang";
import {config, IConfig} from "../assets/config/config";
import {Res} from "../data/dataType";
import crypto from "crypto";
import { GetConfig } from "../services/fileService/FileService";
import keypair from "keypair";
import {KeyModel} from "../database/database";
import jwt from "jsonwebtoken";

export const SetupDefault = () => {
    if(!fs.existsSync("./storage"))
        fs.mkdirSync("./storage");

    if(!fs.existsSync("./storage/lang") && !fs.existsSync("./storage/config")){
        fs.mkdirSync("./storage/lang");
        fs.mkdirSync("./storage/config");
    }

    if(!fs.existsSync("./storage/lang/lang.json") && !fs.existsSync("./storage/config/config.json")) {
        fs.writeFileSync("./storage/lang/lang.json", JSON.stringify(ILangDefault, null, 5));
        fs.writeFileSync("./storage/config/config.json", JSON.stringify(IConfig, null, 5));
        console.log("[system] edit file in folder storage/lang/lang.json and storage/config/config.json");
        console.log("[system] please close and start again application to use your custom language & config");
        for(;;) {}
    }

    if(!fs.existsSync("./storage/lang"))
        fs.mkdirSync("./storage/lang");
    if(!fs.existsSync("./storage/lang/lang.json")) {
        fs.writeFileSync("./storage/lang/lang.json", JSON.stringify(ILangDefault, null, 5));
        console.log("[system] edit file language in folder storage/lang/lang.json");
        console.log("[system] please close and start again application to use your custom language");
        for(;;) {}
    }
    if(!fs.existsSync("./storage/config"))
        fs.mkdirSync("./storage/config");
    if(!fs.existsSync("./storage/config/config.json")) {
        fs.writeFileSync("./storage/config/config.json", JSON.stringify(IConfig, null, 5));
        console.log("[system] edit file config in folder storage/config/config.json");
        console.log("[system] please close and start again application to use your custom configuration server");
        for(;;) {}
    }
}

export const createResponse = (res: Res, status: 200 | 400 | 401 | 403 | 404 | 500, message: any) => {
    res.set("X-Powered-By", "alis-team");
    res.status(status).json(message).end();
}

export const HastCompare = async (type: "generate" | "validate", value: string, hast?: string): Promise<string | boolean> => {
    const data = config(GetConfig() ? GetConfig() : "default");
    if(type === "generate") {
        const salt = crypto.randomBytes(128).toString("base64");
        const hast = crypto.createHmac('SHA256', [salt, value].join("/")).update(data.secret).digest("hex");
        return `${salt}.${hast}`;
    }
    if(type === "validate") {
        if(!hast) throw ("hast required");
        const salt = hast.split(".");
        const valueHast = crypto.createHmac('SHA256', [salt[0], value].join("/")).update(data.secret).digest("hex");
        return salt[1] === valueHast;
    }
    return false;
}

const generateNewKey = async (id: string, type: "new" | "update"): Promise<{public: string, private: string}> => {
    const pair = await keypair({bits: 2048});
    const data = {
        _id: id,
        public: pair.public,
        private: pair.private,
        expire: Math.floor((Date.now() / 1000) + (6*24*60*60))
    }
    if(type === "new") {
        const newKey = new KeyModel(data);
        await newKey.save();
        return pair;
    }
    if(type === "update") {
        await KeyModel.findOneAndUpdate({_id: id}, data);
        return pair;
    }
}

export const getKey = async (id: string): Promise<{public: string, private: string}> => {
    const cekData = await KeyModel.findById(id) as any;
    if(!cekData) return await generateNewKey(id, "new");
    const date = Math.floor(Date.now() / 1000);
    if(date > cekData.expire) return await generateNewKey(id, "update");
    return {
        public: cekData.public,
        private: cekData.private
    }
}

export const getToken = async (id: string, role: string) => {
    const key = await getKey(id);
    return jwt.sign({
        data: { id, role },
        exp: Math.floor((Date.now() / 1000) + (3*60*60))
    }, key.private, {algorithm: "RS256"});
}