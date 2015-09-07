export default class LoaderManager {

  constructor($q, $injector, $log, scopeEmitter) {
    this.$q = $q;
    this.$injector = $injector;
    this.$log = $log;
    this.scopeEmitter = scopeEmitter;
  }

  setLoader(config) {
    this.config = config;
  }

  process(language) {
    return this.$q((resolve, reject) => {
      // Build loader options
      let loaderOptions = angular.extend({}, this.config.options, {
        key : language,
        $http : angular.extend({}, {
          cache : undefined//FIXMEcache
        }, this.config.options.$http)
      });

      // Start loading..
      this.scopeEmitter.emit('translate::request-load start', {language});
      let loader = this.resolveLoader();
      let loaderPromise;
      if (typeof loader === 'object' && typeof loader.load === 'function') {
        // loader is an object w/ a method load
        loaderPromise = loader.load(loaderOptions);
      } else if (typeof loader === 'function') {
        // loader is a function itself
        loaderPromise = loader(loaderOptions);
      } else {
        this.$log.warn(`angular-translate: The specified loader has no method 'load()' or is not itself a function.`);
        loaderPromise = this.$q.reject({language});
      }

      // Process loading result
      loaderPromise
        .then((response) => {
          this.scopeEmitter.emit('translate::request-load end', {language, success : true});
          resolve({language, response});
        })
        .catch(() => {
          this.scopeEmitter.emit('translate::request-load end', {language, success : false});
          reject({language});
        });
    });
  }

  resolveLoader() {
    console.log(this.config);
    var newVar = this.$injector.get(this.config.loader);
    console.log(newVar);
    return newVar;
  }

}
