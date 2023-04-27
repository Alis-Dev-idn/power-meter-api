import { Router } from "express";
import {Middleware} from "../../middleware/Middleware";
import DataController from "../../controllers/dataController/DataController";


export default (route: Router) => {
    route.get("/data", Middleware, DataController.get);
}