/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translateCloak
 * @requires $rootScope
 * @requires $translate
 * @restrict A
 *
 * $description
 * Adds a `translate-cloak` class name to the given element where this directive
 * is applied initially and removes it, once a loader has finished loading.
 *
 * This directive can be used to prevent initial flickering when loading translation
 * data asynchronously.
 *
 * The class name is defined in
 * {@link pascalprecht.translate.$translateProvider#cloakClassName $translate.cloakClassName()}.
 *
 * @param {string=} translate-cloak If a translationId is provided, it will be used for showing
 *                                  or hiding the cloak. Basically it relies on the translation
 *                                  resolve.
 */
const TranslateCloakDirective = ($rootScope, translateComponents, translate) => {
  return {
    compile : (element) => {
      let applyCloak = () => {
        element.addClass(translateComponents.cloakClassName());
      };
      let removeCloak = () => {
        element.removeClass(translateComponents.cloakClassName());
      };
      let removeListener = $rootScope.$on('$translateChangeEnd', () => {
        removeCloak();
        removeListener();
        removeListener = null;
      });
      let linker = (scope, _, attr) => {
        if (attr.translateCloak && attr.translateCloak.length) {
          attr.$observe('translateCloak', (translationId) => {
            translate.async(translationId)
              .then(removeCloak, applyCloak);
          });
        }
      };

      applyCloak();

      return linker;
    }
  };
};

export default TranslateCloakDirective;
