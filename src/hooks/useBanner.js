//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useBanner(){
    //init
    const queryClient = useQueryClient();
    const defaultKey = 'banner';
    const queryKey = [defaultKey];
    const queryUrl = '/banner';

    //query
    const bannerData = useQuery(
        queryKey, 
        () => apiCall.get(queryUrl).then(( res ) => {
            if(res.data.result == "000"){
                return res.data.list;
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
    return [bannerData.data, bannerData.refetch, goStale];
}