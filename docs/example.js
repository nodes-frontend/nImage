(function() {
	
	angular.module('demoApp', [
		'nDocs',
		'nImage'
	]);
	
	angular
		.module('demoApp')
		.controller('demoController', function() {
			var vm = this;
			
			vm.nodesCDNoptions = {
				loadingTemplateUrl: 'loading-test.html'
			};
			
			vm.imageOptions = {
				// fallbackImage: 'http://placehold.it/768x100/000000/ffffff&text=fallbackImage',
				loadingTemplateUrl: 'loading-test.html',
				// loadingTemplate: '<h1>Nedlaster...</h1>',
				disableLazy: false,
				nodesCDN: false,
				aspectRatio: '4-3'
			};
			
			vm.altText = 'My alt text defined in some controller';
			
			vm.images = [];
			vm.innerImages = [];
			
			vm.randomize = function() {
				vm.images = [];
				for(var i = 0; i < 100; i++) {
					var img = _generateRandomImage();
					vm.images.push(img);
				}
			};
			vm.randomizeInner = function() {
				vm.innerImages = [];
				for(var i = 0; i < 100; i++) {
					var img = _generateRandomImage();
					vm.innerImages.push(img);
				}
			};
			vm.randomize();
			vm.randomizeInner();
			
			function _generateRandomImage() {
				var color = Math.floor(Math.random()*16777215).toString(16);
				return 'http://placehold.it/800x600/' + color + '/ffffff';
			}
		});
	
})();