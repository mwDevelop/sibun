//----------------------------- FUNCTION -------------------------------
export default function timeToText(date=new Date(), format='y년 m월 d일 h시 i분 s초'){
    try{
        if(!date) return null;
        let target = format;
    
        const y = date.getFullYear();
        if(target.includes('yy')) target = target.replace('yy',y.toString().substr(2,2));
        if(target.includes('y')) target = target.replace('y',y);

        const matchObj = {
            m : date.getMonth()+1,
            d : date.getDate(),
            h : date.getHours(),
            i : date.getMinutes(),
            s : date.getSeconds()
        }
    
        for(const [key, value] of Object.entries(matchObj)) {
            if(target.includes(`${key}${key}`)) target = target.replace(`${key}${key}`,value < 10 ? '0'+value : value);
            if(target.includes(key)) target = target.replace(key,value);        
        }    
        return target;
    }catch(e){
        console.log(e);
        return false;
    }
}