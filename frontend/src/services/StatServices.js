import api from "../utils/api"

export const StatServices = {

    async getStat(){
        try{
            const response = await api.get("/stat")
            console.log(response);
            return response?.data

        }catch(e){
            console.log("error happend");
            return e

        }
    }

}