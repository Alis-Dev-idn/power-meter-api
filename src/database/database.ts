import mongoose, { Schema, model } from "mongoose";
import { GetConfig } from "../services/fileService/FileService";
import { config } from "../assets/config/config";
import {language} from "../assets/lang/lang";


const UserSchema = new Schema({
    name: String,
    username: String,
    password: String,
    role: String,
    tryLogin: Number,
    banned: Boolean,
    timeBanExp: Number
}, {
    timestamps: true
});

const KeySchema = new Schema({
    _id: mongoose.Types.ObjectId,
    public: String,
    private: String,
    expire: Number
}, {
    timestamps: false
});

const RoomSchema = new Schema({
    id: mongoose.Types.ObjectId,
    name: String,
    key: String,
    balance: Number,
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const DeviceSchema = new Schema({
    id: mongoose.Types.ObjectId,
    name: String,
}, {
    timestamps: { createdAt: true, updatedAt: false }
})

const DataSchema = new Schema({
    id: mongoose.Types.ObjectId,
    name: String,
    AC0: {
        V: Number,
        I: Number,
        PF: Number,
        E: Number,
        F: Number
    },
    AC1: {
        V: Number,
        I: Number,
        PF: Number,
        E: Number,
        F: Number
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
})

const BrokerSchema = new Schema({
    clientId: String,
    key: String,
    id: mongoose.Types.ObjectId
}, {
    timestamps: { createdAt: true, updatedAt: false }
})



const data = config(GetConfig()? GetConfig() : "default");
const lang = language(GetConfig()? GetConfig() : "default");

export const BrokerModel = model("id_broker", BrokerSchema);
export const KeyModel = model("key", KeySchema);
export const RoomModel = model("room", RoomSchema);
export const DeviceModel = model("device", DeviceSchema);
export const UserModel = model("user", UserSchema);
export const DataModel = model("data", DataSchema);

export const dbValidate = (id: string) => {
    if(mongoose.Types.ObjectId.isValid(id)) {
        return (String)(new Object(id)) === id;
    }
    return false;
}
export const ConnectDb = async () => {
    return new Promise(async (resolve, reject) => {
        try{
            console.log(`[DB] ${lang.database.connect}`);
            await mongoose.connect(data.database.url);
            console.log(`[DB] ${lang.database.success}`);
            resolve(`[DB] ${lang.database.success}`);
        }catch (error){
            reject({message: `[DB] ${lang.database.failed}`});
        }
    })
}