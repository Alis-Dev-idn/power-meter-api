import { Req, Res } from "../../data/dataType";
import {createResponse} from "../../utils/utils";
import {language} from "../../assets/lang/lang";
import {GetConfig} from "../../services/fileService/FileService";
import DataService from "../../services/dataService/dataService";


const lang = language(GetConfig()? GetConfig() : "default");
class DataController {
    public static async get(req: Req, res: Res) {
        let limit: number;
        let offset: number;
        const query = req.query;
        if(query.limit) limit = !isNaN(Number(query.limit))? Number(query.limit) : 10;
        if(query.offset) offset = !isNaN(Number(query.offset))? Number(query.offset) : 10;

        if(limit > 150) return createResponse(res, 400, { error: "limit value max 150" });

        if(!query.device) return createResponse(res, 400, { error: "" });
        DataService.get(query.device as string, {limit, offset}).then(response => {
            createResponse(res, 200, response);
        }).catch(error => {
            if(error.message) return createResponse(res, error.status? error.status : 500, { error: error.message });
            createResponse(res, 500, { error: lang.server.internal_error });
        })
    }
}

export default DataController;