'use strict';
/* global checkConnection */
angular.module('main')
.controller('SearchCtrl', function ($scope, $ionicLoading, $state, $filter,
  Places, GoogleAnalytics, Toast, $translate, Geolocation, Dialog, $ionicModal, $log) {

  GoogleAnalytics.trackView('Search Place Screen');

  $scope.places = [];
  $scope.maxRating = 5;
  $scope.params = {
    location: null,
    distance: 100.00,
    page: 0,
    search: '',
    id: '',
    type: '',
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

  var isLoadingViewShown = false;
  var isPlacesViewShown = false;
  var isEmptyViewShown = false;
  var isInitialViewShown = true;

  var isMoreData = false;
  $scope.gotoDetail = function (id, object) {
    $log.log(id);
    $log.log(object);
    $state.go('app.place', {
      'placeId': id,
      'obj': object
    }, {
      location: 'replace'
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
  };

  $scope.closeDistanceModal = function () {
    $scope.distanceModal.hide();
  };
  var showLoading = function () {

    isLoadingViewShown = true;

    isPlacesViewShown = false;
    isEmptyViewShown = false;
    isInitialViewShown = false;

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
    isEmptyViewShown = false;
    isInitialViewShown = false;

    $ionicLoading.hide();
  }

  var showEmptyView = function () {

    isEmptyViewShown = true;

    isPlacesViewShown = false;
    isLoadingViewShown = false;
    isInitialViewShown = false;

    $ionicLoading.hide();
  }

  var showInitialView = function () {

    isInitialViewShown = true;

    isEmptyViewShown = false;
    isPlacesViewShown = false;
    isLoadingViewShown = false;

    $ionicLoading.hide();
  }

  // var ensureMoreData = function (length) {
  //   isMoreData = false;
  //   // if (length > 0) {
  //   //   isMoreData = true;
  //   // }
  //   if (length > 6) {
  //     isMoreData = true;
  //   }
  // };

  var setPlaces = function (places) {
    for (var i = 0;i < places.length;i++) {
      $scope.places.push(places[i]);
    }
  };

  // var setCurrentPage = function (page) {
  //   $scope.params.page = page;
  // };
  var showErrorView = function () {

    // isErrorViewShown = true;

    isPlacesViewShown = false;
    isLoadingViewShown = false;
    isEmptyViewShown = false;

    $ionicLoading.hide();
  };

  var loadPlaces = function () {
    $log.log($scope.params);
    // carga de lugares
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      Places.all($scope.params).then(function (places) {
        $log.log(places);
        isMoreData = false;
        setPlaces(places);
        if ($scope.places.length === 0) {
          showEmptyView();
        } else {
          showPlaces();
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');

      }, function () {
        Toast.show('no se pudo encontrar su consulta, le sugerimos las siguiente opciones');
        // $scope.params.search = '';
        $scope.params.nodata = true;
        loadPlaces();
      });
    }

  };

  $scope.onNavigateToPlace = function (id) {
    $state.go('app.place', {
      placeId: id
    });
  };
  $scope.navigateToMap = function (search) {
    $log.log(search);
    $state.go('app.map2', {
      search: search,
      type: ''
    });
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
      Dialog.alert(errorMessage);

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

  $scope.showEmptyView = function () {
    return isEmptyViewShown;
  };

  $scope.showInitialView = function () {
    return isInitialViewShown;
  };

  showInitialView();

});
