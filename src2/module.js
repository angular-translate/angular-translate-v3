import {MODULE_NAME_BASE} from './config';

export default angular

  .module(`${MODULE_NAME_BASE}`, [
    require('./core'),
    require('./components'),
    require('./compat')
  ])

  .name;
