import { Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface Req extends Request {
    dataUser: {
        id: string;
        role: string;
    }
}

export interface Res extends Response {

}