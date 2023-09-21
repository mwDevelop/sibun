export default function cloneObject(obj){
    const clone = {};
    for (let key in obj) {
        if (typeof obj[key] == "object" && obj[key] != null) {
            clone[key] = cloneObject(obj[key]);
        } else {
            clone[key] = obj[key];
        }
    }
    return clone;
};
  