import { Router } from "express";
import {Middleware} from "../../middleware/Middleware";
import DeviceController from "../../controllers/deviceController/DeviceController";
export default (route: Router) => {
    route.get("/device", Middleware, DeviceController.get);
    route.post("/device", Middleware, DeviceController.add);
}