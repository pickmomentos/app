'use strict';
/* global checkConnection */
angular.module('main')
.controller('FavoriteListCtrl', function ($scope, $ionicLoading, $state,
  $translate, Toast, GoogleAnalytics, Place, User, Favorites, $log) {

  GoogleAnalytics.trackView('Favorite List Screen');

  $scope.places = [];
  $scope.maxRating = 5;
  $scope.params = {
    page: 0
  }
  $scope.user = JSON.parse(User.getLocalVariable('user'));
  $log.log($scope.user);
  var isLoadingViewShown = false;
  var isPlacesViewShown = false;
  var isErrorViewShown = false;
  var isEmptyViewShown = false;

  var isMoreData = false;
  $scope.gotoDetail = function (id, object) {
    $state.go('app.place', {
      'placeId': id,
      'obj': object
    }, {
      location: 'replace'
    });
  };

  var showLoading = function () {

    isLoadingViewShown = true;

    isPlacesViewShown = false;
    isErrorViewShown = false;
    isEmptyViewShown = false;

    $ionicLoading.show({
      templateUrl: 'main/templates/loading.html',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      scope: $scope,
      showDelay: 0
    });
  };

  var showPlaces = function () {

    isPlacesViewShown = true;

    isLoadingViewShown = false;
    isErrorViewShown = false;
    isEmptyViewShown = false;

    $ionicLoading.hide();
  };

  var showErrorView = function () {

    isErrorViewShown = true;

    isPlacesViewShown = false;
    isLoadingViewShown = false;
    isEmptyViewShown = false;

    $ionicLoading.hide();
  };

  var showEmptyView = function () {

    isEmptyViewShown = true;

    isErrorViewShown = false;
    isPlacesViewShown = false;
    isLoadingViewShown = false;

    $ionicLoading.hide();
  };

  var ensureMoreData = function (length) {
    isMoreData = false;
    if (length > 0) {
      isMoreData = true;
    }
  };

  var setPlaces = function (places) {
    for (var i = 0;i < places.length;i++) {
      $scope.places.push(places[i]);
    }
  }

  var setCurrentPage = function (page) {
    $scope.params.page = page;
  }

  var loadPlaces = function () {
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      Favorites.getFavorites($scope.params, $scope.user.uid).then(function (places) {
        if (places.length === 0  && $scope.params.page === 0) {
          showEmptyView();
          $scope.$broadcast('scroll.refreshComplete');

        } else if (places.length === 0  && $scope.params.page > 0) {
          showPlaces();
          ensureMoreData(places.length);
          $scope.$broadcast('scroll.refreshComplete');
        } else {

          ensureMoreData(places.length);
          setCurrentPage($scope.params.page + 1);
          setPlaces(places);
          showPlaces();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }

      }, function () {
        showErrorView();
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  };

  $scope.navigateToPlace = function (id) {
    $state.go('app.place', {
      placeId: id
    })
  }

  $scope.onLoadMore = function () {
    loadPlaces();
  };

  $scope.moreDataCanBeLoaded = function () {
    return isMoreData;
  };

  $scope.showLoadingView = function () {
    return isLoadingViewShown;
  };

  $scope.showPlaces = function () {
    return isPlacesViewShown;
  };

  $scope.showErrorView = function () {
    return isErrorViewShown;
  };

  $scope.showEmptyView = function () {
    return isEmptyViewShown;
  };

  $scope.onReload = function () {
    $scope.places = [];
    $scope.params.page = 0;
    showLoading();
    loadPlaces();
  }

  $scope.$on('$ionicView.enter', function (scopes, states) {

    if (states.direction === 'forward') {
      showLoading();
      loadPlaces();
    }
  });
});
