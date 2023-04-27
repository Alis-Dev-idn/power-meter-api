import { Router } from "express";
import UserController from "../../controllers/userController/UserController";
import { Middleware } from "../../middleware/Middleware";

export default (route: Router) => {
    route.get("/user", UserController.get);
    route.post("/user", UserController.add);
    route.post("/user/login", UserController.login);
    route.put("/user", Middleware, UserController.update);
    route.delete("/user/:id", Middleware, UserController.delete);
}