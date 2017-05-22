'use strict';
/* global checkConnection */
angular.module('main')
.controller('HomeCtrl',  function ($scope, $rootScope, $state, $translate, $timeout, $ionicLoading, $ionicPlatform,
  $cordovaSplashscreen, Category, GoogleAnalytics, AdMobService, Config, Toast, $log, $ionicPopup, $ionicHistory ) {


  GoogleAnalytics.trackView('Category List Screen');
  $ionicPlatform.registerBackButtonAction(function (event) {
    $log.log(event);
    $log.log($state.current.name);
    if ($state.current.name === 'app.home') {
      $ionicPopup.confirm({
        title: 'Alerta',
        content: 'Estas seguro de  salir de pick'
      })
      .then(function (result) {
        if (result) {
          ionic.Platform.exitApp();
        }
      });
    } else if ($state.current.name === 'main') {
      $ionicPopup.confirm({
        title: 'Alerta',
        content: 'Estas seguro de  salir de pick'
      })
      .then(function (result) {
        if (result) {
          ionic.Platform.exitApp();
        }
      });
    } else {
      $ionicHistory.goBack();
    }

  }, 100);
  var isLoadingViewShown = false;
  var isCategoriesViewShown = false;
  var isErrorView = false;

  var showLoading = function () {

    isLoadingViewShown = true;

    isCategoriesViewShown = false;
    isErrorView = false;

    $ionicLoading.show({
      templateUrl: 'main/templates/loading.html',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      scope: $scope,
      showDelay: 0
    });
  };

  var setCategories = function (categories) {
    $scope.categories = categories;
  };
  var showCategories = function () {

    isCategoriesViewShown = true;
    isLoadingViewShown = false;
    isErrorView = false;
    $ionicLoading.hide();
  };

  var showErrorView = function () {
    isErrorView = true;
    isCategoriesViewShown = false;
    isLoadingViewShown = false;
    $ionicLoading.hide();
  };

  var loadCategories = function () {
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      Category.all().then(function (categories) {
        $log.log(categories);
        setCategories(categories);
        showCategories();
        $scope.$broadcast('scroll.refreshComplete');
      }, function () {
        showErrorView();
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  };

  $scope.showLoadingView = function () {
    return isLoadingViewShown;
  };
  $scope.gotoScan = function () {
    $state.go('app.scan');
  };

  $scope.showCategories = function () {
    return isCategoriesViewShown;
  };

  $scope.showErrorView = function () {
    return isErrorView;
  };

  $scope.onReload = function () {
    $scope.categories = [];
    showLoading();
    loadCategories();
  };
  $scope.onHome = function () {
    $state.go('app.home');
  };
  $scope.$on('$ionicView.loaded', function () {
    $ionicPlatform.ready(function () {
      if (navigator && navigator.splashscreen) {
        $cordovaSplashscreen.hide();
      }
      AdMobService.showBanner(Config.ENV.admob.bannerId);
    });
  });

  showLoading();
  loadCategories();
});
