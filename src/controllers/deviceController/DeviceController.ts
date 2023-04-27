import { Req, Res } from "../../data/dataType";
import {createResponse} from "../../utils/utils";
import {dbValidate} from "../../database/database";
import {language} from "../../assets/lang/lang";
import {GetConfig} from "../../services/fileService/FileService";
import RoomService from "../../services/roomService/RoomService";
import DeviceService, {ITypeService} from "../../services/deviceService/DeviceService";

const lang = language(GetConfig()? GetConfig() : "default");

class DeviceController {
    public static async get(req: Req, res: Res) {
        let limit: number;
        let offset: number;
        let type: ITypeService = "all";
        const query: {
            room: string,
            name: string,
            count: string,
            limit: number,
            offset: number } = req.query as any;

        if(!query.room) return createResponse(res, 400, { error: lang.device.query_id_null });
        if(! dbValidate(query.room)) return createResponse(res, 400, { error: lang.database.db_not_valid });

        if(query.name) type = "name";
        if(query.count) type = "count";
        if(query.limit) limit = !isNaN(Number(query.limit))? Number(query.limit) : 10;
        if(query.offset) offset = !isNaN(Number(query.offset))? Number(query.offset) : 10;

        try{
            const cekIdRoom = await RoomService.get("_id", query.room);
            if(!cekIdRoom) return createResponse(res, 404, { error: lang.rooms.not_found.replaceAll("%rm", query.room) });
            const device = await DeviceService.get(type, type === "name"? { id: query.room, name: query.name } : {id: query.room}, {limit, offset});
            if(!device) return createResponse(res, 404, { error: lang.device.not_found.replaceAll("%d", query.name) });
            createResponse(res, 200, device);
        }catch (error){
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        }
    }

    public static async add(req: Req, res: Res) {
        const body: { room: string, name: string } = req.body as any;
        if(!body.room) return createResponse(res, 400, { error: lang.device.query_id_null });
        if(!body.name) return createResponse(res, 400, { error: "name device required" });
        if(! dbValidate(body.room)) return createResponse(res, 400, { error: lang.database.db_not_valid });
        DeviceService.add(body.room, body.name).then(response => {
            createResponse(res, 200, { message: response });
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        })
    }
}

export default DeviceController;