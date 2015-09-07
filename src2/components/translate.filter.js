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

export default TranslateFilterFactory;
