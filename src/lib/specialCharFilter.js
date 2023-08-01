export default function specialCharFilter(v){
    if(!v) return '';
    const regex = /[^a-zA-Z0-9]*$/; 
    return v.replace(regex, '');
}