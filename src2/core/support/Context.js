export default class Context {

  constructor({language}) {
    this._language = language;
    this._created = new Date();
  }

  get language() {
    return this._language;
  }

  get created() {
    return this._created;
  }

}
