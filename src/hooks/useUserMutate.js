//------------------------------ MODULE --------------------------------
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useUserMutate(){
    //init
    const queryClient = useQueryClient();
    const defaultKey = `user`;
    const queryKey = [defaultKey];
    const queryUrl = '/user';
    const headers = {"Authorization" : "access"};

    //query
    const mutation = useMutation({
        mutationFn : ({ type=null, params={} }) => {
            if(type == "add") return apiCall.put(queryUrl, {...params});
            if(type == "modify") return apiCall.post(`${queryUrl}/me`, {...params}, {headers});
            if(type == "remove") return apiCall.delete(`${queryUrl}/me`, {headers});
        },
        onSuccess: (res) => {
            if(res.data.result == "000"){
                queryClient.invalidateQueries(queryKey); // goStale 
            }else{
                console.log(queryKey);
                console.log(res.data.result);
            }
        }
    })

    //return
    return mutation;
}