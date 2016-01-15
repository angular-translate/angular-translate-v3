export default class Response {

  constructor({request, success, translation}) {
    this._request = request;
    this._success = success;
    this._translation = translation;
    this._meta = {};
  }

  get success() {
    return this._success;
  }

  get request() {
    return this._request;
  }

  get translation() {
    return this._translation;
  }

  get meta() {
    return this._meta;
  }

}
