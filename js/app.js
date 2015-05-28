/*!
   angular-project-template v0.0.1
   (c) 2014 (null) McNull https://github.com/McNull/angular-project-template
   License: MIT
*/
(function(angular) {

var app = angular.module('app', ['ngLogo', 'githubLogo', 'markdown', 'ngSanitize', 'ngRoute']);

app.config(['$locationProvider', function($location) {
  $location.hashPrefix('!');
}]);

app.config(["$routeProvider", function ($routeProvider) {

  $routeProvider.when('/', {
    templateUrl: 'app/home.html'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

}]);

app.config(["markdownConfig", function (markdownConfig) {
  markdownConfig = {
  // Outline static markup
  outline: true,
  // Escape html
  escapeHtml: false,
  // Sanitize html,
  sanitize: true,
  // Showdown options
  showdown: {
    extensions: [
	'github']
  }
};
}]);

app.factory('isPrerender', ["$window", function($window) {

  return $window.navigator.userAgent.indexOf('Prerender')!=-1;

}]);

app.controller('MarkdownModelCtrl', ["$scope", "$http", "typeEmulator", "$timeout", "$element", "isPrerender", function ($scope, $http, typeEmulator, $timeout, $element, isPrerender) {
  $scope.input = {
    markdown: '# Hello',
    tPromise: null,
    exampleMarkdown: '',
    state: 'stopped'
  };

  function startTyping() {
    typeEmulator.start($scope.input, 'markdown', $scope.input.exampleMarkdown).then(function () {
      $timeout(function () {
        startTyping();
      }, 5000);
    });
  }

  $http.get('app/README.md').success(function (response) {

    if(isPrerender) {
      $scope.input.markdown = response;
    } else {
      $scope.input.exampleMarkdown = response;
      $scope.play();
    }

  });

  $scope.play = function () {
    if(!isPrerender) {
      $scope.input.state = 'playing';
      startTyping();
    }
  };

  $scope.stop = function () {

    if(!isPrerender) {
      $scope.input.state = 'stopped';
      typeEmulator.stop();

      if ($scope.tPromise) {
        $timeout.cancel($scope.tPromise);
      }

      $scope.input.markdown = $scope.input.exampleMarkdown;
    }
  };
}]);

app.directive('scrollToBottom', function () {

  function locateElementsByClass($element, className) {

    var result = [];

    function collect($e) {

      if ($e.hasClass(className)) {
        result.push($e);
      }

      angular.forEach($e.children(), function (child) {
        collect(angular.element(child));
      });
    }

    collect($element);

    return result;
  }

  return {
    link: function ($scope, $element) {

      var formControls = [];

      $scope.$watch('input.markdown', function (value, oldValue) {

        if (value != oldValue && $scope.input.state == 'playing') {

          formControls = !formControls.length ? locateElementsByClass($element, 'form-control') : formControls;

          angular.forEach(formControls, function ($e) {

            $e[0].scrollTop = $e[0].scrollHeight;

          });
        }

      });

    }
  };

});

app.factory('typeEmulator', ["$timeout", "$q", function ($timeout, $q) {

  var tObj, tProp, idx, tPromise, queue, cb, defer;

  function start(targetObject, targetProperty, text) {
    tObj = targetObject;
    tProp = targetProperty;

    tObj[tProp] = '';

    idx = 0;
    queue = text;

    defer = $q.defer();

    step();

    return defer.promise;
  }

  function step() {

    if (idx < queue.length) {

      tObj[tProp] = queue.substr(0, idx);

      idx += 1;
      tPromise = $timeout(step, Math.random() * 170 + 20);
    } else {
      defer.resolve();
    }
  }

  function stop() {
    $timeout.cancel(tPromise);
  }

  return {
    start: start,
    stop: stop
  };
}]);
/**
 * Created by null on 11/10/14.
 */

app.directive('markdownPreview', function() {

  return {
    scope: {
      markdownModel: '=?',
      onFocus: '&?',
      onBlur: '&?'
    },
    templateUrl: 'app/markdown-preview.ng.html'
  }
});
// Automatically generated.
// This file is already embedded in your main javascript output, there's no need to include this file
// manually in the index.html. This file is only here for your debugging pleasures.
angular.module('app').run(['$templateCache', function($templateCache){
  $templateCache.put('app/header.ng.html', '<div class=\"jumbotron app-header\"><div class=\"container\"><div ng-logo=\"\"></div><div class=\"text-center\"><h1>angular-markdown-text</h1><p>An easy to use markdown directive with static outlining, html escaping/sanitization, resource loading and model binding.</p><div class=\"github\"><div github-icon=\"\"></div><a github-logo=\"\" href=\"https://github.com/McNull/angular-markdown-text\" title=\"Goto the GitHub project page.\"></a></div></div></div></div>');
  $templateCache.put('app/markdown-preview.ng.html', '<div class=\"panel panel-default\"><div class=\"panel-body\"><form class=\"form markdown-preview\"><div class=\"form-group col-sm-6\"><label>Input</label> <textarea class=\"form-control\" ng-model=\"markdownModel\" ng-focus=\"onFocus()\" ng-blur=\"onBlur()\"></textarea></div><div class=\"form-group col-sm-6\"><label>Output</label><div class=\"form-control\" markdown=\"markdownModel\"></div></div></form></div></div>');
}]);
})(angular);
//# sourceMappingURL=app.js.map