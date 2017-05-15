'use strict';
/* global checkConnection */
angular.module('main')
.controller('ChallengesCtrl', function ($scope, $ionicLoading, $state,
  $translate, Toast, GoogleAnalytics, Place, User, Retos, $stateParams, $ionicModal, $ionicPopup, $log) {

  GoogleAnalytics.trackView('Favorite List Screen');

  $scope.retos = [];
  $scope.maxRating = 5;
  $scope.params = {
    page: 0
  };
  var isSubmittingReto = false;

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
    $scope.$broadcast('scroll.refreshComplete');

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

    // FUNCIÓN PARA CARGAR RETEOS
  $scope.gotoRetos = function (id) {
    $state.go('app.challenges', {placeId: id} );
  };
  $scope.setChallenges = function (retos) {
    $scope.retos = retos;
  };
  $scope.loadChallanges = function () {
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      Retos.getChallangesById($stateParams.placeId).then( function (retos) {
        $log.log(retos);
        $scope.setChallenges(retos);
        if ($scope.retos.length === 0) {
          showEmptyView();
        } else {
          Retos.getChallangesProgress($scope.user.uid).then( function (response) {
            angular.forEach($scope.retos, function (value1, key1) {
              angular.forEach(response, function (value2, key2) {
                $log.log(key2);
                if (value1.id === value2.r_id) {
                  $scope.retos[key1].storeNumber = 1;
                }
              });
            });
            showPlaces();
          });

        }
      }, function () {
        showErrorView();
      });
    }
  };
  $scope.showConfirm = function (rid) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Aceptar reto',
      template: 'Esta seguro de aceptar este reto?'
    });

    confirmPopup.then( function (res) {
      if (res) {
        $log.log(rid);
        $scope.onSubmitChallenge(rid);
      }
    });
  };
  $scope.isSubmittingReto = function () {
    return isSubmittingReto;
  };
  $scope.onSubmitChallenge = function (rid) {
    isSubmittingReto = true;
    Retos.aceptChallenges($scope.user.uid, rid).then(function (response) {
      $log.log(response);
      Toast.show('Reto aceptado');
      isSubmittingReto = false;
      $scope.closeRetosModal();
    }).catch( function (error) {
      $log.log(error);
      Toast.show('No puedes tomar este reto');
      isSubmittingReto = false;
      $scope.closeRetosModal();
    });
  };

  $ionicModal.fromTemplateUrl('main/templates/retos-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.retosModal = modal;
  });

  $scope.openRetosModal = function (reto) {
    $scope.challenges = reto;
    if (User.getLoggedUser()) {
      $scope.retosModal.show();
    } else {
      $scope.authModal.show();
    }
  };
  $scope.closeRetosModal = function () {
    $scope.retosModal.hide();
  };

  $scope.navigateToPlace = function (id) {
    $state.go('app.place', {
      placeId: id
    })
  }

  $scope.onLoadMore = function () {
    $scope.loadChallanges();
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
    $scope.retos = [];
    $scope.params.page = 0;
    showLoading();
    $scope.loadChallanges();
  };

  $scope.$on('$ionicView.enter', function (scopes, states) {

    if (states.direction === 'forward') {
      showLoading();
      $scope.loadChallanges();
    }
  });
});
