import { Res, Req } from "../../data/dataType";
import {userAdd, userLogin, userUpdate} from "../../services/joiService/JoiService";
import {createResponse, HastCompare} from "../../utils/utils";
import UserService from "../../services/userService/UserService";
import {language} from "../../assets/lang/lang";
import {GetConfig} from "../../services/fileService/FileService";
import {dbValidate} from "../../database/database";

const lang = language(GetConfig()? GetConfig() : "default");
class UserController {
    public static async get(req: Req, res: Res) {
        type typeData = "username" | "id" | "all" | "name";
        let limit: number;
        let offset: number;
        let name: string;
        let type: typeData = "all";
        const query = req.query;

        if(query.limit) limit = !isNaN(Number(query.limit))? Number(query.limit) : 10;
        if(query.offset) offset = !isNaN(Number(query.offset))? Number(query.offset) : 10;
        if(query.name) {
            name = query.name as string;
            type = "name";
        }

        UserService.get(type, name, { limit, offset }, true).then((response) => {
            if(!response) return createResponse(res, 404, { error: lang.user.not_found.replaceAll("%user", name) });
            createResponse(res, 200, response);
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        });
    }

    public static async add(req: Req, res: Res) {
        const body = req.body;
        const { error } = userAdd.validate(body);
        if(error) return createResponse(res, 400, {error: error.details[0].message});
        if(!body.role) body.role = "user";
        UserService.add(body).then((response) => {
            createResponse(res, 200, { message: response });
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        })
    }

    public static async login(req: Req, res: Res) {
        const body = req.body;
        const {error} = userLogin.validate(body);
        if(error) return createResponse(res, 400, {error: error.details[0].message});
        UserService.login(body).then(response => {
            createResponse(res, 200, response);
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        });
    }

    public static async update(req: Req, res: Res) {
        const body = req.body;
        const {error} = userUpdate.validate(body);
        if(error) return createResponse(res, 400, { error: error.details[0].message });
        try{
            if(!dbValidate(body._id)) return createResponse(res, 400, { error: lang.database.db_not_valid });
            const cekId = await UserService.get("id", body._id);
            if(!cekId) return createResponse(res, 404, { error: lang.database.not_found.replaceAll("%db", body._id) });
            if(body.new_password) {
                if(!body.password) return createResponse(res, 400, { error: lang.user.password_null });
                if(!body.confirm_password) return createResponse(res, 400, { error: lang.user.confirm_password_null });
                if(body.new_password !== body.confirm_password) return createResponse(res, 400, { error: lang.user.new_password_not_match });
                if(! await HastCompare("validate", body.password, cekId.password)) return createResponse(res, 400, { error: lang.user.wrong_password });
                cekId.password = await HastCompare("generate", body.new_password);
            }
            if(body.username) cekId.username = body.username;
            if(body.name) cekId.name = body.name;
            if(body.role) cekId.role = body.role;
            const update = await UserService.update(cekId);
            createResponse(res, 200, { message: update });
        }catch (error){
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        }
    }

    public static async delete (req: Req, res: Res) {
        const params = req.params;
        if(! dbValidate(params.id)) return createResponse(res, 400, { error: lang.database.db_not_valid });
        UserService.delete(params.id).then(response => {
            createResponse(res, 200, { message: response });
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        });
    }
}

export default UserController;