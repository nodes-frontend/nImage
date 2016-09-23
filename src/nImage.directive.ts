namespace component {
    'use strict';

    interface IComponentDirectiveScope {
        // event: any
        // data: any
        // isLoading: boolean
    }

    interface NImageOptions {
        fallbackImage: string,
        aspectRatio: string,
        loadingTemplateUrl: boolean,
        loadingTemplate: boolean,
        disableLazy: boolean,
        nodesCDN: boolean,
        offset: number
    }

    class nImage implements ng.IDirective {
        static $inject: Array<string> = [];

        // private $window: any;
        // private $q: any;
        // private $http: any;
        // private $timeout: any;
        // private $templateCache: any;

        /*constructor($window: ng.IWindowService,
                    $q: ng.IQService,
                    $http: ng.IHttpService,
                    $timeout: ng.ITimeoutService,
                    $templateCache: ng.ITemplateCacheService) {
            this.$window = $window;
            this.$q = $q;
            this.$http = $http;
            this.$timeout = $timeout;
            this.$templateCache = $templateCache;
        }*/
        constructor() {}

        static instance(): ng.IDirective {
            return new nImage();
            // var directive = ($window: ng.IWindowService,
            //                    $q: ng.IQService,
            //                    $http: ng.IHttpService,
            //                    $timeout: ng.ITimeoutService,
            //                    $templateCache: ng.ITemplateCacheService) => nImage($window, $q, $http, $timeout, $templateCache);
            // directive.$inject = ['$window', '$q', '$http', '$timeout', '$templateCache'];
            // return directive;
        }

        bindToController: boolean = true;
        controller: nImageDirectiveController = nImageDirectiveController;
        controllerAs: string = 'nImage';
        restrict: string = 'EA';
        templateUrl: string = 'src/nImage.html';
        // scope: IComponentDirectiveScope = {
        //     isLoading: true
        // };
        link: (scope: ng.IScope, element: any, attrs: ng.IAttributes, ctrl: nImageDirectiveController) => void = this.linkFn;

        public linkFn(scope: ng.IScope, element: any, attrs: any, ctrl: any) {
            let allowedModes: string[] = ['crop', 'resize', 'fit'];
            let timeout, source, alt, width, height, aspectRatio, mode: string;

            let $wrapper: any;// = document.getElementById(attrs.nImageContainer.substring(1)) || ctrl.$window;
            if(attrs.nImageContainer) {
                $wrapper = document.getElementById(attrs.nImageContainer.substring(1));
            } else {
                $wrapper = ctrl.$window;
            }

            let $element: ng.IAugmentedJQuery = element;

            let loaded: boolean = false;

            let options: NImageOptions = {
                fallbackImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDEzMy41IDEwNC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMzMuNSAxMDQuNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48cGF0aCBmaWxsPSIjQjRCNEI0IiBkPSJNLTQ0LjQtMjAuMmMwIDQuNCAwIDcuNSAwIDExLjQgLTEzLjQgMi4yLTI3IDQuNS00MS43IDYuOSAzLjUgMjIuNSA3IDQ0LjIgMTAuNiA2Ny4yIDE2LjUtMi42IDMyLTUgNDcuNy03LjQgMSAxLjEgMiAyLjIgNC4xIDQuNSAwLjYtNC40IDEuMS03LjYgMS4zLTkuNiAtMTYuNiAyLjgtMzIuMyA1LjQtNTAgOC40IDQuMi05LjEgNy42LTE2LjUgMTEuMy0yNC40IDMuMyAxLjcgNS45IDMgOS4zIDQuOCA1LjItOC4yIDEwLjQtMTYuNCAxNS45LTI1LjIgNC41IDUuNSA5LjYgOS45IDYuMSAxNy43IDIuNCAyLjYgNC43IDUuMiA4LjggOS43IC0xLjEtNy4yLTEuOC0xMi0zLTIwLjIgNC41IDQuOCA2LjYgNy4xIDkuMiA5LjlDLTkgMjguNy0zLjMgMjQgMy42IDE4LjNjNC43IDE5LjIgMjAuNyAzNC42IDkuOCA1Ny40IC0zMC4zLTE0LjYtNjAuNC0xLjktOTAuOSAxIC00LjkgMC41LTcuOS0yLjMtOC42LTcuMUMtOTAgNDUuMy05NCAyMC45LTk3LjgtMy40Yy0wLjYtNCAwLjUtNy45IDQuOC04LjdDLTc3LjItMTUtNjEuMy0xNy41LTQ0LjQtMjAuMnpNLTIzLjkgMWMyLjQtNC43IDMuNy03LjEgNS4zLTEwLjMgMTkuMiA0IDM4LjEgNy43IDU2LjggMTIuMSA1IDEuMiA1LjMgNi4zIDQuMyAxMC45QzM4IDM2LjUgMzMuNSA1OS40IDI4LjkgODIuMmMtMSA0LjgtMy4zIDkuMy04LjggOC40IC0xNy43LTIuOS0zNS4zLTYuNC01OS0xMC45IDIyLjQtMTUuNSAzOS44IDEuNSA1Ny41LTIuNCA0LjEtMjAuOCA4LjQtNDIuNCAxMi44LTY0LjhDMTIuOCA4LjctNC45IDUtMjMuOSAxeiIvPjwvZz48ZyBkaXNwbGF5PSJpbmxpbmUiPjxpbWFnZSBvdmVyZmxvdz0idmlzaWJsZSIgd2lkdGg9IjI2OSIgaGVpZ2h0PSIxODEiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgLTcwLjAyMjggLTQyLjA4MjUpIi8+PC9nPjxnIGRpc3BsYXk9ImlubGluZSI+PGltYWdlIG92ZXJmbG93PSJ2aXNpYmxlIiB3aWR0aD0iMjY5IiBoZWlnaHQ9IjE4MSIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAtMTI5Ljc3MjggLTM4LjU4MjUpIi8+PC9nPjwvZz48ZyBkaXNwbGF5PSJub25lIj48ZyBkaXNwbGF5PSJpbmxpbmUiPjxwYXRoIGZpbGw9IiNCNUI1QjUiIGQ9Ik0tOC4zIDEuNGMxNy4xIDAgMzQuMyAwIDUxLjQgMCA2LjggMCA5LjYgMi44IDkuNiA5LjcgMCAyNCAwIDQ3LjkgMCA3MS45IDAgNS45LTMuNiA5LjQtOS41IDkuNCAtMzMuNiAwLTY3LjMgMC0xMDAuOSAwIC0xLjYgMC0zLjIgMC4xLTQuOS0wLjYgLTQtMS41LTUuNi0zLjMtNS43LTcuNiAtMC4xLTYuNyAwLTEzLjMgMC0yMCAwLTE4LjEgMC0zNi4zIDAtNTQuNCAwLTUuNyAyLjctOC40IDguNS04LjRDLTQyLjYgMS40LTI1LjQgMS40LTguMyAxLjR6TS03LjYgMTIuNWMtMTUuMSAwLTMwLjMgMC00NS40IDAgLTQuMSAwLTQuMiAwLTQuMiA0IDAgMjAuMyAwIDQwLjYgMCA2MC45IDAgNCAwLjEgNCA0LjEgNCAzMC4zIDAgNjAuNiAwIDkwLjkgMCAzLjkgMCAzLjktMC4xIDMuOS0zLjcgMC0yMC41IDAtNDAuOSAwLTYxLjQgMC0zLjctMC4xLTMuOC0zLjktMy44QzIyLjcgMTIuNCA3LjUgMTIuNS03LjYgMTIuNXpNLTggNzcuNGMtMTQuMiAwLTI4LjMgMC00Mi41IDAgLTEuNiAwLTMuMiAwLjQtMS40LTIuMSA0LjQtNi4zIDguNi0xMi45IDEyLjgtMTkuNCAwLjktMS40IDEuNy0xLjEgMi43LTAuMSAxLjIgMS4zIDIuNiAyLjYgMy45IDMuOSAyLjMgMi4yIDIuNSAyLjIgNC43LTAuMyA0LjctNS41IDkuMy0xMS4yIDE0LTE2LjcgMC40LTAuNSAwLjktMSAxLjMtMS41IDQuOS01LjMgNC45LTUuMyAxMC0wLjUgMi40IDIuMiAyLjYgMi4zIDQuNy0wLjIgMy4zLTMuOSA2LjQtOCA5LjYtMTIgMC40LTAuNSAwLjctMS4xIDEuMS0xLjYgMi0yLjQgMi4zLTIuNCA0IDAuMiA2LjYgOS45IDEzLjEgMTkuOCAxOS42IDI5LjcgMC45IDEuNCAxLjQgMi45IDEuNCA0LjcgLTAuMSA0LjMtMC4yIDguNyAwIDEzIDAuMSAyLjUtMSAzLTMuMiAzQzIwLjQgNzcuNCA2LjIgNzcuNC04IDc3LjR6Ii8+PC9nPjwvZz48cGF0aCBmaWxsPSJub25lIiBkPSJNMzcuNyAyMS40YzYuMiAwIDExIDUgMTEgMTEuNCAwIDYuNy00LjEgMTAuNi0xMS4zIDEwLjYgLTUuOSAwLTEwLjYtNC43LTEwLjctMTAuNEMyNi41IDI2LjYgMzIgMjEuNCAzNy43IDIxLjR6Ii8+PHBhdGggZmlsbD0iI0I1QjVCNSIgZD0iTTEyNi4xIDE2LjNjLTE2LjYtNC40LTM5LjItOS42LTU1LjgtMTQuMSAtMC41LTAuMS0xLjEtMC4zLTEuNi0wLjRsLTUuMSA2LjQgMC40IDMuOGMxLjQgMC40IDIuOCAwLjcgNC4yIDEuMSAxNC42IDMuOSAzNS4zIDguNiA0OS45IDEyLjUgMy43IDEgMy44IDEgMi44IDQuNSAtNS4zIDE5LjgtMTAuNiAzOS41LTE1LjkgNTkuMyAtMSAzLjUtMSAzLjUtNC44IDIuNSAtMTYuNC00LjQtMTQuNy0zLjgtMzEuMS04LjJsLTEuNSAxMWMxNy43IDQuNyAxNy4zIDQuNSAzNSA5LjIgNS43IDEuNSAxMC4xLTEgMTEuNy02LjYgNi4yLTIzLjIgMTIuNC00Ni4yIDE4LjYtNjkuM0MxMzQuNiAyMS40IDEzMi42IDE4IDEyNi4xIDE2LjN6TTk4LjIgODdjMi4yIDAuNiAzLjMgMC41IDMuOS0yIDAuOS00LjIgMi4xLTguMyAzLjMtMTIuNSAwLjUtMS43IDAuNC0zLjMtMC4xLTQuOCAtMy43LTExLjMtNy40LTIyLjUtMTEuMi0zMy44IC0xLTMtMS4yLTMtMy44LTEuMiAtMC41IDAuNC0xIDAuOS0xLjUgMS4zIC00LjEgMy4xIDEuOSAxMC4yLTIuMyAxMy4xIC0yLjcgMS45LTIuOSAxLjctNC42LTEgLTAuNi0xLTEuMS0xLjgtMS41LTIuNGwtOS40IDEzLjUgNC4zIDExTDYzLjUgNzguN2MxLjMgMC4zIDIuNSAwLjcgMy44IDFDODAuOSA4My40IDg0LjYgODMuMyA5OC4yIDg3eiIvPjxwYXRoIGZpbGw9IiNCNUI1QjUiIGQ9Ik0yMi41IDg0Yy00LjEgMC40LTQuMSAwLjQtNC41LTMuNiAtMi4xLTIwLjItNC4yLTQwLjQtNi4zLTYwLjYgLTAuNC0zLjktMC4zLTQgMy44LTQuNCAxMy42LTEuNCAyNy4zLTIuOCA0MC45LTQuMmwtMS43LTMuNEw1Ny4yIDBjLTE2LjUgMS43LTMzIDMuNC00OS41IDUuMSAtNS44IDAuNi04LjIgMy41LTcuNiA5LjIgMS45IDE4LjEgMy43IDM2LjEgNS42IDU0LjFDNi40IDc1LjEgNyA4MS43IDcuOCA4OC4zYzAuNSA0LjMgMi4yIDUuOSA2LjQgNyAxLjcgMC41IDMuMyAwLjIgNC45IDAgMTUuMy0xLjYgMzAuNS0zLjIgNDUuOC00LjdsLTIuNS0xMC44QzQ5LjEgODEuMiAzNS44IDgyLjYgMjIuNSA4NHpNNjIuMyA1Mi41bDQtMTUuOWMtMy40LTIuNC00LTEuNi03LjYgMy4zIC0wLjQgMC41LTAuOCAxLjEtMS4yIDEuNiAtNC4xIDYtOC4xIDEyLjEtMTIuMiAxOC4xIC0yLjIgMy4xLTIuMiAyLjYtNi0wLjMgLTEtMC43LTEuOS0xLjUtMi44LTIuNCAtMS4yLTEuMS0yLjEtMS4zLTMgMSAtMi43IDYuNy02LjIgMTMuMS0xMCAxOS4yIC0yLjEgMy41LTAuNSAyLjggMS4yIDIuNyAxMi44LTEuMyAyNS42LTIuNyAzOC40LTRsNy4xLTE0LjNMNjIuMyA1Mi41ek0zNyA0My4zYzcuMS0wLjcgMTAuOC01IDEwLjEtMTEuNyAtMC43LTYuNC02LTEwLjktMTIuMS0xMC4zIC01LjcgMC42LTEwLjYgNi4zLTkuOCAxMi43QzI2IDM5LjggMzEuMSA0My45IDM3IDQzLjN6Ii8+PGcgZGlzcGxheT0ibm9uZSIvPjwvc3ZnPg==',
                loadingTemplateUrl: false,
                loadingTemplate: false,
                disableLazy: false,
                nodesCDN: true,
                offset: 50,
                aspectRatio: null
            };

            if(attrs.nImageOptions) {
                options = angular.extend(options, _parseAttr(attrs.nImageOptions));
            }

            alt = attrs.alt;
            width = attrs.width;
            height = attrs.height;
            aspectRatio = options.aspectRatio || attrs.aspectRatio;
            mode = attrs.mode;
            attrs.$observe('nSrc', () => {
                source = _parseAttr(attrs.nSrc);
                if(typeof source !== undefined && loaded) {
                    _init();
                }
            });

            _configureContainer();

            _onScroll();

            if(options.disableLazy) {
                _init();
            }

            $wrapper.addEventListener('scroll', _onScroll);
            // $wrapper.on('scroll', _onScroll);
            if($wrapper !== ctrl.$window) {
                $wrapper.addEventListener('resize', _onScroll);
                // $wrapper.on('resize', _onScroll);
            }
            scope.$on('$destroy', () => {
                return _unbindEvents();
            });

            function _init() {
                _buildQueryParams();

                _loadImage()
                    .then((args: any) => {
                    })
                    .catch((error: any) => {
                    })
                    .finally(() => {
                        ctrl.isLoading = false;
                    });
            }

            function _configureContainer() {
                let $loadingContainer: any = element.find('n-image__loader');

                element.addClass('n-image__wrapper');

                if(options.loadingTemplateUrl) {
                    _loadTemplate()
                        .then((template: any) => {
                            $loadingContainer.append(template.data);
                        });
                } else if(options.loadingTemplate) {
                    $loadingContainer.append(options.loadingTemplate);
                }

                if(!aspectRatio) {
                    if(width) {
                        element[0].style.width = width + 'px';
                    }
                    if(height) {
                        element[0].style.height = height + 'px';
                    }
                } else {
                    element.addClass('n-image__aspect-wrapper');
                    element.addClass('n-image--ratio-'+aspectRatio);
                }
            }

            function _unconfigureContainer() {
                if(!aspectRatio) {
                    if(width) {
                        element[0].style.width = 'auto';
                    }
                    if(height) {
                        element[0].style.height = 'auto';
                    }
                } else {
                    element.removeClass('n-image__aspect-wrapper');
                    element.removeClass('n-image--ratio-' + aspectRatio);
                }
            }

            function _buildQueryParams() {

                if(!options.nodesCDN) {
                    return;
                }

                let queryString: string = '?';
                let queryParams: string[] = [];

                if(width) {
                    queryParams.push('w=' + width);
                }
                if(height) {
                    queryParams.push('h=' + height);
                }
                if(mode && (allowedModes.indexOf(mode) !== -1)) {
                    queryParams.push('mode=' + mode);
                }

                queryString += queryParams.join('&');

                source += queryString;
            }

            function _loadImage() {
                loaded = true;

                let deferred: any = ctrl.$q.defer();

                let $cnt: any = element;

                let $img: any = $cnt.find('img');

                $cnt.removeClass('n-image__fallback');
                $img[0].src = source;
                $img[0].alt = alt;

                $img.one('load', () => {
                    deferred.resolve();
                });
                $img.one('error abort', () => {
                    $img[0].src = options.fallbackImage;
                    $cnt.addClass('n-image__fallback');
                    $img[0].alt = '';
                    _unconfigureContainer();
                    deferred.reject();
                });

                return deferred.promise;
            }

            function _parseAttr(attr: string) {
                try {
                    return scope.$eval(attr);
                } catch(e: any) {
                    return attr;
                }
            }

            function _onScroll() {
                ctrl.$timeout.cancel(timeout);
                timeout = ctrl.$timeout(() => {
                    let remaining, windowBottom: number;
                    let shouldLoad: boolean;

                    let h: number = _wrapperInnerHeight();
                    let sT: number = _wrapperScrollTop();

                    let elOffset: number = $wrapper === ctrl.$window ? _elementOffset() : _elementOffsetFromContainer();
                    windowBottom = $wrapper === ctrl.$window ? h + sT : h;

                    remaining = elOffset - windowBottom;

                    shouldLoad = remaining <= options.offset;

                    if(!loaded && shouldLoad) {
                        _init();
                    }
                }, 100);
            }

            function _unbindEvents() {
                ctrl.$timeout.cancel(timeout);
                $wrapper.off('scroll', _onScroll);
                ctrl.$window.off('resize', _onScroll);
                if($wrapper !== ctrl.$window) {
                    $wrapper.off('resize', _onScroll);
                }
                timeout = source = alt = width = height = aspectRatio = mode = undefined;
                ctrl.isLoading = true;
                loaded = false;
            }

            function _wrapperScrollTop() {
                let w: any = $wrapper;

                if(typeof w.pageYOffset !== undefined) {
                    return w.pageYOffset;
                } else if(typeof w.scrollTop !== undefined) {
                    return w.scrollTop;
                }

                return document.documentElement.scrollTop || 0;
            }

            function _wrapperInnerHeight() {
                let w: any = $wrapper;

                if(w.innerHeight !== undefined) {
                    return w.innerHeight;
                } else if(w.clientHeight !== undefined) {
                    return w.clientHeight;
                }

                return document.documentElement.clientHeight || 0;
            }

            function _elementOffset() {
                let e: ClientRect = $element[0].getBoundingClientRect();
                return e.top + _wrapperScrollTop() - document.documentElement.clientTop;
            }

            function _elementOffsetFromContainer() {
                let e: ClientRect = $element[0].getBoundingClientRect();
                return e.top - <HTMLElement>$wrapper.getBoundingClientRect().top;
            }

            function _loadTemplate() {
                return ctrl.$http.get(options.loadingTemplateUrl, {cache: ctrl.$templateCache});
            }




                // scope.internalValue = true;
            //
            // scope.internalDirectiveMethod = () => {
            //     scope.internalValue = !scope.internalValue;
            // }
        }
    }

    class nImageDirectiveController {
        static $inject: Array<string> = ['$window', '$q', '$http', '$timeout', '$templateCache'];

        public isLoading: boolean = true;

        constructor(private $window: ng.IWindowService,
                    private $q: ng.IQService,
                    private $http: ng.IHttpService,
                    private $timeout: ng.ITimeoutService,
                    private $templateCache: ng.ITemplateCacheService) {
        }
    }

    angular
        .module('nImage')
        .directive('nImage', nImage.instance);
}