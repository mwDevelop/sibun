//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useReview(id){
    //init
    const queryClient = useQueryClient();
    const defaultKey = `review`;
    const queryKey = [defaultKey];
    queryKey.push('id');
    queryKey.push(id);      
    const queryUrl = `/store/${id}/review`;

    //query
    const reviewData = useQuery(
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
    return [reviewData.data, reviewData.refetch, goStale];
}