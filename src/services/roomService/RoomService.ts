import {DeviceModel, RoomModel} from "../../database/database";
import {language} from "../../assets/lang/lang";
import {GetConfig} from "../fileService/FileService";

const lang = language(GetConfig()? GetConfig() : "default");

export type IRoomType = "id" | "name" | "count" | "_id";
type IRoomValue = { id: string; name: string; } | string;
export interface IRoomData {
    id: string,
    name: string,
    key: string,
    balance: number,
}
class RoomService {
    public static async get(type: IRoomType, value: IRoomValue, params?: { limit: number, offset: number }): Promise<any> {
        switch (type) {
            case "id": {
                const count = await RoomModel.find({id: value}).count();
                const data = await RoomModel.find({id: value}, {id: 0}).sort({createdAt: -1}).limit(params.limit).skip(params.offset);
                return { count, data };
            }
            case "name": {
                return RoomModel.findOne({id: typeof value !== "string" ? value.id : "", name: typeof value !== "string" ? value.name : ""});
            }
            case "count": {
                const count = await RoomModel.find({id: value}).count();
                return { count };
            }
            case "_id": {
                return RoomModel.findOne({_id: value});
            }
            default:
                return null;
        }
    }

    public static async add(data: IRoomData) {
        return new Promise(async (resolve, reject) => {
            const cekName = await this.get("name", { id: data.id, name: data.name });
            if(cekName) return reject({status: 400, message: lang.rooms.ready.replaceAll("%rm", data.name)});
            const addRoom = new RoomModel(data);
            await addRoom.save();
            resolve(lang.rooms.success_add.replaceAll("%rm", data.name));
        });
    }

    public static async delete(id: string) {
        return new Promise(async (resolve, reject) => {
            const cekId = await this.get("_id", id);
            if(!cekId) return reject({ status: 404, message: lang.database.not_found.replaceAll("%db", id) });
            await RoomModel.findOneAndDelete({_id: id});
            await DeviceModel.deleteMany({id: id});
            resolve(lang.rooms.success_delete.replaceAll("%rm", cekId.name));
        });
    }
}

export default RoomService;