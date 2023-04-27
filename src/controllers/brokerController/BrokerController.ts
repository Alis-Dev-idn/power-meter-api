import {BrokerModel, DataModel, DeviceModel, RoomModel} from "../../database/database";
import {deviceData} from "../../services/joiService/JoiService";

class BrokerController {
    public static async authClient(client: any, username: any, password: any, callback: any) {
        if(username && password) {
            const data = {
                clientId: client.id,
                key: `${username}.${password.toString()}`,
                id: ""
            };
            const cekKey = await RoomModel.findOne({key: data.key}) as any;
            if(!cekKey) {
                console.log(`[Broker] Client id ${client.id} try to connect broker`);
                return callback(null, false);
            }
            data.id = cekKey._id;
            const newClient = new BrokerModel(data);
            await newClient.save();
            console.log(`[Broker] Client id ${client.id} connected`);
            return callback(null, true);
        }
        console.log(`[Broker] Client id ${client.id} try to connect broker`);
        return callback(null, false);
    }

    public static async authPubSub(client: any, sub: any, callback: any) {
        callback(null, sub);
    }

    public static async publish(packet: any, client: any) {
        try{
            const payload = packet.payload.toString();
            const topic = packet.topic;

            /* if first connect or other, value data is drops */
            if(topic.split("/")[0] === "$SYS") return;
            if(topic.split("/")[0] === "control") return;
            if(topic.split("/")[0] === "online") {
                if(topic.split("/")[1] === "get"){
                    return;
                }``
                if(topic.split("/")[1] === "send") return;
                return;
            }

            /* change data to json */
            const obj = JSON.parse(payload);

            /* validate json data */
            const { error } = deviceData.validate(obj);
            if(error) return;

            /* validate data device */
            const clientBroker = await BrokerModel.findOne({clientId: client.id}) as any;
            if(!clientBroker) return;
            const cekDevice = await DeviceModel.findOne({id: clientBroker.id,  name: topic}) as any;
            if(!cekDevice) return;

            /* save to database */
            const addData = new DataModel({...obj, id: cekDevice._id, name: topic});
            await addData.save();
            // console.log(`[Broker] ` + JSON.stringify(obj, null, 5) + "\nTopic : " + topic);
        }catch (error) {
            /* if error nothing event execute*/
        }
    }

    public static async disconnect(client: any) {
        const cekId = await BrokerModel.findOne({clientId: client.id}).sort({createdAt: -1});
        if(cekId) await BrokerModel.findOneAndDelete({clientId: client.id.split(".")[0]});
        return console.log(`[Broker] Client id ${client.id} disconnect`);
    }
}

export default BrokerController;