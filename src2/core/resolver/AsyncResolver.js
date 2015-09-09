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
            let alternativeResponse = this.resolveOnError(response);
            if (alternativeResponse) {
              return alternativeResponse;
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

  resolveOnError(response) {
    for (let strategy of this.alternativeStrategies) {
      let request = strategy.buildAlternativeRequest(response);
      if (request) {
        return this.resolve(request);
      }
    }
  }

}
