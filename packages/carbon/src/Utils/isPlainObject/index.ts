const funcToString = Function.prototype.toString;
const objectCtorString = funcToString.call(Object);
const isObjectLike = (value: any) =>
  typeof value === "object" && value !== null;
const objectProto = Object.prototype;
const hasOwnProperty = objectProto.hasOwnProperty;
const toString = objectProto.toString;
const symToStringTag =
  typeof Symbol !== "undefined" ? Symbol.toStringTag : undefined;
function baseGetTag(value: any) {
  if (value === null) {
    return value === undefined ? "[object Undefined]" : "[object Null]";
  }
  if (!(symToStringTag && symToStringTag in Object(value))) {
    return toString.call(value);
  }
  const isOwn = hasOwnProperty.call(value, symToStringTag);
  const tag = value[symToStringTag];
  let unmasked = false;
  try {
    value[symToStringTag] = undefined;
    unmasked = true;
  } catch (e) {}
  const result = toString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
function isPlainObject(value: any) {
  if (!isObjectLike(value) || baseGetTag(value) !== "[object Object]") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor === "function" &&
    Ctor instanceof Ctor &&
    funcToString.call(Ctor) === objectCtorString
  );
}
export default isPlainObject;
