//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useUser(){
    //init
    const queryClient = useQueryClient();
    const defaultKey = `user`;
    const queryKey = [defaultKey];
    const queryUrl = '/user/me';
    const headers = {"Authorization" : "access"};

    //query
    const userData = useQuery(
        queryKey, 
        () => apiCall.get(queryUrl, {headers}).then(( res ) => {
            if(res.data.result == "000") return res.data.data;
            else {
                console.log(queryKey);
                console.log(res.data.result);
                return null;
            }
        }),
    );

    //refresh
    const goStale = () => queryClient.invalidateQueries({queryKey : queryKey, refetchType: 'none'});

    //return
    return [userData.data, userData.refetch, goStale];
}