import {MODULE_NAME_BASE} from './../config';

class $translateServiceProvider {

  /* @ngInject */
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

  /* @ngInject */
  $get($log, translate, translateComponents) {

    $log.warn(`${MODULE_NAME_BASE}: Legacy/compatibility mode is ACTIVE!`);

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

  .module(`${MODULE_NAME_BASE}.compat`, [
    `${MODULE_NAME_BASE}`
  ])

  .provider('$translate', $translateServiceProvider)

  .name;
