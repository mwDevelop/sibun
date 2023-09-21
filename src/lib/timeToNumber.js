//----------------------------- FUNCTION -------------------------------
export default function timeToNumber(date= new Date()){ // 30 min as 0.5
    try{
        const hour = date.getHours();
        const minutes = date.getMinutes();
        return hour*2 + (minutes < 30 ? 1 : 2);
    }catch(e){
        console.log(e);
        return false;
    }
}