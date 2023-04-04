export const isObjEmpty = (obj) =>
  obj === {} || Object.values(obj).filter((val) => val !== "").length === 0;

export const mergeObjectsFromTo = (obj1, obj2) => {
  const updatedObj2 = { ...obj2 };
  if (obj1 === {}) return updatedObj2;

  Object.entries(obj1).forEach(([key, value]) => {
    updatedObj2[key] = value;
  });
  return updatedObj2;
};

export const firstKey = (obj) => Object.keys(obj)[0];
