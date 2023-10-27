//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useLike(){
    //init
    const queryClient = useQueryClient();
    const defaultKey = 'like';
    const queryKey = [defaultKey];
    const queryUrl = '/like';
    const headers = {"Authorization" : "access"};

    //query
    const likeData = useQuery(
        queryKey, 
        () => apiCall.get(queryUrl, {headers}).then(( res ) => {
            if(res.data.result == "000"){
                return res.data.list;
            }else if(res.data.result == "001"){
                return [];
            }else{
                console.log(queryKey);
                console.log(res.data.result);
                return null;
            }
        }),
    );

    //function
    const goStale = () => queryClient.invalidateQueries({queryKey : queryKey, refetchType: 'none'});

    //return
    return [likeData.data, likeData.refetch, goStale];
}