//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useTestQuery(){
    //init
    const queryClient = useQueryClient();
    const defaultKey = "test";
    const queryKey = [defaultKey];

    //query
    const test = useQuery(
        queryKey, 
        async() => {
            const randomValue = Math.random();
            return {"test" : randomValue};
        }
    );

    //function
    const goStale = () => queryClient.invalidateQueries({queryKey : [defaultKey], refetchType: 'none'});

    //return
    return [test.data, test.refetch, goStale];
}