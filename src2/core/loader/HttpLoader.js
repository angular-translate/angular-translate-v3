export default class HttpLoader {

  constructor($q, $http, $log) {
    this.$q = $q;
    this.$http = $http;
    this.$log = $log;
  }

  load(options) {

    if (!options.files) {
      options.files = [{
        prefix : options.prefix,
        suffix : options.suffix,
        queryParameter : options.queryParameter,
        url : options.url
      }];
    }

    return this.$q((resolve, reject) => {
      this.$q.all(
        options.files
          .map((file) => {
            return this.loadFile({
              url : file.url,
              prefix : file.prefix,
              key : options.key,
              suffix : file.suffix,
              queryParameter : file.queryParameter,
              $http : options.$http
            });
          })
      )
        .then((responses) => {
          let mergedResponse = {};
          Object.keys(responses)
            .map((i) => responses[i])
            .forEach((response) => {
              for (let key of Object.keys(response)) {
                mergedResponse[key] = response[key];
              }
            });
          resolve(mergedResponse);
        })
        .catch(() => reject(options.key));
    });
  }

  loadFile(options) {
    return this.$q((resolve, reject) => {

      let url;
      let urlParams = {};
      if (options.url) {
        url = options.url;
        if (options.queryParameter) {
          urlParams[options.queryParameter || 'lang'] = options.key;
        }
      } else {
        url = `${options.prefix || ''}${options.key}${options.suffix || ''}`;
      }

      let request = angular.extend({
        url : url,
        method : 'GET',
        params : urlParams
      }, options.$http);

      this.$http(request)
        .then(({data}) => resolve(data))
        .catch(() => reject(options.key));
    });
  }

}
