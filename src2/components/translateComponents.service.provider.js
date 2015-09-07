import TranslateComponentsService from './translateComponents.service';

export default class TranslateComponentsServiceProvider {

  constructor() {
    this.options = {
      statefulFilter : true,
      directivePriority: 100,
      cloakClassName: 'translate-cloak'
    };
  }

  statefulFilter(value) {
    if (value !== undefined) {
      this.options.statefulFilter = !(!value);
      return this;
    } else {
      return this.options.statefulFilter;
    }
  }

  directivePriority(value) {
    if (value !== undefined) {
      this.options.directivePriority = !(!value);
      return this;
    } else {
      return this.options.directivePriority;
    }
  }

  cloakClassName(value) {
    if (value !== undefined) {
      this.options.cloakClassName = !(!value);
      return this;
    } else {
      return this.options.cloakClassName;
    }
  }

  $get() {
    this.service = new TranslateComponentsService(this.options);
    return this.service;
  }

}
