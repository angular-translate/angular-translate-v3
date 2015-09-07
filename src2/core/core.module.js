import TranslateServiceProvider from './translate.service.provider';
import TranslateHttpLoaderService from './translateHttpLoader.service';

export default angular

  .module('ng-translate.core', [
    'ng'
  ])

  .provider('translate', TranslateServiceProvider)

  .service('translateHttpLoader', TranslateHttpLoaderService)

  .name;
