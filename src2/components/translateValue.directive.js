const TranslateValueDirective = ($rootScope, $q, $interpolate, $compile, $parse, translateComponents, translate) => {

  return {
    restrict: 'AE',

    priority: translateComponents.directivePriority(),

    link: {
      pre: () => {

      },
      post: (scope, iElement, iAttr) => {
        iAttr.$observe('translate', (translationId) => {
          if (typeof translationId === 'undefined') {
            // case of element "<translate>xyz</translate>"
            observeElementTranslation('');
          } else {
            // case of regular attribute
            if (translationId !== '' || !firstAttributeChangedEvent) {
              translationIds.translate = translationId;
              updateTranslations();
            }
          }
        });
      }
    },

    compile: (tElement, tAttr) => {

    },

    controller: () => {

    }
  };

};

export default TranslateValueDirective;
