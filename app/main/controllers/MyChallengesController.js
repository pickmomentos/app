'use strict';
/* global checkConnection */
angular.module('main')
.controller('MyChallengesController', function ($scope, $ionicLoading, $state,
  $translate, Toast, GoogleAnalytics, Place, User, Retos, $stateParams, $ionicModal, $ionicPopup, $log) {

  GoogleAnalytics.trackView('Favorite List Screen');

  $scope.retosPe = [];
  $scope.retosCo = [];
  $scope.retosCa = [];
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
  // var isEmptyViewShown = false;

  var isMoreData = false;
  $scope.gotoDetail = function (id, object) {
    $state.go('app.place', {
      'placeId': id,
      'obj': object
    }, {
      location: 'replace'
    });
  };
  $scope.gotoScanGift = function (sid) {
    console.log(sid);
    $state.go('app.scan-gift', {
      'sid': sid,
    });
    $scope.closeRetosModal();

  };
  var showLoading = function () {

    isLoadingViewShown = true;

    isPlacesViewShown = false;
    isErrorViewShown = false;
    // isEmptyViewShown = false;

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
    // isEmptyViewShown = false;

    $ionicLoading.hide();
    $scope.$broadcast('scroll.refreshComplete');

  };

  var showErrorView = function () {

    isErrorViewShown = true;

    isPlacesViewShown = false;
    isLoadingViewShown = false;
    // isEmptyViewShown = false;

    $ionicLoading.hide();
  };

  // var showEmptyView = function () {
  //
  //   isEmptyViewShown = true;
  //
  //   isErrorViewShown = false;
  //   isPlacesViewShown = false;
  //   isLoadingViewShown = false;
  //
  //   $ionicLoading.hide();
  // };

    // FUNCIÓN PARA CARGAR RETEOS
  $scope.gotoRetos = function (id) {
    $state.go('app.challenges', {placeId: id} );
  };
  $scope.setChallenges = function (retos) {
    $scope.retos = retos;
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

  $ionicModal.fromTemplateUrl('main/templates/retos-progressmodal.html', {
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

  $scope.loadChallangesByUserProgress = function () {
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      console.log($scope.user.uid);
      Retos.getChallangesProgress($scope.user.uid).then( function (retos) {
        $log.log(retos);
        $scope.retosPe = retos;
        showPlaces();

      }, function () {
        showErrorView();
      });
    }
  };
  $scope.loadChallangesByUserComplete = function () {
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      console.log($scope.user.uid);
      Retos.getChallangesComplete($scope.user.uid).then( function (retos) {
        $log.log(retos);
        $scope.retosCo = retos;
        showPlaces();

      }, function () {
        showErrorView();
      });
    }
  };
  $scope.loadChallangesByUserCaducado = function () {
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      console.log($scope.user.uid);
      Retos.getChallangesCaducado($scope.user.uid).then( function (retos) {
        $log.log(retos);
        $scope.retosCa = retos;
        showPlaces();
      }, function () {
        showErrorView();
      });
    }
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

  $scope.onReload = function () {
    $scope.retosPe = [];
    $scope.retosCo = [];
    $scope.retosCa = [];
    showLoading();
    $scope.loadChallangesByUserProgress();
    $scope.loadChallangesByUserComplete();
    $scope.loadChallangesByUserCaducado();
  };

  $scope.$on('$ionicView.enter', function (scopes, states) {
    console.log(states);
    if (states.direction === 'swap') {
      showLoading();
      $scope.loadChallangesByUserProgress();
      $scope.loadChallangesByUserComplete();
      $scope.loadChallangesByUserCaducado();
    }
  });
}).filter('split', function () {
  return function (input, splitChar, splitIndex) {
    // do some bounds checking here to ensure it has that index
    return input.split(splitChar)[splitIndex];
  };
});
