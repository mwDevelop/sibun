//------------------------------ MODULE --------------------------------
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useMyReviewMutate(){
    //init
    const queryClient = useQueryClient();
    const defaultKey = `my_review`;
    const queryKey = [defaultKey];
    const queryUrl = '/review';
    const headers = {"Authorization" : "access"};

    //query
    const mutation = useMutation({
        mutationFn : ({ type=null, params={}, index=null }) => {
            if(type == "add") return apiCall.put(queryUrl, {...params}, {headers});
            if(type == "remove") return apiCall.delete(`${queryUrl}/${index}`, {headers});
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