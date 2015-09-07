import TranslateService from './translate.service';

export default class TranslateServiceProvider {

  constructor() {
    this.options = {};
    this.presetTranslations = {};
  }

  preferLanguage(language) {
    this.options.preferredLanguage = language;
    if (this.service) {
      this.service.preferLanguage(language);
    }
    return this;
  }

  useLoader(loader, options) {
    this.options.loader = loader;
    this.options.loaderOptions = options;
    return this;
  }

  translations() {
    return new StaticTranslationsBuilder(this, (language, data) => {
      this.presetTranslations[language] = data;
    });
  }

  useStaticFilesLoader(options) {
    let loaderOptions = {prefix : options.prefix, suffix : options.suffix};
    return this.useLoader('translateHttpLoader', loaderOptions);
  }

  useMultipleStaticFilesLoader(...options) {
    let loaderOptions = options
      .map((item) => {
        return {files : {prefix : item.prefix, suffix : item.suffix}};
      });
    return this.useLoader('translateHttpLoader', loaderOptions);
  }

  useDynamicUrlLoader(options) {
    let loaderOptions = {url : options.url, queryParameter : options.queryParameter};
    return this.useLoader('translateHttpLoader', loaderOptions);
  }

  useMultipleDynamicUrlLoader(...options) {
    let loaderOptions = options
      .map((item) => {
        return {files : {url : item.url, queryParameter : item.queryParameter}};
      });
    return this.useLoader('translateHttpLoader', loaderOptions);
  }

  $get($rootScope, $q, $log, $injector) {
    return new TranslateService($rootScope, $q, $log, $injector, this.options, this.presetTranslations);
  }
}

class StaticTranslationsBuilder {

  constructor(scope, onData) {
    this.scope = scope;
    this.onData = onData;
  }

  add(language, translations) {
    this.onData(language, translations);
    return this;
  }

  end() {
    return this.scope;
  }

}
