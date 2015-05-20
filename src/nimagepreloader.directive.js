(function() {
	'use strict';

	angular
		.module('nImagePreloader')
	  	.directive('nImagePreloader', nImagePreloader);

	/* @ngInject */
	function nImagePreloader($q) {
		/**
		 * @ngdoc directive
		 * @name nImagePreloader
		 * @description - Use n-image-preloader source="mediaAgreements.img" width="200"
		 * # nImagePreloader
		 */
		var directive = {

			templateUrl: 'nImagePreloader.template.html',
			link: link,
			scope: {
				source: '@',
				extraLoadingClasses: '@',
				extraClasses: '@',
			},
			restrict: 'EA'
		};

		return directive;

		function link(scope, element, attrs){

			// Le Defaults
			var imageInfo = {
				src: '',
				width: '',
				height: '',
				showImage: true
			};
			scope.isLoading = true;

			// Angular interpolater først efter link funktionen desværre. Så vi holder bare øje!
			scope.$watch('source', function(newSource) {
				if(!newSource || newSource === 'undefined') {
					return;
				}

				init();
			});

			function init() {

				imageInfo.src = scope.source;
				imageInfo.width = attrs.width ? attrs.width : 'auto';
				imageInfo.height = attrs.height ? attrs.height : 'auto';

				loadImage().then(function(result) {

					var item = document.getElementById('n-spinner-' + scope.source);
					var image = document.getElementById('n-image-preloader-' + scope.source);

					//hide spinner before digest is over
					if(item != undefined) {
						item.style.display = 'none';
					}

					scope.isLoading = false;

					element.append(result);

					//Append styles after image is loaded, else risk it blinking a short moment
					image.style.display = 'inline-block';
					image.style.height = imageInfo.height;
					image.style.width = imageInfo.width;

				}, function(result) {
					scope.isLoading = false;
				});
			}

			//Loading image
			function loadImage() {
				var deferred = $q.defer();

				var image = document.getElementById('n-image-preloader-' + scope.source);
				image.src = imageInfo.src;

				image.onload = function() {
					deferred.resolve(image);
				};

				image.onerror = function() {
					deferred.resolve("");
				};

				image.onabort = function() {
					deferred.resolve("");
				};

				imageInfo.showImage = true;

				return deferred.promise;
			}

		};
	};
})();
