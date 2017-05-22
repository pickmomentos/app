'use strict';
angular.module('main')
.controller('PlaceDetailCtrl', function ($scope, $rootScope, $stateParams, $ionicLoading,
  $cordovaInAppBrowser, $ionicModal, $translate, $state, $ionicSlideBoxDelegate,
  Place, Checkin, Favorites, Review, Share, GoogleAnalytics, Toast, User, ActionSheet, AdMobService, Camera, File, Retos, $ionicScrollDelegate, $window, $log) {
  // GoogleAnalytics
  GoogleAnalytics.trackView('Place Detail Screen');
  // DEFINICIÓN DE VARIABLES
  var isLoadingViewShown = false;
  var isPlaceViewShown = false;
  var isErrorViewShown = false;
  var isSubmittingCheckin = false;
  var isSubmittingStar = false;
  $scope.user = JSON.parse(User.getLocalVariable('user'));
  $log.log($scope.user);
  //efecto de scroll header
  $scope.changeHeader = function (id) {
    var el = document.getElementById(id),
      windowHeight = $window.innerHeight,
      scrollPosition = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().top - windowHeight / 5;
    var alpha = scrollPosition / windowHeight * 3;
    $log.log(windowHeight);
    $log.log($ionicScrollDelegate.$getByHandle('handler').getScrollPosition());
    el.style.backgroundColor = 'rgba(252,193,0,' + alpha + ')';
  };

  angular.element(document).ready(function () {
    document.getElementById('myFunction').onscroll = function () {

      $log.log('scrolling!');
      $scope.changeHeader('ben-header');

    };
  });

  // DEFINICIÓN DE VALORES $scope
  $scope.images = [];
  $scope.reviews = [];
  $scope.review = {
    place: null,
    rating: 0,
    comment: ''
  };
  $scope.checkin = {
    place: null,
    comment: '',
    image: '',
    estado: 0,
  };
  $scope.maxRating = 5;
  $scope.readOnly = true;

  // translations
  var trans;
  $translate(['commentRequiredErrorText', 'commentTooShortErrorText', 'chooseOptionText',
    'successSubmitReviewText', 'photoLibraryText', 'cameraText', 'cancelText', 'successSubmitCheckinText'])
    .then(function (myTranslations) {
      trans = myTranslations;
    });
  // FUNCION  QUE MUESTRA EL LOADING
  $scope.showLoading = function () {

    isLoadingViewShown = true;

    isPlaceViewShown = false;
    isErrorViewShown = false;

    $ionicLoading.show({
      templateUrl: 'main/templates/loading.html',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      scope: $scope,
      showDelay: 0
    });
  };
  // FUNCION PARA  MOSTRA LOS LUGARES
  var showPlace = function () {

    isPlaceViewShown = true;

    isLoadingViewShown = false;
    isErrorViewShown = false;

    $ionicLoading.hide();
  };
  // FUNCION PARA MOSTRAR LOS MENSAJES DE ERROR
  var showErrorView = function () {

    isErrorViewShown = true;
    isPlaceViewShown = false;
    isLoadingViewShown = false;

    $ionicLoading.hide();
  };
  // FUNCION PARA SETEAR EL VALOR DEL LUGAR
  $scope.setPlace = function (place) {

    $log.log(place);
    $log.log(place.imagen);
    $scope.place = place;
    $scope.review.place = place;
    if (place.imagen) {

      angular.forEach(place.imagen, function (key, value) {
        $log.log(value);
        $scope.images.push(key);
      });
    }
  };
  // FUNCION PARA SETEAR LOS Retos
  $scope.setChallenges = function (retos) {
    $scope.retos = retos;
  };

  // FUNCION PARA CARGAR EL LUGAR
  $scope.loadPlace = function () {
    $log.log($stateParams.placeId);
    $scope.obj = $stateParams.obj;
    $log.log($stateParams.obj);
    Place.get($stateParams.placeId).then(function (place) {
      $log.log(place);
      angular.forEach(place, function (key, value) {
        $log.log(value);
        $scope.setPlace(key);
      });
      showPlace();
    }, function () {
      showErrorView();
    });
  };

  // FUNCIÓN PARA CARGAR RETEOS
  $scope.gotoRetos = function (id) {
    $state.go('app.challenges', {placeId: id} );
  };
  $scope.loadChallanges = function () {

    Retos.getChallangesById($stateParams.placeId).then( function (retos) {
      $log.log(retos);
      $scope.setChallenges(retos);
    });
  };

  // FUNCION PARA CARGAR LOS REVIEWS - COMENTARIOS
  $scope.loadReviews = function () {

    Review.all($stateParams.placeId, $scope.user.uid).then( function (reviews) {
      $scope.reviews = reviews;
    });
  };
  // FUNCION PARA VERIFICAR SI TIENE ME GUSTA EL LUGAR
  $scope.isPlaceLiked = function () {
    $log.log($stateParams.placeId);
    Favorites.isLiked($scope.user.uid, $stateParams.placeId).then(function (isLiked) {
      $log.log('like');
      $log.log(isLiked);
      if (isLiked > 0) {
        $scope.isLiked = true;
      } else {
        $scope.isLiked = false;
      }
      $log.log($scope.isLiked);
    });
  };
  // FUNCION PARA VERIFICAR QUE YA HA SIDO VALORADO EL SITIO (ESTRELLAS)
  $scope.isPlaceStarred = function () {
    Review.isStarred($scope.user.uid, $stateParams.placeId).then(function (isStarred) {
      $log.log(isStarred);
      $scope.review.rating = isStarred.valor;
      $scope.review.comment = isStarred.texto;
      $scope.isStarred = isStarred.valor;
    });
  };
  // RESET VIESTA POR DATA
  var resetReviewData = function () {
    $scope.review.rating = 0;
    $scope.review.comment = '';
  };
  var resetCheckinData = function () {
    $scope.checkin.estado = 0;
    $scope.checkin.comment = '';
  };


   // MODAL PARA MOSTRAR el rating
  $ionicModal.fromTemplateUrl('main/templates/star-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.starModal = modal;
  });

  // MODAL PARA MOSTRAR LOS checkin
  $ionicModal.fromTemplateUrl('main/templates/checkin-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.checkinModal = modal;
  });
  // MODAL PARA MOSTRAR LOS compartir
  $ionicModal.fromTemplateUrl('main/templates/share-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.shareModal = modal;
  });
  // MODAL PARA MOSTRAR LAS IMAGENES
  $ionicModal.fromTemplateUrl('main/templates/photos-modal.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function (modal) {
    $scope.photosModal = modal;
  });

  $scope.uploadImageOne = function () {
    var d = new Date();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var day = d.getDate();
    var date = year + '/' + month + '/' + day  + '/';
    ActionSheet.show({
      title: trans.chooseOptionText,
      cancelText: trans.cancelText,
      options: [trans.photoLibraryText, trans.cameraText]
    }).then(function (option) {

      var sourceType;
      if (option === 1) {
        sourceType = 'photoLibrary';
      }

      if (option === 2) {
        sourceType = 'camera';
      }

      return Camera.getPicture({sourceType: sourceType});
    }).then(function (image) {
      $scope.isImageOneUploading = true;
      //guarda image
      return File.upload(image, $scope.user.uid, date);
    }).then(function (response) {
      // loadImage
      return File.loadImage(response.fid);
    }).then(function (savedFile) {
      $scope.isImageOneUploading = false;
      $scope.place.image = savedFile.listado;
      $scope.checkin.fid = savedFile.fid;
    }, function () {
      $scope.isImageOneUploading = false;
    })
  };

  $scope.openPhotosModal = function (index) {
    // $log.log(i);
    $ionicSlideBoxDelegate.$getByHandle('modalPhotosSlideBoxHandle').slide(index);
    $scope.photosModal.show();
  }

  $scope.closePhotosModal = function () {
    $scope.photosModal.hide();
  };

  $scope.closeStarModal = function () {
    $scope.starModal.hide();
  };


  $scope.openStarModal = function () {

    if (User.getLoggedUser()) {
      $scope.starModal.show();
    }
  };

  $scope.openCheckModal = function () {

    if (User.getLoggedUser()) {
      $scope.checkinModal.show();
    }
  };
  $scope.closeCheckModal = function () {
    $scope.checkinModal.hide();
    resetCheckinData();
  };
  $scope.openShareModal = function () {

    if (User.getLoggedUser()) {
      $scope.shareModal.show();
    }
  };
  $scope.closeShareModal = function () {
    $scope.shareModal.hide();
  };

  $scope.onSubmitStarred = function () {
    if ($scope.review.comment === '') {
      Toast.show(trans.commentRequiredErrorText);
    } else if ($scope.review.comment.length < 10) {
      Toast.show(trans.commentTooShortErrorText);
    } else {
      isSubmittingStar = true;

      Review.star($scope.user.uid, $stateParams.placeId, $scope.review.rating, $scope.review.comment ).then(function (star) {
        $log.log(star);
        Toast.show(trans.successSubmitReviewText);
        resetReviewData();
        isSubmittingStar = false;
        $scope.closeStarModal();
        $scope.isPlaceStarred();

        if (AdMobService.canShowInterstitial()) {
          AdMobService.showInterstitial();
        }

      }, function (error) {
        $log.error(error.message);
        Toast.show(error.message);
        isSubmittingStar = false;
      });
    }
  };
  //CHECKIN
  $scope.onSubmitCheckin = function (estado) {
    if (estado  === 'create') {
      $scope.checkin.estado = 1;
    }
    if ($scope.checkin.comment === '') {
      Toast.show(trans.commentRequiredErrorText);
    } else if ($scope.checkin.comment.length < 10) {
      Toast.show(trans.commentTooShortErrorText);
    } else {

      isSubmittingCheckin = true;
      $log.log($scope.checkin.fid);
      Checkin.checkin($scope.user.uid, $stateParams.placeId, $scope.checkin.comment, $scope.checkin.estado, $scope.checkin.fid).then(function (checkin) {
        $log.log(checkin);
        Toast.show(trans.successSubmitCheckinText);
        resetCheckinData();
        isSubmittingCheckin = false;
        $scope.closeCheckModal();

        if (AdMobService.canShowInterstitial()) {
          AdMobService.showInterstitial();
        }

      }, function (error) {
        $log.error(error.message);
        Toast.show(error.message);
        isSubmittingCheckin = false;
      });
    }
  };

  $scope.onLikePlace = function () {

    if ($scope.isLiking) {
      return;
    }

    if (User.getLoggedUser()) {

      $scope.isLiking = true;
      var valor = 0;
      $log.log('vamo a guarda');
      $log.log($scope.isLiked);
      if ($scope.isLiked === false) {
        valor = 1;
      }
      $log.log(valor);
      Favorites.like($scope.user.uid, $stateParams.placeId, valor).then(function (response) {
        if (response.message === 'OK') {
          if ($scope.isLiked === false) {
            $scope.isLiked = true;
          } else {
            $scope.isLiked = false;
          }
        }
        // isPlaceLiked();
        $scope.isLiking = false;

        if (AdMobService.canShowInterstitial()) {
          AdMobService.showInterstitial();
        }
      }, function () {
        $scope.isLiking = false;
      });
    }
  };


  $scope.$on('$destroy', function () {
    // $scope.reviewModal.remove();
    $scope.starModal.remove();
    $scope.checkinModal.remove();
    $scope.photosModal.remove();
    $scope.shareModal.remove();
  });

  $scope.isSubmittingCheckin = function () {
    return isSubmittingCheckin;
  };
  $scope.isSubmittingStar = function () {
    return isSubmittingStar;
  };
  $scope.showLoadingView = function () {
    return isLoadingViewShown;
  };

  $scope.showPlace = function () {
    return isPlaceViewShown;
  };

  $scope.showErrorView = function () {
    return isErrorViewShown;
  };

  $scope.onReload = function () {
    $scope.showLoading();
    $scope.loadPlace();
  };

  //FUNCIÓN PARA COMPARTIR EL LUGAR
  $scope.onShare = function () {
    Share.sharePlace($scope.place);
  };
  //FUNCIÓN PARA COMPARTIR EL LUGAR
  $scope.onShareFacebook = function () {
    Share.sharePlaceFacebook($scope.place);
  };
  //FUNCIÓN PARA COMPARTIR EL LUGAR
  $scope.onShareWhatsapp = function () {
    Share.sharePlaceWhastapp($scope.place);
  };
  //FUNCIÓN PARA COMPARTIR EL LUGAR
  $scope.onSharetwitter = function () {
    Share.sharePlaceTwitter($scope.place);
  };
  //FUNCION PPARA ABRI URL ANALYTICS
  $scope.openUrl = function (url) {
    $cordovaInAppBrowser.open(url, '_system');
    GoogleAnalytics.trackEvent('Open Website Button', 'Click', url);
  };
  // FUNCION PARA ABRIR MAPA GMAP
  $scope.openGoogleMaps = function (lat, lng) {
    var url = 'http://maps.google.com/?daddr=' + lat + ',' + lng + '';
    $cordovaInAppBrowser.open(url, '_system');
    GoogleAnalytics.trackEvent('Get Directions Button', 'Click', url);
  };
  // FUNCION PARA VALIDAR QUE EXISTAN COMENTARIOS
  $scope.existReviews = function () {
    return $scope.reviews.length > 0;
  };
  // FUNCION PARA VERIFICAR QUE EXISTAN IMAGENES
  $scope.existImages = function () {
    return $scope.images.length > 0;
  };
  // FUNCION PARA CARGAR LAS FUNCIONES DEL DETALLE DEL LUGAR
  $scope.$on('$ionicView.enter', function (scopes, states) {
    if (states.direction === 'forward') {
      $scope.showLoading();
      $scope.loadPlace();
      $scope.loadReviews();
      $scope.isPlaceLiked();
      $scope.isPlaceStarred();
      $scope.loadChallanges();
    }
  });
});
