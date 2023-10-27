//------------------------------ MODULE --------------------------------
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useLikeMutate(){
    //init
    const queryClient = useQueryClient();
    const defaultKey = 'like';
    const queryKey = [defaultKey];
    const queryUrl = '/like';
    const headers = {"Authorization" : "access"};

    //query
    const mutation = useMutation({
        mutationFn : ({ type=null, id=null, params={} }) => {
            if(type == "add") return apiCall.put(queryUrl, {...params}, {headers});
            if(type == "remove" && id) return apiCall.delete(`${queryUrl}/${id}`, {headers});
        },
        onSuccess: (res) => {
            if(res.data.result == "000"){
                queryClient.invalidateQueries(queryKey);
            }else{
                console.log(`-------${queryKey}-------`);
                console.log(res.data.result);
            }
        }
    })

    //return
    return mutation;
}