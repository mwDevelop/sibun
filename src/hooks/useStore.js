//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useStore(id = null, params = null){
    //init
    const queryClient = useQueryClient();
    const defaultKey = `store`;
    let queryKey = [defaultKey];
    if(id){
        queryKey.push('id');
        queryKey.push(id);
        params = null;
    }else if(params){
        queryKey.push('params');
        queryKey.push(`%${JSON.stringify(params)}`);
    } 
    const queryUrl = `/store${id ? `/${id}` : ''}`;

    //query
    const storeData = useQuery(
        queryKey, 
        () => apiCall.get( queryUrl, {params} ).then(( res ) => {
            if(res.data.result == "000") return id ? res.data.data : res.data.list;
            else {
                //console.log(`-------${queryKey}--------`);
                //console.log(res.data.result);
                return null;
            }
        }),
    );

    //function
    const goStale = () => queryClient.invalidateQueries({queryKey : queryKey, refetchType: 'none'});
    
    //return
    return [storeData.data, storeData.refetch, goStale];
}