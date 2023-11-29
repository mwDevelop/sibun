//------------------------------ MODULE --------------------------------
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiCall, timeToText, timeToNumber } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default function useCoupon(id, params={}){
    //init
    const queryClient = useQueryClient();
    const defaultKey = 'coupon'; 
    const queryKey = [defaultKey];
    queryKey.push('id');
    queryKey.push(id);    
    const queryUrl = `store/${id}/voucher`;

    //options
    if(params?.nowAvailable){
        queryKey.push('now');
        const td = new Date();
        const date = timeToText(td, 'y-mm-dd');
        const days = td.getDay() == 0 ? "7" : String(td.getDay());
        const time = timeToNumber(td);
        params.store_voucher_date = date;
        params.store_voucher_available_days = days;
        params.store_voucher_time = time;
    }

    //query
    const couponData = useQuery(
        queryKey,
        () => apiCall.get(queryUrl, {params}).then(( res ) => {
            if(res.data.result == "000"){
                const listData = res.data.list;
                listData.sort((p, n) => -(p.store_voucher_discount_rate - n.store_voucher_discount_rate)); //sort by discount rate (DESC)
                return listData;
            }else{
                //console.log(queryKey);
                //console.log(res.data.result);
                return null;
            }
        }),
    );

    //function
    const goStale = () => queryClient.invalidateQueries({queryKey : queryKey, refetchType: 'none'});

    //return
    return [couponData.data, couponData.refetch, goStale];
}