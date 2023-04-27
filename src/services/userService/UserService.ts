import {KeyModel, RoomModel, UserModel} from "../../database/database";
import {language} from "../../assets/lang/lang";
import {GetConfig} from "../fileService/FileService";
import {getToken, HastCompare} from "../../utils/utils";

export type IUserType = "id" | "username" | "all" | "name";

export interface IUserValue {
    _id?: string;
    name: string;
    username: string;
    password: string;
    role?: string;
    tryLogin?: number,
    banned?: boolean,
    timeBanExp?: number
}

const lang = language(GetConfig()? GetConfig() : "default");
class UserService {
    public static async get(type: IUserType, value: string, params?: { limit: number, offset: number }, hidden?: boolean): Promise<any> {
        try{
            switch (type) {
                case "id": {
                    return UserModel.findById(value);
                }
                case "all": {
                    const count = await UserModel.find({}).count();
                    const data = await UserModel.find({}, {
                        username: 0,
                        password: 0,
                        role: 0,
                        tryLogin: 0,
                        banned: 0,
                        timeBanExp: 0,
                        __v: 0
                    }).sort({createdAt: -1}).skip(params.offset).limit(params.limit);
                    return { count, data }
                }
                case "name": {
                    return UserModel.findOne({username: value}, hidden? {
                        username: 0,
                        password: 0,
                        role: 0,
                        tryLogin: 0,
                        banned: 0,
                        timeBanExp: 0,
                        __v: 0
                    } : {__v: 0});
                }
                case "username": {
                    return UserModel.findOne({username: value}, hidden? {
                        password: 0,
                        role: 0,
                        tryLogin: 0,
                        banned: 0,
                        timeBanExp: 0,
                        __v: 0
                    } : {__v: 0});
                }
                default: {
                    return null
                }
            }
        }catch (error){
            throw (error);
        }
    }

    public static async login (data: { username: string, password: string } ) {
        return new Promise(async (resolve, reject) => {
            try{
                const cekUser = await this.get("username", data.username) as IUserValue;
                if(!cekUser) return reject({status: 404, message: lang.user.not_found.replaceAll("%user", data.username)});
                if(cekUser.banned) {
                    const date = Math.floor(Date.now() / 1000);
                    if(date > cekUser.timeBanExp) {
                        cekUser.tryLogin = 0;
                        cekUser.banned = false;
                        await this.update(cekUser);
                    }else{
                        const time  = new Date(cekUser.timeBanExp*1000);
                        return reject({status: 401, message: lang.user.banned.replaceAll("%time", `${time.getHours()}:${time.getMinutes()}`)});
                    }
                }
                if(! await HastCompare("validate", data.password, cekUser.password)) {
                    cekUser.tryLogin++;
                    if(cekUser.tryLogin > 3) {
                        cekUser.banned = true;
                        cekUser.timeBanExp = Math.floor((Date.now() / 1000) + (5 * 60));
                    }
                    await this.update(cekUser);
                    return reject({
                        status: 400,
                        message: lang.user.wrong_password
                    });
                }
                if(cekUser.tryLogin !== 0) {
                    cekUser.tryLogin = 0;
                    await this.update(cekUser);
                }
                const token = await getToken(cekUser._id, cekUser.role);
                return resolve({
                    id: cekUser._id,
                    name: cekUser.name,
                    role: cekUser.role,
                    token
                });
            }catch (error){
                reject(error);
            }
        })
    }

    public static async add (data: IUserValue) {
        return new Promise(async (resolve, reject) => {
            try{
                const cekUser = await this.get("username", data.username);
                if(cekUser) return reject({status: 400, message: lang.user.user_registered.replaceAll("%user", data.username)});
                data.password = await HastCompare("generate", data.password) as string;
                data.tryLogin = 0;
                data.banned = false;
                data.timeBanExp = 0;
                const addUser = new UserModel(data);
                await addUser.save();
                resolve(lang.user.success_create.replaceAll("%user", data.username));
            }catch (error){
                reject(error);
            }
        })
    }

    public static async update (data: IUserValue) {
        return new Promise(async (resolve, reject) => {
            await UserModel.findOneAndUpdate({ _id: data._id },  data);
            resolve(lang.user.success_update.replaceAll("%user", data.name));
        });
    }

    public static async delete (id: string) {
        return new Promise(async (resolve, reject) => {
            const cekId = await this.get("id", id);
            if(!cekId) return reject({status: 404, message: lang.database.not_found.replaceAll("%db", id)});
            await UserModel.findByIdAndDelete(id);
            await KeyModel.findByIdAndDelete(id);
            resolve(lang.user.success_delete.replaceAll("%user", cekId.name));
        });
    }

}

export default UserService;