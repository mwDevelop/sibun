//----------------------------- FUNCTION -------------------------------
export default function numberToTime(num = 0){
    try{
        const time = num/2;
        return (Math.floor(time) < 10 ? '0' : '') + Math.floor(time) + ':' + (time%1 ? '30' : '00');
    }catch(e){
        console.log(e);
        return false;
    }
}