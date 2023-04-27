import * as fs from "fs";
import {SetupDefault} from "../../utils/utils";

interface ILangType {
    database: {
        not_found: string,
        success: string,
        failed: string,
        connect: string,
        db_not_valid: string
    },
    user: {
        success_create: string,
        success_update: string,
        success_delete: string,
        user_registered: string
        not_found: string,
        banned: string,
        password_null: string,
        wrong_password: string,
        confirm_password_null: string,
        new_password_not_match: string,
    },
    rooms: {
        not_found: string;
        ready: string;
        success_add: string;
        success_delete: string;
    },
    device: {
        query_id_null: string;
        not_found: string;
        ready_use: string;
        success_create: string;
    }
    server: {
        internal_error: string,
    },
    middleware: {
        token_null: string,
        token_exp: string
    }
}
export const ILangDefault: ILangType = {
    database: {
        not_found: "id %db not found",
        success: "DB success connected",
        failed: "DB can't connect, please cek database configuration",
        connect: "Try connect to database ...",
        db_not_valid: "id not valid",
    },
    user: {
        banned: "You have banned until %time",
        success_create: "Success Create User %user",
        success_update: "Success Update User %user",
        success_delete: "Success delete User %user",
        user_registered: "User %user ready used",
        not_found: "User by name %user not found",
        wrong_password: "Password Wrong!",
        password_null: "Password required!",
        confirm_password_null: "confirm password required",
        new_password_not_match: "new password and confirm password not match"
    },
    rooms: {
        not_found: "you don't have room %rm",
        ready: "name room %rm ready used",
        success_add: "success create new room %rm",
        success_delete: "success delete room %rm"
    },
    device: {
        query_id_null: "query id room required!",
        not_found: "device by name %d not found",
        ready_use: "device by name %d ready to used",
        success_create: "success create new device %d"
    },
    server: {
        internal_error: "Oops something error, please try again for a few minutes"
    },
    middleware: {
        token_null: "Token required",
        token_exp: "Token expired or not valid"
    }
}

export const language = (type: string): ILangType => {
    // if(type === "default") return ILangDefault;
    // if(type === "custom") {
        if(!fs.existsSync("./storage/lang"))
            fs.mkdirSync("./storage/lang");
        if(!fs.existsSync("./storage/lang/lang.json")) {
            SetupDefault();
        }
        return JSON.parse(fs.readFileSync("./storage/lang/lang.json").toString());
    // }
}