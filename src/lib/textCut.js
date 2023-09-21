export default function textCut(text, length){
    if (length >= text.length) return text;
    return text.substring(0,length) + '...';
}