
import Cookies from 'js-cookie';
import axios from 'axios';
import Params from "../params"

export default async function useAuthStoreInitial(){
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    var result = {
        isLogin: false,
        accessToken: "",
        role:"",
        data:null,
    };
    if(token){
        await axios.get(Params.api+"/api/user/me",{
            headers:{
                "Authorization" : "Bearer " + token
            }
        })
        .then(({data})=>{
            if(data.user){
                result = {
                    isLogin: true,
                    accessToken: token,
                    role: role,
                    data: data,
                };
            }
            else{
                result = {
                    isLogin: false,
                    accessToken: "",
                    role:"",
                    data:null,
                };
            }


        })

        
    }

    if(!result.isLogin){
        Cookies.remove('token') ;
        Cookies.remove('role') ;
    }
    return result;
    
}