import { Req, Res } from "../data/dataType";
import { NextFunction } from "express";
import {createResponse, getKey} from "../utils/utils";
import {language} from "../assets/lang/lang";
import {GetConfig} from "../services/fileService/FileService";
import jwt from "jsonwebtoken";
import UserService from "../services/userService/UserService";

const lang = language(GetConfig()? GetConfig() : "default");

export const Middleware = async ( req: Req, res: Res, next: NextFunction) => {
    let key = req.headers.authorization;
    if(!key) return createResponse(res, 401, {error: lang.middleware.token_null});
    try{
        const token = key.split(" ")[1];
        const decode = jwt.decode(token) as { data: { id: string, role: string } };
        const cekId = await UserService.get("id", decode.data.id);
        if(!cekId) return createResponse(res, 401, { error: lang.middleware.token_exp });
        const pair = await getKey(decode.data.id);
        jwt.verify(token, pair.public, { algorithms: ["RS256"] });
        req["dataUser"] = decode.data;
        next();
    }catch (error){
        createResponse(res, 403, { error: lang.middleware.token_exp });
    }
}