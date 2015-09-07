class $translateServiceProvider {

  constructor() {
  }

  use(language) {
    if (language) {
      this.preferredLanguage = language;
      return this;
    } else {
      return this.preferredLanguage;
    }
  }

  $get($log, translate, translateComponents) {

    $log.warn('angular-translate: Legacy/compatibility mode is ACTIVE!');

    let service = function (key, interpolationParams, interpolationId) {
      return translate.async(key, interpolationParams, interpolationId);
    };
    service.instant = (key, interpolationParams, interpolationId) => {
      return translate.sync(key, interpolationParams, interpolationId);
    };
    service.use = (language) => {
      translate.preferLanguage(language);
    };
    service.refresh = () => {
      return translate.refresh();
    };

    // TODO more

    service.use(this.preferredLanguage);

    return service;
  }
}

export default angular

  .module('ng-translate.compat', ['ng-translate'])

  .provider('$translate', $translateServiceProvider)

  .name;
