'use strict';
angular.module('main')
.controller('MenuCtrl',
  function ($scope, $rootScope, $state, $translate, $timeout, $ionicLoading,
    $ionicModal, $localStorage, User, Toast, Menu, $window, Facebook, $log, $ionicHistory) {

    $scope.user = JSON.parse(User.getLoggedUser());
    $scope.storage = $localStorage;
    var isErrorView = false;
    var isLoadingViewShown = false;

    var showLoading = function () {

      isLoadingViewShown = true;

      isErrorView = false;

      $ionicLoading.show({
        templateUrl: 'main/templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        scope: $scope,
        showDelay: 0
      });
    };

    var trans;
    $translate(['loggedOutText']).then(function (translations) {
      trans = translations;
    });
    $scope.versionador = function () {
      var version = User.getLocalVariable('version');
      $log.log(version);
      if (version === '') {
        User.version().then( function (response) {
          console.log("menu");
          console.log(response);
          if (response.message === 'OK') {
            User.setLocalVariable('version', response.data.pick_customer_version_menu_numero);
            $scope.MenuDinamico(true);
          }else {
            $scope.listMenu = [];
          }
        });
      } else {
        $log.log('si tiene');
        User.version().then( function (response) {
          console.log("menu");
          console.log(response);
          $log.log(parseInt(version));
          $log.log(response.data.pick_customer_version_menu_numero);
          if (parseInt(version) === response.data.pick_customer_version_menu_numero) {
            $log.log('false');
            $scope.MenuDinamico(false);
          } else {
            if (response.message === 'OK') {
              User.setLocalVariable('version', response.data.pick_customer_version_menu_numero);
              $scope.MenuDinamico(true);
            }
          }
        });
      }
    };
    var showErrorView = function () {
      isErrorView = true;
      isLoadingViewShown = false;
      $ionicLoading.hide();
    };
    $scope.showErrorView = function () {
      return isErrorView;
    };
    $scope.onReload = function () {
      $scope.versionador();
      
    };
    $scope.MenuDinamico = function (version) {
      // $scope.isLoading = true;
      Menu.getMenu(version).then(function (data) {
        console.log("menu");
        $scope.listMenu = data;
        $log.log($scope.listMenu);
      }, function (error) {
        $log.log(error);
        Toast.show(error);
      });
    };
    $ionicModal.fromTemplateUrl('main/templates/settings.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('main/templates/auth-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.authModal = modal;
    });

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

    $scope.onNavigateToCategories = function () {
      $state.go('app.categories');
    };

    $scope.onPreferences = function () {
      $state.go('app.preferences');
    };

    $scope.onNavigateToSearch = function () {
      $state.go('app.search');
    };

    $scope.onCheckIn = function () {
      $state.go('app.checkin');
    };

    $scope.onNavigateToProfile = function () {
      if ($scope.user) {
        $state.go('app.profile');
      } else {
        $scope.authModal.show();
      }
    };

    $scope.onNavigateToWalkthrough = function () {
      $scope.onCloseSettings();
      $state.go('walkthrough', {
        force: true
      });
    }

    $scope.onNavigateToFavorites = function () {
      if ($scope.user) {
        $state.go('app.favorites');
      } else {
        $scope.authModal.show();
      }
    }

    $scope.onOpenSettings = function () {
      $scope.modal.show();
    };

    $scope.onCloseSettings = function () {
      $scope.modal.hide();
    };

    $scope.onLogIn = function () {
      $scope.authModal.show();
    };

    $scope.onLanguageSelected = function (lang) {
      $scope.storage.lang = lang;
      $translate.use(lang);
    }

    $scope.onUnitSelected = function (unit) {
      $scope.storage.unit = unit;
    };

    $scope.onMapTypeSelected = function (type) {
      $scope.storage.mapType = type;
    };

    $scope.getPicture = function () {
      if ($scope.user.field_imagen_url.und[0].value) {
        return $scope.user.field_imagen_url.und[0].value;
      }
      return 'main/assets/images/avatar.png';
    };
    $scope.onLogoutFacebook = function () {
      Facebook.logOut().then( function (close) {
        $log.log(close);
      });
    };
    $scope.onLogout = function () {
      showLoading();
      $timeout(logout, 1000);
    };

    function logout () {
      var loggged = User.IsLoggedUser();
      if (loggged === true) {
        $log.log(loggged);
        // var token = User.setLocalVariable('token');
        // var options = {
        //   uid: User.setLocalVariable('user_id'),
        //   'X-CSRF-Token' : token,
        // };
        // user_logout(options,{
        //   success:function(result){
        //     $log.log(result);
        //     if (result[0]) {
        //       $log.log("Logged out!");
        //     }
        //   }
        //   ,error:function(xhr,status,message){
        //     $log.log(xhr);
        //     $log.log(message);
        //   }
        // });
        $window.localStorage.removeItem('user');
        $window.localStorage.removeItem('sessid');
        $window.localStorage.removeItem('session_name');
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('user_id');
        $window.localStorage.removeItem('user_name');
        $window.localStorage.removeItem('FacebookData');
        $window.localStorage.removeItem('Preferencias');
        $ionicLoading.hide();
        $scope.user = null;
        $scope.onLogoutFacebook();
        Toast.show(trans.loggedOutText);

        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('main');
      } else {
        $log.log(loggged);
      }
    }

    $rootScope.$on('onPhotoUpdated', function () {
      $scope.user = User.getLoggedUser();
    });

    $rootScope.$on('onAccountDeleted', function () {
      $scope.user = User.getLoggedUser();
    });

    $rootScope.$on('onUserLogged', function () {
      $scope.user = JSON.parse(User.getLoggedUser());
      $scope.authModal.hide();
    });

    $rootScope.$on('onCloseAuthModal', function () {
      $scope.authModal.hide();
    });
  });
