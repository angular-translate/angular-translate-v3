export default class TranslationsEntry {

  constructor(language) {
    this._language = language;
    this._created = new Date();
  }

  withTranslations(translations) {
    this._translations = translations;
    return this;
  }

  withOptions(options) {
    this._options = options;
    return this;
  }

  withMeta(meta) {
    this._meta = meta;
    return this;
  }

  get language() {
    return this._language;
  }

  get translations() {
    return this._translations;
  }

  get options() {
    return this._options;
  }

  get meta() {
    return this._meta;
  }

  get created() {
    return this._created;
  }

}
