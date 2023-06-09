//----------------------------- FUNCTION -------------------------------
export default function timeToText(date=new Date(), format='y년 m월 d일 h시 i분 s초'){
    let target = format;
    if(target.includes('y')) target = target.replace('y',date.getFullYear());
    if(target.includes('m')) target = target.replace('m',date.getMonth());
    if(target.includes('d')) target = target.replace('d',date.getDate());
    if(target.includes('h')) target = target.replace('h',date.getHours());

    let min = date.getMinutes();
    let sec = date.getSeconds();
    if(target.includes('i')) target = target.replace('i',min < 10 ? '0'+min : min);
    if(target.includes('s')) target = target.replace('s',sec < 10 ? '0'+sec : sec);
    return target;
}