import Context from './../support/Context';
import Request from './../support/Request';

export default class AsyncProvider {

  constructor(context, resolver) {
    this.context = context;
    this.resolver = resolver;
  }

  getActiveLanguage() {
    return this.context.language;
  }

  provide(key, interpolationParams, interpolationId) {
    return this.provideByLanguage(this.context.language, key, interpolationParams, interpolationId);
  }

  provideByLanguage(language, key, interpolationParams, interpolationId) {
    let single = !angular.isArray(key);
    let keys = [].concat(key);
    let result = this.resolver.resolve(
      keys.map((key) => new Request({
        language : language,
        key : key,
        interpolationParams : interpolationParams,
        interpolationId : interpolationId
      }))
    );
    return single ? result[0] : result;
  }

  withLanguage(language) {
    return new AsyncProvider(new Context({language}), this.resolver);
  }

}
