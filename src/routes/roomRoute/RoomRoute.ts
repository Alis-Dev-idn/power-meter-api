import { Router } from "express";
import { Middleware } from "../../middleware/Middleware";
import RoomController from "../../controllers/rommController/RoomController";

export default (route: Router) => {
    route.get("/room", Middleware, RoomController.get);
    route.post("/room", Middleware, RoomController.add);
    route.delete("/room/:id", Middleware, RoomController.delete);
}