import Response from './../support/Response';
import UniformDataMapper from './UniformTranslationsReader';
import LoaderConfig from './../loader/LoaderConfig';
import LoaderManager from './../loader/LoaderManager';

export default class Repository {

  constructor($q, $log, $injector, scopeEmitter, loader, loaderOptions) {
    this.$q = $q;
    this.$log = $log;
    this.$injector = $injector;

    this.scopeEmitter = scopeEmitter;
    this.uniformDataMapper = new UniformDataMapper();
    this.loaderManager = new LoaderManager($q, $injector, $log, this.scopeEmitter);
    this.loaderManager.setLoader(new LoaderConfig(loader, loaderOptions));

    this.translations = {};
    this.waiters = {};
    this.processedLanguages = {};
  }

  presetTranslations(translations) {
    Object.keys(translations)
      .map((language) => {
        return this.uniformDataMapper.uniform(language, translations[language], {preset : true})
      })
      .forEach((entry) => {
        this.translations[entry.language] = entry;
      });
  }

  setLoader(loader, options) {
    this.loaderManager.setLoader(new LoaderConfig(loader, options));
  }

  getByKeyNow(request) {
    //this.$log.debug(`Repository::getByKeyNow('${request.language}', '${request.key}')`);
    let entry = this.translations[request.language];
    let _translation;
    if (entry && request.key !== undefined) {
      _translation = entry.translations[request.key];
    }
    if (_translation !== undefined && request.key !== '') {
      //this.$log.debug(`Repository::getByKeyNow('${request.language}', '${request.key}') => SUCCESS`);
      return new Response({
        request : request,
        success : true,
        translation : _translation
      });
    } else {
      //this.$log.debug(`Repository::getByKeyNow('${request.language}', '${request.key}') => FAIL`);
      return new Response({
        request : request,
        success : false,
        translation : undefined
      });
    }
  }

  getByKey(request) {
    //this.$log.debug(`Repository::getByKey('${request.language}', '${request.key}')`);
    let requestLanguage = request.language;

    // will wait for loading just at the moment..
    return (this.waiters[requestLanguage] || this.$q.resolve())
      .then(() => {
        return this.$q((resolve, reject) => {
          let entry = this.translations[requestLanguage];

          if (entry !== undefined) {
            // translations for this language has been found
            if (request.key !== undefined && request.key !== '') {
              //this.$log.debug(`Repository::getByKey('${request.language}', '${request.key}') => SUCCESS`);
              resolve(new Response({
                request : request,
                success : true,
                translation : entry.translations[request.key]
              }));
            } else {
              //this.$log.debug(`Repository::getByKey('${request.language}', '${request.key}') => FAIL`);
              reject(new Response({
                request : request,
                success : false,
                translation : undefined
              }))
            }

          } else if (this.processedLanguages[requestLanguage] === undefined) {
            // translations not found, because it has been not loaded yet
            this.invokeLanguageLoad(requestLanguage)
              .then(() => {
                // loaded, try again to resolve
                this.getByKey(request)
                  .then(resolve, reject);
              })
              .catch(() => {
                // loading translations failed, reject anyway
                //this.$log.debug(`Repository::getByKey('${request.language}', '${request.key}') => FAIL`);
                reject(new Response({
                  request : request,
                  success : false,
                  translation : undefined
                }))
              });

          } else {
            // translations not found, but this language has been processed already
            //this.$log.debug(`Repository::getByKey('${request.language}', '${request.key}') => FAIL`);
            reject(new Response({
              request : request,
              success : false,
              translation : undefined
            }))
          }
        });
      });
  }

  refresh({ignorePresets = true} = {}) {
    // collect all well-known languages
    let refreshableLanguages = Object.keys(this.translations);
    Object.keys(this.processedLanguages)
      .filter((language) => refreshableLanguages.indexOf(language) < 0)
      .forEach((language) => refreshableLanguages.push(language));
    // re-check presets
    if (ignorePresets) {
      refreshableLanguages = refreshableLanguages
        .filter((language) => {
          let entry = this.translations[language];
          if (!entry) {
            return true;
          }
          return !entry.options.preset;
        });
    }

    return this.$q.all(
      refreshableLanguages
        .map((language) => {
          // transform each loading process into a valueless promise
          return this.$q((resolve) => {
            // request reload of specified language, but remove the actual translations only just before applying the new ones
            this.scopeEmitter.emit('translate::refresh-language start', {language});
            this.invokeLanguageLoad(language, () => delete this.translations[language])
              .then(() => {
                this.scopeEmitter.emit('translate::refresh-language end', {language, success : true});
                resolve();
              })
              .catch(() => {
                this.scopeEmitter.emit('translate::refresh-language end', {language, success : false});
                resolve();
              });
          });
        })
    );
  }

  ensureLanguageExist(requestedLanguage) {
    this.scopeEmitter.emit('translate::ensure-language start', {language : requestedLanguage});
    let promise = this.$q((resolve, reject) => {
      if (this.waiters[requestedLanguage]) {
        // Loading already in progress, just wait for it
        this.waiters[requestedLanguage]
          .then(({language}) => resolve({language}))
          .catch(({language}) => reject({language}))
      } else if (this.translations[requestedLanguage]) {
        // Data already exist
        resolve({language : requestedLanguage})
      } else {
        this.invokeLanguageLoad(requestedLanguage)
          .then(({language}) => resolve({language}))
          .catch(({language}) => reject({language}));
      }
    });
    promise.then(({language}) => {
      this.scopeEmitter.emit('translate::ensure-language end', {language : requestedLanguage, success : true});
    });
    promise.catch(({language}) => {
      this.scopeEmitter.emit('translate::ensure-language end', {language : requestedLanguage, success : false});
    });
    return promise;
  }

  invokeLanguageLoad(language, onBeforeApply = undefined) {
    if (!this.waiters[language]) {
      this.waiters[language] = this.$q((resolve, reject) => {
        // Delegate the loading..
        this.scopeEmitter.emit('translate::translations-load start', {language});
        this.loaderManager
          .process(language)
          .then(({response}) => {
            let entry = this.uniformDataMapper.uniform(language, response, {loader : true});
            if (typeof onBeforeApply === 'function') {
              onBeforeApply(entry);
            }
            this.translations[language] = entry;
            this.scopeEmitter.emit('translate::translations-load end', {language, success : true});
            resolve({language});
          })
          .catch(() => {
            this.scopeEmitter.emit('translate::translations-load end', {language, success : false});
            reject({language});
          })
          .finally(() => {
            // clean up: remove reference for promise
            delete this.waiters[language];
            // mark this language as being processed (regardless of state)
            this.processedLanguages[language] = new Date().getTime();
          });
      });
    }
    return this.waiters[language];
  }

}
