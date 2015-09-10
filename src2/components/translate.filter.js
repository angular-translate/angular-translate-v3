/* @ngInject */
const TranslateFilterFactory = ($parse, translateComponents, translate) => {

  let translateFilter = function (translationId, interpolateParams, interpolation) {

    if (!angular.isObject(interpolateParams)) {
      interpolateParams = $parse(interpolateParams)(this);
    }

    return translate.sync(translationId, interpolateParams, interpolation) || '';
  };

  if (translateComponents.statefulFilter()) {
    translateFilter.$stateful = true;
  }

  return translateFilter;
};

/* @ngInject */
TranslateFilterFactory.onExtendOnly = ($parse, translateComponents, translate) => {
  if (translateComponents.extendHtmlStandardElements()) {
    return TranslateFilterFactory($parse, translateComponents, translate);
  } else {
    return {};
  }
};

export default TranslateFilterFactory;
