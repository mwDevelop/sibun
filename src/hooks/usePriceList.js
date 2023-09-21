//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function usePriceList(id){
    //init
    const queryClient = useQueryClient();
    const defaultKey = `priceList`; 
    const queryKey = [defaultKey];
    queryKey.push('id');
    queryKey.push(id);    
    const queryUrl = `/store/${id}/pricing`;

    //query
    const priceListData = useQuery(
        queryKey, 
        () => apiCall.get(queryUrl).then(( res ) => {
            if(res.data.result == "000") return res.data.list;
            else {
                console.log(queryKey);
                console.log(res.data.result);
                return null;
            }
        }),
    );

    //function
    const goStale = () => queryClient.invalidateQueries({queryKey : queryKey, refetchType: 'none'});
    
    //return
    return [priceListData.data, priceListData.refetch, goStale];
}