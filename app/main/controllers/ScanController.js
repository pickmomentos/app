'use strict';
/* global checkConnection */
angular.module('main')
.controller("scanController", function ($scope, $cordovaBarcodeScanner, Retos, User, Toast, $log, $state, $ionicModal, $stateParams) {
  $scope.user = JSON.parse(User.getLocalVariable('user'));
  var ConnectionData = checkConnection();
  console.log($stateParams);
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
           $scope.openProcesoRetoModal(response);
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
  // Modal de repeticion de retos
   $ionicModal.fromTemplateUrl('main/templates/procesoReto-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.procesoRetosModal = modal;
    });
  $scope.openProcesoRetoModal = function (codigo) {

    $scope.retoText = "Ha registrado una compra";
    $scope.procesoReto = codigo.retos[0];

    angular.forEach($scope.procesoReto.ttx, function (value, key) {
      console.log($scope.procesoReto.ttx[key]);
      if ($scope.procesoReto.ttx[key].suma >= $scope.procesoReto.ttx[key].repeticiones) {
        $scope.procesoReto.ttx[key].isPendiente = true;
      }
    });

    $scope.procesoRetosModal.show();
  };

  $scope.closeProcesoRetoModal = function () {
    $scope.procesoRetosModal.hide();
  };

  $scope.scanBarcodeGift = function () {

    if (ConnectionData.online !== true) {
      Toast.show('Internet desconectado');
    } else {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        $scope.QrCode = imageData.text.split('/');
        $log.log($scope.QrCode);
        $log.log($scope.QrCode[4]);
        //Invocar servicios para guardar la compra
        if (!angular.isUndefined($scope.QrCode[4])) {
          Retos.reclamarPremio($scope.user.uid, $stateParams.sid, $scope.QrCode[4]).then( function (response) {
            $log.log(response);
            Toast.showPop('Premio reclamado');
          //  $scope.openProcesoRetoModal(response);
          }).catch( function (error) {
            $log.log(error);
            Toast.show('No se reclamo el premio');
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
