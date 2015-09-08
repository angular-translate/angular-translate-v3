import {MODULE_NAME_BASE} from './../config';

import TranslateComponentsServiceProvider from './translateComponents.service.provider';

import TranslateAttributeDirective from './translateAttribute.directive';
import TranslateCloakDirective from './translateCloak.directive';
import TranslateValueDirective from './translateValue.directive';
import TranslateFilterFactory from './translate.filter';

export default angular

  .module(`${MODULE_NAME_BASE}.components`, [
    `${MODULE_NAME_BASE}.core`
  ])

  // Configurer for components
  .provider('translateComponents', TranslateComponentsServiceProvider)

  // Standard directive for translating values
  .directive('ppTranslate', TranslateValueDirective)
  .directive('translate', TranslateValueDirective.onExtendOnly)

  // Directive for a cloak (until translations are ready)
  .directive('ppTranslateCloak', TranslateCloakDirective)
  .directive('translateCloak', TranslateCloakDirective.onExtendOnly)

  // Directive for translating element's attributes
  .directive('ppTranslateAttr', TranslateAttributeDirective)
  .directive('translateAttr', TranslateAttributeDirective.onExtendOnly)

  // Standard filter
  .filter('ppTranslate', TranslateFilterFactory)
  .filter('translate', TranslateFilterFactory.onExtendOnly)

  .name;
