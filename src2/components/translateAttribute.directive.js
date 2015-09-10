/* @ngInject */
const TranslateAttributeDirective = ($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate) => {
  return {};
};

/* @ngInject */
TranslateAttributeDirective.onExtendOnly = ($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate) => {
  if (translateComponents.extendHtmlStandardElements()) {
    return TranslateAttributeDirective($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate);
  } else {
    return {};
  }
};

export default TranslateAttributeDirective;
