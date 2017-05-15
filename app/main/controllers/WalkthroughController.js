'use strict';
angular.module('main')
.controller('WalkthroughCtrl',
function ($scope, $state, $localStorage, $ionicPlatform, $cordovaSplashscreen) {

  $scope.onSkip = function () {
    $localStorage.walkthrough = true;
    $state.go('main');
  }

  $scope.$on('$ionicView.loaded', function () {
    $ionicPlatform.ready(function () {
      if (navigator && navigator.splashscreen) {
        $cordovaSplashscreen.hide();
      }
    });
  });
});
