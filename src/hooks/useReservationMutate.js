//------------------------------ MODULE --------------------------------
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useReservationMutate(){
    //init
    const queryClient = useQueryClient();
    const defaultKey = 'reservation';
    const queryKey = [defaultKey];
    const queryUrl = '/reservation';
    const headers = {"Authorization" : "access"};

    //query
    const mutation = useMutation({
        mutationFn : ({ type=null, id=null, params={} }) => {
            if(type == "add") return apiCall.put(queryUrl, {...params}, {headers});
            if(type == "modify" && id) return apiCall.post(`${queryUrl}/${id}/state/cancel`, {...params}, {headers});
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