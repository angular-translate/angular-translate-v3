import TranslateComponentsService from './translateComponents.service';

export default class TranslateComponentsServiceProvider {

  /* @ngInject */
  constructor() {
    this.options = {
      extendHtmlStandardElements : true,
      statefulFilter : true,
      directivePriority : 100,
      directiveIsolatedScope : false,
      cloakClassName : 'translate-cloak'
    };
  }

  extendHtmlStandardElements(value) {
    if (value !== undefined) {
      this.options.extendHtmlStandardElements = !(!value);
      return this;
    } else {
      return this.options.extendHtmlStandardElements;
    }
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
      this.options.directivePriority = value;
      return this;
    } else {
      return this.options.directivePriority;
    }
  }

  directiveIsolatedScope(value) {
    if (value !== undefined) {
      this.options.directiveIsolatedScope = !(!value);
      return this;
    } else {
      return this.options.directiveIsolatedScope;
    }
  }

  cloakClassName(value) {
    if (value !== undefined) {
      this.options.cloakClassName = value;
      return this;
    } else {
      return this.options.cloakClassName;
    }
  }

  /* @ngInject */
  $get() {
    this.service = new TranslateComponentsService(this.options);
    return this.service;
  }

}
