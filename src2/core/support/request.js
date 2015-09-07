export default class Request {

  constructor({language, key, interpolationParams, interpolationId}) {
    this._language = language;
    this._key = key;
    this._interpolationParams = interpolationParams;
    this._interpolationId = interpolationId;
  }

  get language() {
    return this._language;
  }

  get key() {
    return this._key;
  }

  get interpolationParams() {
    return this._interpolationParams;
  }

  get interpolationId() {
    return this._interpolationId;
  }

}
