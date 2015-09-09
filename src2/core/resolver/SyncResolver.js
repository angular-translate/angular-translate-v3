import BaseResolver from './BaseResolver';
import Request from './../support/Request';

export default class SyncResolver extends BaseResolver {

  constructor(repository) {
    super();
    this.repository = repository;
  }

  resolve(requests) {
    // translate
    return requests
      .map((request) => this.repository.getByKeyNow(request))

      // resolve links
      .map((response) => {
        let alternativeResponse = this.resolveOnError(response);
        if (alternativeResponse) {
          return alternativeResponse;
        }
        return response;
      })

      // apply interpolated params
      .map((response) => {
        if (response.success) {
          return this.applyInterpolatedParams(response);
        }
        return response;
      })

      // escape sanitize
      .map((response) => {
        if (response.success) {
          // TODO escape/sanitize
        }
        return response;
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
