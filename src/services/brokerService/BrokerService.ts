import aedes from "aedes";
import {createServer} from "aedes-server-factory";
import net from "net";
import BrokerController from "../../controllers/brokerController/BrokerController";

const BrokerService = async () => {
        const app = new aedes();
        const broker = net.createServer(app.handle);
        const httpServer = createServer(app, {ws: true});

        app.authenticate = BrokerController.authClient;
        app.authorizeSubscribe = BrokerController.authPubSub;
        app.authorizePublish = BrokerController.authPubSub;

        app.on("publish", BrokerController.publish);
        app.on("clientDisconnect", BrokerController.disconnect);

        broker.listen(3311, () => {
            console.log(`MQTT running in port >> 3311`);
        });

        httpServer.listen(3312, () => {
            console.log(`MQTT Socket running in port >> 3312`);
        });
}

export default BrokerService;