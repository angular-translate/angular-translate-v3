import Request from './../../support/Request';

export default class LinkStrategy {

  buildAlternativeRequest(response) {
    if (response.success && response.translation[0] === '@') {
      return new Request({
        language : response.request.language,
        key : response.translation.substring(1),
        interpolationParams : response.request.interpolationParams,
        interpolationId : response.request.interpolationId
      });
    }
  }

}
