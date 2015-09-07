export default class TranslateComponentsService {

  constructor(options) {
    this.options = options;
  }

  statefulFilter() {
    return this.options.statefulFilter;
  }

  directivePriority() {
    return this.options.directivePriority;
  }

  cloakClassName() {
    return this.options.cloakClassName;
  }

}
