function resolveInterface(status, response, headers) {
  return {
    status,
    response,
    headers
  };
}

const rejectInterface = resolveInterface;

export { resolveInterface, rejectInterface };
