/**
 * Nodes Image Preloader
 * @version v1.0.0 - 2015-05-20
 * @link http://nodes.dk
 * @author Tommy Jepsen
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function () {
	'use strict';

	angular.module('nImagePreloader', []);

})();

angular.module('nImagePreloader').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('nImagePreloader.template.html',
    "<div ng-show=\"isLoading\" class=\"n-image-spinner {{extraLoadingClasses}}\" id=\"spinner-{{source}}\">Loading..</div>\n" +
    "<img ng-hide=\"isLoading\" src=\"\" id=\"n-image-preloader-{{source}}\" class=\"n-image-preloader {{extraClasses}}\">"
  );

}]);
