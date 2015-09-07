export default class LoaderConfig {

  constructor(loader, options) {
    this._loader = loader;
    this._options = options;
  }

  get loader() {
    return this._loader;
  }

  get options() {
    return this._options;
  }

}
