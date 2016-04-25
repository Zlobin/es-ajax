import FetchAPI from '../api/fetch.js';
import XhrAPI from '../api/xhr.js';

export default function factory(type, url, request, headers) {
  return type === 'fetch' ?
    new FetchAPI(url, request, headers) :
    new XhrAPI(url, request, headers);
}
