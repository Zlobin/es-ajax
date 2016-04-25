// Transform a string, getting from getAllResponseHeaders to the object.
export default function asObject(headers) {
  const response = {};

  if (headers !== null) {
    headers
      .split('\n')
      .forEach(headerAsString => {
        const header = headerAsString.split(': ');

        if (header.length === 2) {
          response[header[0].trim()] = header[1].trim();
        }
      });
  }

  return response;
}
