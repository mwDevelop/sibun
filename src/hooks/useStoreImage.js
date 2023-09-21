//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useStoreImage(id){
    //init
    const queryClient = useQueryClient();
    const defaultKey = `storeImage`;
    const queryKey = [defaultKey];
    queryKey.push('id');
    queryKey.push(id);        
    const queryUrl = `/store/${id}/image`;

    //query
    const storeImageData = useQuery(
        queryKey, 
        () => apiCall.get(queryUrl).then(( res ) => {
            if(res.data.result == "000") return res.data.list;
            else {
                console.log(queryKey);
                console.log(res.data.result);
                return [];
            }
        }),
    );

    //function
    const goStale = () => queryClient.invalidateQueries({queryKey : queryKey, refetchType: 'none'});
    
    //return
    return [storeImageData.data, storeImageData.refetch, goStale];
}