import { DataModel } from "../../database/database";

class DataService {
    public static async get(id: string, params: { limit: number, offset: number }) {
        return new Promise(async (resolve, reject) => {
            const count = await DataModel.find({id: id}).count();
            const data = await DataModel.find({id: id}, {id: 0, __v: 0}).limit(params.limit).skip(params.offset).sort({createdAt: -1});
            resolve( {count, data} );
        });
    }
}

export default DataService;