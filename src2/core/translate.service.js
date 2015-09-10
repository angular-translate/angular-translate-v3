import Context from './support/Context';
import Repository from './repository/Repository';
import AsyncProvider from './provider/AsyncProvider';
import SyncProvider from './provider/SyncProvider';
import AsyncResolver from './resolver/AsyncResolver';
import SyncResolver from './resolver/SyncResolver';
import ScopeEmitter from './event/ScopeEmitter';

export default class TranslateService {

  /* @ngInject */
  constructor($rootScope, $q, $log, $injector, options, presetTranslations) {
    // internals
    this.initialLanguage = options.preferredLanguage || 'en';
    this.preferredLanguage = this.initialLanguage;
    // AJS dependencies
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.$injector = $injector;
    // internal dependencies
    this.context = new Context({
      language : this.preferredLanguage
    });
    this.scopeEmitter = new ScopeEmitter($rootScope);
    this.repository = new Repository(this.$q, this.$log, this.$injector, this.scopeEmitter, options.loader, options.loaderOptions);
    this.repository.presetTranslations(presetTranslations);
    this.syncResolver = new SyncResolver(this.repository);
    this.asyncResolver = new AsyncResolver(this.repository);
    this.syncProvider = new SyncProvider(this.context, this.syncResolver);
    this.asyncProvider = new AsyncProvider(this.context, this.asyncResolver);

    this.preferLanguage(this.preferredLanguage);
  }

  applyContext(context) {
    this.context = context;
    this.syncProvider = new SyncProvider(context, this.syncResolver);
    this.asyncProvider = new AsyncProvider(context, this.asyncResolver);
    this.scopeEmitter.emit('translate::language-changed', {language : context.language});
  }

  getActiveLanguage() {
    return this.context.language;
  }

  sync(key, interpolationParams, interpolationId) {
    return this.syncProvider.provide(key, interpolationParams, interpolationId).translation;
  }

  async(key, interpolationParams, interpolationId) {
    return this.asyncProvider.provide(key, interpolationParams, interpolationId)
      .then((response) => {
        return response.translation;
      });
  }

  setLoader(loader, loaderOptions) {
    this.repository.setLoader(loader, loaderOptions);
  }

  // sub facade
  withLanguage(language) {
    return new ProviderFacade(language, this.syncProvider, this.asyncProvider);
  }

  refresh() {
    return this.$q((resolve, reject) => {
      this.repository
        .refresh()
        .then(() => {
          resolve(this.context);
        })
        .catch(() => {
          reject();
        });
    });
  }

  preferLanguage(requestedLanguage) {
    this.scopeEmitter.emit('translate::prefer-language start', {language : requestedLanguage});
    return this.$q((resolve, reject) => {
      this.repository.ensureLanguageExist(requestedLanguage)
        .then(({language}) => {
          this.applyContext(new Context({language}));
          resolve(this.context);
          this.scopeEmitter.emit('translate::prefer-language end', {language : requestedLanguage, success : true});
        })
        .catch(() => {
          reject({language : requestedLanguage});
          this.scopeEmitter.emit('translate::prefer-language end', {language : requestedLanguage, success : false});
        });
    });
  }

}

class ProviderFacade {

  constructor(language, syncProvider, asyncProvider) {
    this.language = language;
    this.syncProvider = syncProvider.withLanguage(language);
    this.asyncProvider = asyncProvider.withLanguage(language);
  }

  sync(key, interpolationParams, interpolationId) {
    return this.syncProvider.provide(key, interpolationParams, interpolationId).translation;
  }

  async(key, interpolationParams, interpolationId) {
    return this.asyncProvider.provide(key, interpolationParams, interpolationId).translation;
  }

  withLanguage(language) {
    return new ProviderFacade(language, this.syncProvider, this.asyncProvider);
  }

}
