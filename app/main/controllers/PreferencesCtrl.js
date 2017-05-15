'use strict';
/* global checkConnection */
angular.module('main')
.controller('PreferencesCtrl', function ($scope, $ionicLoading, $state, $filter, GoogleAnalytics, Preferences, User, Toast, $log) {

  GoogleAnalytics.trackView('Search Place Screen');
  //extract storage user
  $scope.user = JSON.parse(User.getLoggedUser());
  var isLoadingViewShown = false;
  var isPlacesViewShown = false;
  var isEmptyViewShown = false;
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
  // Item List Arrays
  $scope.preferencesSelected = [];
  $log.log($scope.user);
  if (!angular.isUndefined($scope.user.field_preferencias.und)) {
    if ($scope.user.field_preferencias.und.length > 0) {
      angular.forEach($scope.user.field_preferencias.und, function (key, value) {
        $log.log(key.target_id);
        $log.log(value);
        $scope.preferencesSelected.push(key.target_id);
      });
    } else {
      $scope.preferencesSelected = [];
    }
  }
  $log.log($scope.preferencesSelected );

  // funcion para guardar y editar  las preferencias
  $scope.userUpdatePreferences = function (und) {
    showLoading();
    var token = User.getLocalVariable('token');
    var uid = User.getLocalVariable('user_id');
    $log.log('UND object : ', und);
    $log.log(token);

    var preferenciasArray = [];

    var itemLanguage = [];

    angular.forEach(und, function (value) {
      var item = [];
      item.target_id = value;
      //preferencias_array.und.push(item);
      itemLanguage.push(item);
    });

    preferenciasArray.push(itemLanguage);

    //field_saw_preference siemrpe debe viajar en cada peticion update
    var account = {
      uid: uid,
      field_preferencias: und,
      field_saw_preference: 1
    };
    $log.log(account);
    User.updatePreferences(account, token).then( function (success) {
      $log.log(success);
      $ionicLoading.hide();
      Toast.show(success.mensaje);
      $state.go('app.home');
      User.getCurrentUser(uid, token).then(function (data) {
        $log.log(data);
        User.setUserData('user', angular.toJson(data));
      });
    }, function (error) {
      $ionicLoading.hide();
      $log.log('error');
      $log.log(error);
      Toast.show(error);
    });
  };

  // funcion para guardar las preferencias en un array
  $scope.SavePreferences = function (valorpid, valorcid) {
    $log.log(valorcid);
    if ($scope.preferencesSelected.indexOf(valorpid) >= 0) {
      var i = $scope.preferencesSelected.indexOf(valorpid);
      $scope.preferencesSelected.splice(i, 1);
    }
    else {
      $scope.preferencesSelected.push(valorpid);
    }
    $log.log($scope.preferencesSelected);

  };
  // funcion para validad si ya existe selecionada una preferencia
  $scope.containsObject = function (valor) {
    $scope.indexDelete = '';
    var i;
    for (i = 0; i < $scope.preferencesSelected.length; i++) {
      if ($scope.preferencesSelected[i].target_id === valor) {
        return false;
      }
    }
    return true;
  };
  // funcion para buscar si  una preferencia  ya esta añadida
  $scope.searchPreferences = function (valor) {
    var i;
    for (i = 0; i < $scope.preferencesSelected.length; i++) {
      if ($scope.preferencesSelected.indexOf(valor) >= 0) {
        //if($scope.preferencesSelected[i].target_id == valor){
        return true;
      }
    }
    return false;
  };

  $scope.listPreferences = [];
  $scope.isLoading = true;
  var showErrorView = function () {

    isErrorViewShown = true;

    isPlacesViewShown = false;
    isLoadingViewShown = false;
    isEmptyViewShown = false;

    $ionicLoading.hide();
  };
  // funcion para cargar las Preferencias
  $scope.loadEvent = function (forceLoading) {

    var ConnectionData = checkConnection();

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
      showErrorView();
    } else {
      $scope.isLoading = true;
      showLoading();

      if (forceLoading === undefined) {
        forceLoading = false;
      }
      Preferences.getPreferences(forceLoading).then( function (data) {
        $scope.listPreferences = data;
        $log.log(data);
        $scope.isLoading = false;
        $ionicLoading.hide();
      });
    }

  };
});
