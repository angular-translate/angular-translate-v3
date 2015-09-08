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

  directiveIsolatedScope() {
    return this.options.directiveIsolatedScope;
  }

  cloakClassName() {
    return this.options.cloakClassName;
  }

}
