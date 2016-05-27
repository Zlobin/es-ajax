// For using private properties in JS classes.
const privateMap = new WeakMap();

export default function internal(obj) {
  if (!privateMap.has(obj)) {
    privateMap.set(obj, {});
  }

  return privateMap.get(obj);
}
