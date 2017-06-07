'use strict';
/* global checkConnection */
angular.module('main')
.controller('SignInCtrl',
function ($scope, $state, $ionicLoading, $ionicModal, $translate, $rootScope,
$filter, Dialog, User, Toast, GoogleAnalytics, $log) {

  GoogleAnalytics.trackView('Pantalla de inicio de sesion');

  var trans;

  $translate(['formInvalidText', 'authInvalidText', 'signInError',
  'loggedInAsText', 'recoverPasswordSuccessText', 'emailNotFoundText'])
  .then(function (myTranslations) {
    trans = myTranslations;
  });

  $scope.login = {};
  $rootScope.facebookOption = false;
  $scope.showRecoverPasswordForm = false;
  //animation showLoading
  var showLoading = function () {

    $ionicLoading.show({
      templateUrl: 'main/templates/loading.html',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      scope: $scope,
      showDelay: 0
    });
  }
  // function hide login icon riple
  var showLogin = function () {
    $ionicLoading.hide();
  }
  // LCleam form login
  var resetForms = function () {
    $scope.login.username = '';
    $scope.login.password = '';
    $scope.login.email = '';
  }
  //funcion callback
  $rootScope.$on('LoginSession', function (event, login) {
    $log.log('iniciado');
    $log.log(login);
    $rootScope.facebookOption = true;
    $scope.onSignIn(true, login);
  });

  // function Login
  $scope.onSignIn = function (isFormValid, login) {
    var ConnectionData = checkConnection();
    $log.log(ConnectionData);
    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
    } else {
      $log.log('Datos de login');
      $log.log(login);
      if (login !== '') {
        $scope.login.username = login.username;
        $scope.login.password = login.password;
        $scope.login.email = login.email;
      }
      if (!isFormValid) {
        //Toast libray show modal
        Toast.show(trans.formInvalidText);
        return;
      }
      showLoading();

      $scope.login.username = $filter('lowercase')($scope.login.username);
      $log.log($scope.login.username);
      User.getToken().then(function (sToken) {

        User.signIn($scope.login, sToken).then(function (data) {
          showLogin();
          //Login exitoso, recopilamos la información que necesitamos para mantener la sesión abierta
          User.setUserData('user', angular.toJson(data.user));
          // sessid, session_name, tokenJSON.stringify
          User.setUserData('user_name', $scope.login.username);
          User.setUserData('sessid', data.sessid);
          User.setUserData('session_name', data.session_name);
          User.setUserData('token', data.token);
          User.setUserData('user_id', data.user.uid);
          if ($rootScope.facebookOption === true) {
            var FacebookData = JSON.parse(User.getLocalVariable('FacebookData'));
            $log.log('FacebookData');
            $log.log(FacebookData);
            if (FacebookData !== '') {
              // Actualizar datos de facebook
              User.updateWithFacebookData(FacebookData, data.user.uid, data.token).then(function (success) {
                $log.log(success);
              }, function (error) {
                $log.log(error);
              });
            }
          }


          if (data.user.field_saw_preference.und[0].value === '1') {
            $state.go('app.home');
          } else {
            $state.go('app.preferences');
          }

          //Toast library show modal
          Toast.show(trans.loggedInAsText + ' ' + $scope.login.username);
          // encriptar data  y guardarla en storage
          resetForms();
          $scope.$emit('MenuInit', 1);
          $rootScope.$broadcast('onUserLogged');
        }, function (error) {
          $log.log(error);
          showLogin();
          Toast.show(error);
        });

      });
    }
  };
    // function thta show modal of password
  $scope.onRecoverPassword = function (bool) {
    $scope.showRecoverPasswordForm = bool;
  }

    // function for recoverPassword
  $scope.recoverPassword = function (isFormValid) {
    //valida el campo vacio
    if (!isFormValid) {
      Toast.show(trans.formInvalidText);
    } else {
      var ConnectionData = checkConnection();
      $log.log(ConnectionData);
      if (ConnectionData.online !== true) {
        Toast.show('Internet desconectado');
      } else {
        showLoading();
        User.recoverPassword($scope.login.email).then(function (data) {
          showLogin();
          $log.log(data);
          $log.log(data[0]);
          if (data[0] === true) {
            $scope.showRecoverPasswordForm = false;
            Toast.show(trans.recoverPasswordSuccessText);
          } else {
            $scope.showRecoverPasswordForm = false;
            Toast.show(trans.emailNotFoundText);
          }
        }, function (error) {
          showLogin();
          $log.log(error);
          Toast.show(error);
        });
      }

    }
  }

  resetForms();

});
