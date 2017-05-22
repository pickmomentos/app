'use strict';
angular.module('main')
.controller('AuthCtrl',
  function ($scope, $state, $ionicLoading, $ionicModal, $translate, $rootScope,
    $q, Facebook, Dialog, User, Toast, GoogleAnalytics, $log, $ionicHistory, $ionicPlatform, AdMobService, $cordovaSplashscreen) {

    GoogleAnalytics.trackView('Auth Screen');
    // $ionicPlatform.registerBackButtonAction(function (event) {
    //   $log.log(event);
    //   $log.log($state.current.name);
    //   if ($state.current.name === 'main') {
    //     $ionicPopup.confirm({
    //       title: 'Alerta',
    //       content: 'Estas seguro de  salir de pick'
    //     })
    //     .then(function (result) {
    //       if (result) {
    //         ionic.Platform.exitApp();
    //       }
    //     });
    //   }
    //   else {
    //     $state.go('app.home');
    //   }
    // }, 100);

    $scope.Facebooklogin = {};

    var showLoading = function () {

      $ionicLoading.show({
        templateUrl: 'main/templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        scope: $scope,
        showDelay: 0
      });
    };

    var hideLoading = function () {
      $ionicLoading.hide();
    };

    var processFacebookLogin = function (fbAuthData) {

      showLoading();
      // var fbData = null;
      Facebook.me().then(function (data) {
        $log.log(fbAuthData);
        User.signInViaFacebook(fbAuthData, data).then(function (result) {
          $log.log('inicio');
          $log.log(data);
          if (result.message === 'OK') {
            $log.log('Entro');
            User.setLocalVariable('FacebookData', angular.toJson(data));
            $log.log(result.status);
            if (result.status === '2') {
              $scope.Facebooklogin.username = result.data.user;
              $scope.Facebooklogin.password = result.data.class;
              $rootScope.$emit('LoginSession', $scope.Facebooklogin);
              $log.log($scope.Facebooklogin);
              // $rootScope.$emit('LoginSession', $scope.Facebooklogin);
            }
            if (result.status === '1') {
              $scope.Facebooklogin.username = result.data.name;
              $scope.Facebooklogin.password = result.data.class;
              $log.log($scope.Facebooklogin);
              $rootScope.$emit('LoginSession', $scope.Facebooklogin);
            }

            // $rootScope.$broadcast('LoginSession', $scope.Facebooklogin);
          }
        }, function (error) {
          $log.log(error);

        });
        hideLoading();

        // $scope.closeAuthModal();
        // $rootScope.$broadcast('onUserLogged');
        // Toast.show(trans.loggedInAsText + ' ' + user.get('email'));
      });
      // var fbData = null;
      //
      // return Facebook.me().then(function (data) {
      //   fbData = data;
      //
      //   // return User.findByEmail(data.email);
      // }).then(function (user) {
      //
      //   if (!user.id) {
      //     return User.signInViaFacebook(fbAuthData);
      //   } else if (user.get('authData')) {
      //
      //     if (user.get('authData').facebook.id === fbData.id) {
      //       return User.signInViaFacebook(fbAuthData);
      //     }
      //   } else {
      //     var deferred = $q.defer();
      //     deferred.reject(trans.emailFacebookTakenText);
      //     return deferred.promise;
      //   }
      // }).then(function () {
      //   return User.updateWithFacebookData(fbData);
      // }).then(function (user) {
      //hideLoading();
      //   $scope.closeAuthModal();
      //   $rootScope.$broadcast('onUserLogged');
      // Toast.show(trans.loggedInAsText + ' ' + user.get('email'));
      // }, function (error) {
      //   hideLoading();
      //   Dialog.alert(error);
      // })
    }
    // Login con facebook
    $scope.onLoginViaFacebook = function () {

      Facebook.getCurrentUser().then(function (response) {

        if (response.status === 'connected') {
          processFacebookLogin(response);
        } else {
          Facebook.logIn().then(function (authData) {
            processFacebookLogin(authData);
          }, function (error) {
            hideLoading();
            Dialog.alert(error.errorMessage);
          });
        }
      });
    };

    $scope.closeAuthModal = function () {
      $rootScope.$broadcast('onCloseAuthModal');
    };

    $ionicModal.fromTemplateUrl('main/templates/sign-up.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal) {
      $scope.signUpModal = modal;
    });

    $ionicModal.fromTemplateUrl('main/templates/sign-in.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal) {
      $scope.signInModal = modal;
    });

    $scope.openSignInModal = function () {
      $scope.signInModal.show();
    };

    $scope.closeSignInModal = function () {
      $scope.signInModal.hide();
    };

    $scope.openSignUpModal = function () {
      $scope.signUpModal.show();
    };

    $scope.closeSignUpModal = function () {
      $scope.signUpModal.hide();
    };

    var onUserLogged = $rootScope.$on('onUserLogged', function () {
      $scope.closeSignUpModal();
      $scope.closeSignInModal();
    });

    $scope.$on('$destroy', function () {
      $scope.signUpModal.remove();
      $scope.signInModal.remove();
      onUserLogged();
    });

    $scope.$on('$ionicView.loaded', function () {
      $ionicPlatform.ready(function () {
        if (navigator && navigator.splashscreen) {
          $cordovaSplashscreen.hide();
        }
      });
    });
  });
