const TranslateValueDirective = ($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate) => {

  let initInterpolationParams = (scope, interpolateParams, $attrs, tElement, tAttrs) => {
    // initial setup
    if ($attrs.translateValues) {
      angular.extend(interpolateParams, $parse($attrs.translateValues)(scope.$parent));
    }
    // initially fetch all attributes if existing and fill the params
    if (tElement[0].outerHTML.match(/translate-value-+/i)) {
      for (let tAttr in tAttrs) {
        if (Object.prototype.hasOwnProperty.call($attrs, tAttr) && tAttr.substr(0, 14) === 'translateValue' && tAttr !== 'translateValues') {
          var attributeName = angular.lowercase(tAttr.substr(14, 1)) + tAttr.substr(15);
          interpolateParams[attributeName] = tAttrs[tAttr];
        }
      }
    }
  };

  return {

    restrict : 'AE',

    priority : translateComponents.directivePriority(),

    scope : translateComponents.directiveIsolatedScope() ? {} : undefined,

    compile : (tElement, tAttr) => {
      return (scope, element, attrs) => {
        const id = `${new Date().getTime()}_${Math.round(1000000 * Math.random())}`;
        scope[`translate_params_${id}`] = {};
        initInterpolationParams(scope, scope[`translate_params_${id}`], attrs, tElement, tAttr);
        attrs.$observe('translate', (value) => scope[`translate_value_${id}`] = value);

        let refreshTexts = () => {
          translate.async(scope[`translate_value_${id}`], scope[`translate_params_${id}`], undefined)
            .then((value) => element.html(value))
            .catch((key) => element.html(key))
        };
        scope.$watch(`translate_value_${id}`, refreshTexts);
        scope.$watch(`translate_params_${id}`, refreshTexts, true);
        let destroyRootScopeListener = $rootScope.$on('translate::language-changed', refreshTexts);
        scope.$on('$destroy', destroyRootScopeListener); // FIXME ensure this is really required
      };
    }
  };

};

TranslateValueDirective.onExtendOnly = ($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate) => {
  if (translateComponents.extendHtmlStandardElements()) {
    return TranslateValueDirective($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate);
  } else {
    return {};
  }
};

export default TranslateValueDirective;
