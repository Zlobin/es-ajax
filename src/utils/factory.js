import FetchDriver from '../driver/fetch.js';
import XhrDriver from '../driver/xhr.js';

export default function factory(type, url, request, headers) {
  return type === 'fetch' ?
    new FetchDriver(url, request, headers) :
    new XhrDriver(url, request, headers);
}
