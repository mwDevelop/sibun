//----------------------------- FUNCTION -------------------------------
export default function uniquePush(newItem=null, arr=[]){ // the arr should be one dimentional for copy and compare items
    const newArr = [...arr];
    try{
        const index = newArr.indexOf(newItem);
        if(index > -1) newArr.splice(index,1);
        else newArr.push(newItem);
        return newArr;
    }catch(e){
        console.log(e);
        return arr;
    }
}