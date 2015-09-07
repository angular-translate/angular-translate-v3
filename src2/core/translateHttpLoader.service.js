import HttpLoader from './loader/HttpLoader';

export default class TranslateHttpLoaderService {

  constructor($q, $http, $log) {
    this.target = new HttpLoader($q, $http, $log);
  }

  load(options) {
    return this.target.load(options);
  }

}
