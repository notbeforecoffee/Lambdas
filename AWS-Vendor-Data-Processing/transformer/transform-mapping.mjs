
  //transforming the created json file to have headings listed in the mapping file
export const transform = (json, mapping) => {

  json.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      //if vendor provides other columns than the ones we want, ignore them
      if(!mapping.hasOwnProperty(key) || !obj[key]){
        //deleting any keys that are not present in our mapping file 
          delete obj[key];
      }else{
        //rename the property to match the key specified in the mapping file
        renameKey(obj, key, mapping[key]);
      }
    });
  });
  console.log("transformed ", json);
  return json;
};

const renameKey = (obj, oldKey, newKey) => {
  if (newKey && oldKey !== newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
    updateArrayNodes(obj, newKey);
    return;
  }

  updateArrayNodes(obj, oldKey);
};

//creating arrays from the supplied urls
const updateArrayNodes = (obj, key) => {
  if (key === "imageURLs" || key === "lifeStyleImageURLs") {
    obj[key] = obj[key].split(",");
  }
};
