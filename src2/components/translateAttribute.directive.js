const TranslateAttributeDirective = ($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate) => {
  return {};
};

TranslateAttributeDirective.onExtendOnly = ($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate) => {
  if (translateComponents.extendHtmlStandardElements()) {
    return TranslateAttributeDirective($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate);
  } else {
    return {};
  }
};

export default TranslateAttributeDirective;
