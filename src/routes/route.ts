import { Router } from "express";
import UserRoute from "./userRoute/UserRoute";
import RoomRoute from "./roomRoute/RoomRoute";
import DeviceRoute from "./deviceRoute/DeviceRoute";
import DataRoute from "./dataRoute/DataRoute";
const Route = Router();

export default (): Router => {
    DataRoute(Route);
    DeviceRoute(Route);
    RoomRoute(Route);
    UserRoute(Route);
    return Route;
}