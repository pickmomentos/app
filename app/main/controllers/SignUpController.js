'use strict';
/* global checkConnection */
angular.module('main')
.controller('SignUpCtrl',
  function ($scope, $state, $ionicLoading, $ionicModal, $translate, $rootScope,
    $filter, User, Toast, GoogleAnalytics, $log) {

    GoogleAnalytics.trackView('Pantalla de Crear cuenta');

    var trans;

    $translate(['emailInvalidText', 'formInvalidText', 'authInvalidText',
    'emailTakenText', 'signInError', 'loggedInAsText'])
      .then(function (myTranslations) {
        trans = myTranslations;
      });

    $scope.registrar = {};

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

    var showLogin = function () {
      $ionicLoading.hide();
    }

    var isEmailValid = function (email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

    var resetForms = function () {
      $scope.registrar.name = '';
      $scope.registrar.username = '';
      $scope.registrar.email = '';
      $scope.registrar.password = '';
      $scope.registrar.birth = '';
    }

    $scope.onSignUp = function (isFormValid) {

      if (!isEmailValid($scope.registrar.email) && $scope.registrar.email !== '') {
        Toast.show(trans.emailInvalidText);
      } else if (!isFormValid) {
        Toast.show(trans.formInvalidText);
      } else {
        var ConnectionData = checkConnection();
        $log.log(ConnectionData);
        if (ConnectionData.online !== true) {
          Toast.show('Internet desconectado');
        } else {
          showLoading();

          $scope.registrar.email = $filter('lowercase')($scope.registrar.email);
          User.signUp($scope.registrar).then(function () {
            showLogin();
            $rootScope.$emit('LoginSession', $scope.registrar);
          },
          function (error) {
            showLogin();
            $scope.msgError = angular.fromJson(error);
            var name = '';
            var mail = '';
            var pass = '';
            if (!angular.isUndefined($scope.msgError.form_errors.name)) {
              name = '<ion-item class="space-none">' + $scope.msgError.form_errors.name + '</ion-item>';
            }
            if (!angular.isUndefined($scope.msgError.form_errors.mail)) {
              mail = '<ion-item class="space-none">' + $scope.msgError.form_errors.mail + '</ion-item>';
            }
            if (!angular.isUndefined($scope.msgError.form_errors.pass)) {
              pass = '<ion-item class="space-none">' + $scope.msgError.form_errors.pass + '</ion-item>';
            }

            Toast.showPop(name + mail + pass);
          });
        }

      }
    }

    resetForms();

  });
