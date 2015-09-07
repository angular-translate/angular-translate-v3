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
        if (response.success && response.translation[0] === '@') {
          return this.resolve(new Request({
            language : response.request.language,
            key : response.translation.substring(1),
            interpolationParams : response.request.interpolationParams,
            interpolationId : response.request.interpolationId
          }));
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
}
