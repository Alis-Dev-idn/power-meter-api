import {Req, Res} from "../../data/dataType";
import RoomService, {IRoomType} from "../../services/roomService/RoomService";
import {createResponse} from "../../utils/utils";
import {language} from "../../assets/lang/lang";
import {GetConfig} from "../../services/fileService/FileService";
import {addRoom} from "../../services/joiService/JoiService";
import { v4 as uuidV4 } from "uuid";
import {dbValidate} from "../../database/database";

const lang = language(GetConfig()? GetConfig() : "default");
class RoomController {

    public static async get(req: Req, res: Res) {
        let type: IRoomType = "id";
        let limit: number;
        let offset: number;
        const query = req.query;
        const { id, role } = req.dataUser;
        if(query.name) type = "name";
        if(query.count) type = "count";
        if(query.limit) limit = !isNaN(Number(query.limit))? Number(query.limit) : 10;
        if(query.offset) offset = !isNaN(Number(query.offset))? Number(query.offset) : 10;
        RoomService.get(type, type === "name"? {id, name: query.name as string} : id, { limit, offset }).then(response => {
            if(!response ) return createResponse(res, 404, { error: lang.rooms.not_found.replaceAll("%rm", query.name as string) });
            createResponse(res, 200, response);
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        })
    }

    public static async add(req: Req, res: Res) {
        const body = req.body;
        const { id, role } = req.dataUser;
        const { error } = addRoom.validate(body);
        if(error) return createResponse(res, 400, { error: error.details[0].message });
        body.id = id;
        body.key = `${body.name}.${uuidV4().replaceAll("-", "")}`;
        body.balance = 0;
        RoomService.add(body).then(response => {
            createResponse(res, 200, { message: response});
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        })
    }

    public static async delete(req: Req, res: Res) {
        const params = req.params;
        if(! dbValidate(params.id)) return createResponse(res, 400, { error: lang.database.db_not_valid });
        RoomService.delete(params.id).then((response) => {
            createResponse(res, 200, { message: response });
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        })
    }
}

export default RoomController;