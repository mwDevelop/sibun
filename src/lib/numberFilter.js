export default function numberFilter(v){
    if(!v) return '';
    const regex = /[^0-9]/g;
    return v.replace(regex, '');
}