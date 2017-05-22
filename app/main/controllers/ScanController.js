'use strict';
/* global checkConnection */
angular.module('main')
.controller("scanController", function ($scope, $cordovaBarcodeScanner, Retos, User, Toast, $log, $state) {
  $scope.user = JSON.parse(User.getLocalVariable('user'));
  var ConnectionData = checkConnection();

  $scope.scanBarcode = function () {

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
    } else {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        $scope.QrCode = imageData.text.split('/');
        $log.log($scope.QrCode);
        $log.log($scope.QrCode[4]);
        //Invocar servicios para guardar la compra
        if (!angular.isUndefined($scope.QrCode[4])) {
          Retos.registrarCompra($scope.user.uid, $scope.QrCode[4]).then( function (response) {
            $log.log(response);
            Toast.show('Ha registrado una compra');
          }).catch( function (error) {
            $log.log(error);
            Toast.show('No se registro la compra');
          });
        }
        $log.log(imageData);
        // $state.go("app.home");
      }, function(error) {
        $log.log("An error happened -> " + error);

      });
    }
  };

});
