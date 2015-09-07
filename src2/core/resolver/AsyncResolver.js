import BaseResolver from './BaseResolver';
import Request from './../support/Request';

export default class AsyncResolver extends BaseResolver {

  constructor(repository) {
    super();
    this.repository = repository;
  }

  resolve(requests) {
    // translate
    return requests
      .map((request) => this.repository.getByKey(request))

      // resolve links
      .map((promise) => {
        return promise
          .then((response) => {
            if (response.success && response.translation[0] === '@') {
              return this.resolve(new Request({
                language : response.request.language,
                key : response.translation.substring(1),
                interpolationParams : response.request.interpolationParams,
                interpolationId : response.request.interpolationId
              }));
            }
            return response;
          });
      })

      // apply interpolated params
      .map((promise) => {
        return promise
          .then((response) => {
            if (response.success) {
              return this.applyInterpolatedParams(response);
            }
            return response;
          });
      })

      // escape sanitize
      .map((promise) => {
        return promise
          .then((response) => {
            if (response.success) {
              // TODO escape/sanitize
            }
            return response;
          });
      });
  }

}
