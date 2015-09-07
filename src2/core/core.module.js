import {MODULE_NAME_BASE} from './../config';

import TranslateServiceProvider from './translate.service.provider';
import TranslateHttpLoaderService from './translateHttpLoader.service';

export default angular

  .module(`${MODULE_NAME_BASE}.core`, [
    'ng'
  ])

  .provider('translate', TranslateServiceProvider)

  .service('translateHttpLoader', TranslateHttpLoaderService)

  .name;
