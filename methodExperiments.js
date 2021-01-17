
const getShallowMethods = (obj) =>{
    return Object.getOwnPropertyNames(obj).filter(
      (item) => typeof obj[item] === "function"
    ); 
  };

  const getAllPropertyNames = (obj) => {
    let properties = new Set();
    let currentObj = obj;
    do {
      Object.getOwnPropertyNames(currentObj).map((item) => {
        properties.add(item);
      });
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    return [...properties.keys()]
  };
  const getMethods= (obj, clean=true) =>{
      let names=getAllPropertyNames(obj),
      methods=names.filter(item => typeof obj[item] === "function");  
    if (clean){
        return methods.filter(item =>ignoreGetlist.indexOf(item)<0)
      }
      return methods;
  };

/*
var methods=getMethods(synth);

*/
const ignoreGetlist = [
    "constructor",
    "__defineGetter__",
    "__defineSetter__",
    "hasOwnProperty",
    "__lookupGetter__",
    "__lookupSetter__",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toString",
    "valueOf",
    "__proto__",
    "toLocaleString",
  ];



function findSettableProperties(toneObj){
    
    var properties=getAllPropertyNames(toneObj.get());

    var filteredProperties = properties.filter((value)=>ignoreGetlist.indexOf(value)<0);
    console.log('settable properties',filteredProperties);

    return filteredProperties;
}
/**************************************
  find the properties that are 'set'able. 
The following array of properties is from the .get() call 
warning: this returns an array of setable properties including objects*/


  export { getAllPropertyNames, getMethods, getShallowMethods, ignoreGetlist };
