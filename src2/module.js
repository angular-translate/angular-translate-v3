import {MODULE_NAME_PREFIX} from './config';

export default angular

  .module(`${MODULE_NAME_PREFIX}`, [
    require('./core'),
    require('./components'),
    require('./compat')
  ])

  .name;
