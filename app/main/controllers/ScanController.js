'use strict';
angular.module('main')
.controller("scanController", function ($scope, $cordovaBarcodeScanner, Retos, User, Toast, $log) {
  $scope.user = JSON.parse(User.getLocalVariable('user'));
  $scope.scanBarcode = function () {
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
    }, function(error) {
      $log.log("An error happened -> " + error);

    });
  };

});
