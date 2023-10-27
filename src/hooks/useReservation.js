//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useReservation(id = null, params = null){
    //init
    const queryClient = useQueryClient();
    const defaultKey = `reservation`;
    let queryKey = [defaultKey];
    if(id){
        queryKey.push('id'); 
        queryKey.push(id); 
        params = null;
    }else if(params){
        queryKey.push('params');
        queryKey.push(`%${JSON.stringify(params)}`);
    } 
    const queryUrl = `/reservation${id ? `/${id}` : ''}`;
    const headers = {"Authorization" : "access"};

    //query
    const reservationData = useQuery(
        queryKey, 
        () => apiCall.get( queryUrl, {params: params, headers: headers} ).then(( res ) => {
            if(res.data.result == "000") return id ? res.data.data : res.data.list;
            else if(res.data.result == "001"){
                return id ? null : (params?.type? {} : []);
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
    return [reservationData.data, reservationData.refetch, goStale];
}