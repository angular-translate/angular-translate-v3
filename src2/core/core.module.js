import {MODULE_NAME_PREFIX} from './../config';

import TranslateServiceProvider from './translate.service.provider';
import TranslateHttpLoaderService from './translateHttpLoader.service';

export default angular

  .module(`${MODULE_NAME_PREFIX}.core`, [
    'ng'
  ])

  .provider('translate', TranslateServiceProvider)

  .service('translateHttpLoader', TranslateHttpLoaderService)

  .name;
