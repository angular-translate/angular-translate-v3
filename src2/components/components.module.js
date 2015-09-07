import {MODULE_NAME_PREFIX} from './../config';

import TranslateComponentsServiceProvider from './translateComponents.service.provider';

import TranslateAttributeDirective from './translateAttribute.directive';
import TranslateCloakDirective from './translateCloak.directive';
import TranslateValueDirective from './translateValue.directive';
import TranslateFilterFactory from './translate.filter';

export default angular

  .module(`${MODULE_NAME_PREFIX}.components`, [
    `${MODULE_NAME_PREFIX}.core`
  ])

  // Configurer for components
  .provider('translateComponents', TranslateComponentsServiceProvider)

  // Standard directive for translating values
  .directive('translate', TranslateValueDirective)

  // Directive for a cloak (until translations are ready)
  .directive('translateCloak', TranslateCloakDirective)

  // Directive for translating element's attributes
  .directive('translateAttr', TranslateAttributeDirective)

  // Standard filter
  .filter('translate', TranslateFilterFactory)

  .name;
