'use strict';
/* global checkConnection */
angular.module('main')
.controller('PlaceListCtrl', function ($scope, $rootScope, $ionicLoading, $state,
  $localStorage, $stateParams, $translate, $ionicModal, Geolocation, Places,
  GoogleAnalytics, Dialog, $filter, Toast, Share, $log) {

  GoogleAnalytics.trackView('Place List Screen');

  $scope.maxRating = 5;
  $scope.storage = $localStorage;
  $scope.categoryTitle = $stateParams.categoryTitle;

  $scope.params = {
    location: null,
    categoryId: $stateParams.categoryId,
    distance: 100.00,
    page: 0,
    search: '',
    type: $stateParams.type
  };

  var trans;

  $translate(['twoBlocksText', 'sixBlocksText', 'errorGpsDisabledText',
  'errorLocationMissingText'])
    .then(function (translations) {

      trans = translations;

      $scope.distances = [
        { val: 1.00, text: '1 ' + $scope.storage.unit },
        { val: 2.00, text: '2 ' + $scope.storage.unit },
        { val: 3.00, text: '3 ' + $scope.storage.unit },
        { val: 4.00, text: '4 ' + $scope.storage.unit },
        { val: 5.00, text: '5 ' + $scope.storage.unit },
        { val: 6.00, text: '6 ' + $scope.storage.unit },
        { val: 7.00, text: '7 ' + $scope.storage.unit },
        { val: 8.00, text: '8 ' + $scope.storage.unit },
        { val: 9.00, text: '9 ' + $scope.storage.unit },
        { val: 10.00, text: '10 ' + $scope.storage.unit },
        { val: 25.00, text: '25 ' + $scope.storage.unit },
        { val: 50.00, text: '50 ' + $scope.storage.unit },
        { val: 100.00, text: '100 ' + $scope.storage.unit },
      ];
    });

  $scope.places = [];

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
    } else {
      isMoreData = false;
    }
    // if (length > 6) {
    //   isMoreData = true;
    // }
  };

  var setPlaces = function (places) {
    for (var i = 0;i < places.length;i++) {
      $scope.places.push(places[i]);
    }
  };

  var setCurrentPage = function (page) {
    $scope.params.page = page;
  };

  var loadPlaces = function () {
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      $log.log($scope.params);
      $log.log($scope.params.type);
      if ($scope.params.type === "preferencias" && $scope.params.search === ''){
        Places.allPreferences($scope.params).then(function (places) {
          $log.log(places);
          $log.log(places.length);
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
        });
      }
      if ($scope.params.type == 'categoria' && $scope.params.search === ''){
        Places.allCategories($scope.params).then(function (places) {
          $log.log(places);
          $log.log(places.length);
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
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
          }
        });
      }
      if ($scope.params.search !== ''){
        Places.all($scope.params).then(function (places) {
          $log.log(places);
          $log.log(places.length);
          if (places.length === 0) {
            showEmptyView();
            isMoreData = false;
            $scope.$broadcast('scroll.refreshComplete');
          }else {
            isMoreData = false;
            setPlaces(places);
            showPlaces();
            $scope.$broadcast('scroll.refreshComplete');
          }
        }, function () {
          Toast.show('no se pudo encontrar su consulta, le sugerimos las siguiente opciones');
          // $scope.params.search = '';
          $scope.params.nodata = true;
          loadPlaces();
        });
      }
    }
  };


  $scope.onSearch = function () {
    $scope.params.page = 0;
    $scope.places = [];
    $scope.params.search = $filter('lowercase')($scope.params.search);

    Geolocation.getCurrentPosition().then(function (position) {

      $scope.params.location = position.coords;
      showLoading();
      loadPlaces();
    }, function (error) {
      $scope.params.location = null;

      var errorMessage;

      if (error.code === 1 || error.code === 3) {
        errorMessage = trans.errorGpsDisabledText;
      } else {
        errorMessage = trans.errorLocationMissingText;
      }
      Dialog.alert(errorMessage, "Mensaje");

      // showErrorView();
      $scope.$broadcast('scroll.refreshComplete');
    });
    // if ($scope.params.search !== '') {
    // }
  };
  $scope.onDistanceSelected = function (distance) {
    $scope.params.distance = distance;
    $scope.params.page = 0;
    $scope.places = [];
    $scope.closeDistanceModal();
    showLoading();
    loadPlaces();
  };

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

  $scope.onShare = function () {
    Share.sharePlace($scope.place);
  };
  $scope.onReload = function () {
    showLoading();

    $scope.params.page = 0;
    $scope.places = [];

    Geolocation.getCurrentPosition().then(function (position) {

      $scope.params.location = position.coords;
      loadPlaces();
    }, function (error) {
      $scope.params.location = null;

      var errorMessage;

      if (error.code === 1 || error.code === 3) {
        errorMessage = trans.errorGpsDisabledText;
      } else {
        errorMessage = trans.errorLocationMissingText;
      }
      Dialog.alert(errorMessage, "Mensaje");

      showErrorView();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $ionicModal.fromTemplateUrl('main/templates/distance-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.distanceModal = modal;
  });

  $scope.openDistanceModal = function () {
    $scope.distanceModal.show();
  }

  $scope.closeDistanceModal = function () {
    $scope.distanceModal.hide();
  }

  $scope.navigateToMap = function (search) {
    $state.go('app.map', {
      categoryId: $stateParams.categoryId,
      categoryTitle: $stateParams.categoryTitle,
      type: $stateParams.type,
      search: search
    });
  };

  $scope.$on('$ionicView.enter', function (scopes, states) {

    if (states.direction === 'forward') {

      showLoading();

      Geolocation.getCurrentPosition().then(function (position) {

        $scope.params.location = position.coords;
        loadPlaces();
      }, function (error) {
        $scope.params.location = null;

        var errorMessage;

        if (error.code === 1 || error.code === 3) {
          errorMessage = trans.errorGpsDisabledText;
        } else {
          errorMessage = trans.errorLocationMissingText;
        }
        Dialog.alert(errorMessage, "Mensaje");

        showErrorView();
      });
    }
  });

})
