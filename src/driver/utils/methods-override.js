// Some servers didn't allow to send put, delete... http methods.
// It should be overridden.
export default function methodsOverride(methodName) {
  if (typeof methodName !== 'string') {
    throw new TypeError('"methodName" variable must be a string.');
  }

  return {
    'X-HTTP-Method': methodName, // IE
    'X-HTTP-Method-Override': methodName, // Chrome
    'X-Method-Override': methodName // IBM
  };
}
