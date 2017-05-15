'use strict';
/* global checkConnection */
angular.module('main')
.controller('checkinCtrl', function ($scope, $rootScope, $ionicLoading, $state,
  $localStorage, $stateParams, $translate, $ionicModal, Geolocation, Checkin,
  GoogleAnalytics, Dialog, $filter, Toast, Share, User, $log) {

  GoogleAnalytics.trackView('checkin List Screen');

  $scope.storage = $localStorage;
  $scope.user = JSON.parse(User.getLocalVariable('user'));
  $scope.params = {
    uid: $scope.user.uid,
    page: 0,
  };

  $scope.checkin = [];
  $scope.gotoDetail = function (id, object) {
    $state.go('app.place', {
      'placeId': id,
      'obj': object
    }, {
      location: 'replace'
    });
  };
  var isLoadingViewShown = false;
  var ischeckinViewShown = false;
  var isErrorViewShown = false;
  var isEmptyViewShown = false;

  var isMoreData = false;

  var showLoading = function () {

    isLoadingViewShown = true;

    ischeckinViewShown = false;
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

  var showcheckin = function () {

    ischeckinViewShown = true;

    isLoadingViewShown = false;
    isErrorViewShown = false;
    isEmptyViewShown = false;

    $ionicLoading.hide();
  };

  var showErrorView = function () {

    isErrorViewShown = true;

    ischeckinViewShown = false;
    isLoadingViewShown = false;
    isEmptyViewShown = false;

    $ionicLoading.hide();
  };

  var showEmptyView = function () {

    isEmptyViewShown = true;

    isErrorViewShown = false;
    ischeckinViewShown = false;
    isLoadingViewShown = false;

    $ionicLoading.hide();
  };

  var ensureMoreData = function (length) {
    isMoreData = false;
    // if (length > 0) {
    //   isMoreData = true;
    // }
    if (length > 6) {
      isMoreData = true;
    }
  };

  var setcheckin = function (checkin) {
    for (var i = 0;i < checkin.length;i++) {
      $scope.checkin.push(checkin[i]);
    }
  };

  var setCurrentPage = function (page) {
    $scope.params.page = page;
  };

  var loadCheckIn = function () {
    $log($scope.params);
    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      Checkin.all($scope.params).then( function (checkin) {
        $log(checkin);
        ensureMoreData(checkin.length);
        setCurrentPage($scope.params.page + 1);
        setcheckin(checkin);
        // checkin.getDistance($scope.params.location).then(function (location){
        //   $log(location);
        // });
        if ($scope.checkin.length === 0) {
          showEmptyView();
        } else {
          showcheckin();
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');

      }, function () {
        showErrorView();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      });

    }
  };

  $scope.onLoadMore = function () {
    loadCheckIn();
  };

  $scope.moreDataCanBeLoaded = function () {
    return isMoreData;
  };

  $scope.showLoadingView = function () {
    return isLoadingViewShown;
  };

  $scope.showcheckin = function () {
    return ischeckinViewShown;
  };

  $scope.showErrorView = function () {
    return isErrorViewShown;
  };

  $scope.showEmptyView = function () {
    return isEmptyViewShown;
  };

  $scope.onReload = function () {
    showLoading();
    $scope.params.page = 0;
    $scope.checkin = [];
    loadCheckIn();

  };

});
