import { DeviceModel as device } from "../../database/database";
import {language} from "../../assets/lang/lang";
import {GetConfig} from "../fileService/FileService";
import RoomService from "../roomService/RoomService";

const lang = language(GetConfig()? GetConfig() : "default");

export type ITypeService = "all" | "name" | "id" | "count";
class DeviceService {
    public static async get(type: ITypeService, value: { id: string, name?: string, _id?: string }, params?: { limit: number, offset: number }) {
        switch (type){
            case "id": {
                return device.findById(value._id);
            }
            case "all": {
                const count = await device.find({id: value.id}).count();
                const data = await device.find({id: value.id}, {__v: 0, id: 0}).sort({createdAt: -1}).skip(params.offset).limit(params.limit);
                return { count, data };
            }
            case "name": {
                return device.findOne({id: value.id, name: value.name}, {__v: 0, id: 0});
            }
            case "count": {
                const count = await device.find({id: value.id}).count();
                return { count };
            }
            default:
                return null
        }
    }

    public static async add(room: string, name: string) {
        return new Promise(async (resolve, reject) => {
            const cekIdRoom = await RoomService.get("_id", room);
            if(!cekIdRoom) return reject({ status: 404, message: lang.rooms.not_found.replaceAll("%rm", room) });
            const cekName = await this.get("name", { id: room, name });
            if(cekName) return reject({status: 400, message: lang.device.ready_use.replaceAll("%d", name)});
            const addDevice = new device({
                id: room,
                name
            });
            await addDevice.save();
            resolve(lang.device.success_create.replaceAll("%", name));
        });
    }
}

export default DeviceService;