'use strict';
/*global Parse cordova */
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ngStorage',
  'ngAnimate',
  'imgFallback',
  'pascalprecht.translate',
  'pasvaz.bindonce',
  'ionic.rating',
  'angular.filter'
])
.run(function ($ionicPlatform, $rootScope, $state, $localStorage, User,
  Pushwoosh, GoogleAnalytics, Config, StatusBar, $cordovaGlobalization,
  $translate, AdMobService, $window, $ionicPopup, $log) {
  //User,
  $rootScope.theme = Config.ENV.theme;
  $rootScope.logo = Config.ENV.SERVER_URL_LOGO;

  if (!$localStorage.unit) {
    $localStorage.unit = Config.ENV.unit;
  }

  if (!$localStorage.mapType) {
    $localStorage.mapType = Config.ENV.mapType;
  }

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

    if (toState.name === 'walkthrough' && $localStorage.walkthrough && !toParams.force) {
      $state.go('main');
      event.preventDefault();
    }
  });

  Parse.initialize(Config.ENV.parse.appId);
  Parse.serverURL = Config.ENV.parse.serverUrl;
  $ionicPlatform.ready(function () {
    if (window.Connection) {
      if (navigator.connection.type === Connection.NONE) {
        $log.log('no hay conexion');
        $ionicPopup.confirm({
          title: 'Internet desconectado',
          content: 'El internet está desconectado en tu dispositivo'
        })
        .then(function (result) {
          if (!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }
    if ($window.localStorage.getItem('user') !== null) {
      // var validateUser = JSON.parse($window.localStorage.getItem('user'));
      $state.go('app.home');
    }

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if ($localStorage.lang) {
      $translate.use($localStorage.lang);
    } else {
      if (typeof navigator.globalization !== 'undefined') {
        $cordovaGlobalization.getPreferredLanguage().then(function (language) {
          $translate.use((language.value).split('-')[0]);
        }, null);
      }
    }

    AdMobService.prepareInterstitial(
      Config.ENV.admob.interstitialForAndroid,
      Config.ENV.admob.interstitialForiOS);

    StatusBar.init(Config.ENV.statusBarColor);
    GoogleAnalytics.init(Config.ENV.gaTrackingId);

    Pushwoosh.init(Config.ENV.push.appId, Config.ENV.push.googleProjectNumber);
    Pushwoosh.registerDevice()
      .then(function (result) {
        $log.log('PushWoosh response on registerDevice: ' + result);
      });
  });
})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,
  $provide, $translateProvider, $logProvider, $compileProvider) {
    var DEBUG = true;

    // Deshabilita los logs en producción
    $logProvider.debugEnabled(DEBUG);

    $compileProvider.debugInfoEnabled(DEBUG);
    $provide.decorator('$log', function ($delegate) {
        //Original methods
        var origInfo = $delegate.info;
        var origLog = $delegate.log;

        //Override the default behavior
        $delegate.info = function () {

            if ($logProvider.debugEnabled())
                origInfo.apply(null, arguments)
        };

        //Override the default behavior
        $delegate.log = function () {

            if ($logProvider.debugEnabled())
                origLog.apply(null, arguments)
        };

        return $delegate;
    });

    // Disables javascript scrolling (fix for android)
    //$ionicConfigProvider.scrolling.jsScrolling(false);
    Drupal.settings.site_path = "http://dev.pick.com.ec/";
    //Drupal.settings.site_path = "http://devel.local/pick-backend";
    // Set the Service Resource endpoint path.
    Drupal.settings.endpoint = "rest";
    // Set to true to enable local storage caching for entities.
    Drupal.settings.cache.entity.enabled = true;
    Drupal.settings.debug=true;
    // Number of seconds before cached copy expires. Set to 0 to cache forever, set
    // to 60 for one minute, etc.
    Drupal.settings.cache.entity.expiration = 60*60*24;
  $ionicConfigProvider.tabs.position('bottom');
  $translateProvider.translations('en', {
    appTitle: 'Pick',
    categoriesTitle: 'Categories',
    checkinTitle: 'My checkin',
    preferencesTitle: 'Preferences',
    placesTitle: 'Places',
    reviewsTitle: 'Reviews',
    profileTitle: 'Profile',
    newPlaceTitle: 'New place',
    mapTitle: 'Map',
    FavoritesTitle: 'My favorites',
    nearmeText: 'Near me',
    addNewPlaceText: 'Add a place',
    profileText: 'Profile',
    preferencesText: 'Preferences',
    settingsText: 'Settings',
    logoutText: 'Log Out',
    signInViaFacebook: 'Login with Facebook',
    signInText: 'Sign In',
    signUpText: 'Create an Account',
    signUpSubmitText: 'Sign Up',
    signInError: 'Login failed',
    nameText: 'Name',
    emailText: 'Email',
    passwordText: 'Password',
    birthText: 'Birthday',
    userText: 'User',
    userSinceText: 'User since',
    getDirectionsText: 'Get directions',
    callToText: 'Call to',
    openWebsiteText: 'Open website',
    closeText: 'close',
    okText: 'Ok',
    placesNotFoundText: 'There are no places nearby. Please try another option',
    reviewsNotFoundText: 'No reviews yet.',
    errorText: 'Ooops. There was an error...',
    tryAgainText: 'Try again',
    distanceUnitText: 'Distance unit',
    emailInvalidText: 'Email is invalid',
    formInvalidText: 'Fill the required fields',
    authInvalidText: 'Invalid credentials',
    emailTakenText: 'The email has already been taken',
    twoBlocksText: '2 blocks',
    sixBlocksText: '6 blocks',
    chooseDistanceText: 'Choose a distance',
    mapTypeText: 'Map type',
    normalMapText: 'Normal',
    satelliteMapText: 'Satellite',
    searchInThisAreaText: 'Search in this area',
    inputTitleText: 'Name *',
    inputDescriptionText: 'Description',
    labelDescriptionText: 'Description',
    inputCategoryText: 'Choose a category *',
    inputAddressText: 'Address',
    inputPhoneText: 'Phone',
    inputWebsiteText: 'Website',
    buttonSubmitPlaceText: 'Add',
    errorFileNotSupportedText: 'File not supported',
    errorFileTooLargeText: 'File too large (Max: 2MB)',
    errorChooseCategoryText: 'Choose a category',
    errorUploadImageText: 'Upload at least the first image',
    placeSavedText: 'Place saved',
    reviewModalTitle: 'Add your review',
    starModalTitle: 'Add you star',
    challengesModalTitle: 'Challenges',
    checkModalTitle: 'Add your cehckin',
    shareModalTitle: 'Share',
    writeReviewButtonText: 'Write a review',
    commentReviewInputText: 'Enter your comment about the place here...',
    submitReviewButtonText: 'Submit review',
    starReviewButtonText: 'Submit Star',
    submitCheckButtonText: 'Checkin',
    loadingText: 'Loading',
    openReviewsButtonText: 'See all the reviews',
    placeNotFoundErrorText: 'Place not found',
    commentRequiredErrorText: 'Comment field is required',
    commentTooShortErrorText: 'Comment too short',
    successSubmitReviewText: 'Your review has been saved',
    successSubmitCheckinText: 'Your checkin has been saved',
    successSubmitStarText: 'Your vote has been saved',
    cancelText: 'Cancel',
    chooseOptionText: 'Choose an option',
    photoLibraryText: 'Photo Library',
    cameraText: 'Camera',
    searchText: 'Search',
    authModalText: 'We need to know more about you. Log In or register.',
    loggedInAsText: 'Logged in as',
    loggedOutText: 'You have logged out',
    emailFacebookTakenText: 'The email address is already in use on another account',
    chooseLanguageText: 'Choose language',
    spanishText: 'Spanish',
    englishText: 'English',
    favoritesText: 'My Favorites',
    emptyFavoritesText: 'No favorites yet',
    emptyRetosText: 'Noy Challenges yet',
    addFavoriteText: 'Add to favorites',
    addedToFavoritesText: 'Place saved',
    othersText: 'Others',
    openWalkthroughText: 'Open Walkthrough',
    profileModalTitle: 'Edit your profile',
    profileSubmitText: 'Update',
    profileUpdated: 'Profile updated',
    profileErrorUpdate: 'Profile not updated',
    deleteAccountText: 'Delete account',
    deleteAccountConfirmText: 'Are you sure you want to delete your account?',
    deleteAccountSuccessText: 'Account deleted',
    deleteAccountErrorText: 'Account not deleted',
    forgotPasswordText: 'Forgot password?',
    resetPasswordText: 'Reset password',
    recoverPasswordSuccessText: 'You will receive a link to create a new password via email',
    emailNotFoundText: 'User not found',
    noPlacesFoundText: 'We couldn\'t find any places',
    searchPlaceholderViewText: 'Search places by name',
    searchAddressText: 'Enter an address',
    errorGpsDisabledText: 'Location options are currently disabled. Turn on GPS and wireless network in location setting',
    errorLocationMissingText: 'It\'s not been possible to determine your current location. Try again after few minutes',
    getStartedText: 'Get Started',
    slide1Text: 'Welcome to Pick!',
    slide2Text: 'Discover places around you',
    slide3Text: 'Buy coupons from your favorite places',
    slide4Text: 'Earn points to redeem prizes',
    slide5Text: 'Find your favorite places in any moment',
    changePhotoButtonText: 'Change profile picture',
    AceptarButtonText: 'Acept challenges'
  });
  $translateProvider.translations('es', {
    appTitle: 'Pick',
    categoriesTitle: 'Categorías',
    checkinTitle: 'Mis checkins',
    preferencesTitle: 'Preferencias',
    placesTitle: 'Lugares',
    reviewsTitle: 'Reseñas',
    profileTitle: 'Perfil',
    newPlaceTitle: 'Nuevo lugar',
    mapTitle: 'Mapa',
    FavoritesTitle: 'Mis ',
    nearmeText: 'Cerca de mí',
    addNewPlaceText: 'Añade un lugar',
    profileText: 'Perfil',
    preferencesText: 'Preferencias',
    settingsText: 'Ajustes',
    logoutText: 'Cerrar sesión',
    signInViaFacebook: 'Entrar con Facebook',
    signInText: 'Iniciar sesión',
    signUpText: 'Crear una cuenta',
    signInError: 'Inicio de sesión fallido',
    signUpSubmitText: 'Regístrame',
    nameText: 'Nombre',
    emailText: 'Correo',
    passwordText: 'Contraseña',
    birthText: 'Nacimiento',
    userText: 'Usuario',
    userSinceText: 'Usuario desde',
    getDirectionsText: 'Ir a dirección',
    callToText: 'Llamar a',
    openWebsiteText: 'Abrir sitio web',
    closeText: 'cerrar',
    okText: 'Aceptar',
    placesNotFoundText: 'No hay lugares cerca de ti. Por favor intenta otra opción.',
    reviewsNotFoundText: 'Este lugar aún no tiene reseñas...',
    errorText: 'Ooops. Ocurrio un error...',
    tryAgainText: 'Intenta de nuevo',
    distanceUnitText: 'Unidad de distancia',
    emailInvalidText: 'Correo es inválido',
    formInvalidText: 'Llena todos los campos requeridos',
    authInvalidText: 'Credenciales inválidas',
    emailTakenText: 'El correo ya ha sido tomado',
    twoBlocksText: '2 cuadras',
    sixBlocksText: '6 cuadras',
    chooseDistanceText: 'Elige una distancia',
    mapTypeText: 'Tipo de mapa',
    normalMapText: 'Normal',
    satelliteMapText: 'Satélite',
    searchInThisAreaText: 'Buscar en esta área',
    inputTitleText: 'Nombre *',
    inputDescriptionText: 'Descripción',
    labelDescriptionText: 'Descripción',
    inputCategoryText: 'Selecciona una categoría *',
    inputAddressText: 'Dirección',
    inputPhoneText: 'Teléfono',
    inputWebsiteText: 'Sitio web',
    buttonSubmitPlaceText: 'Agregar',
    errorFileNotSupportedText: 'Archivo no soportado',
    errorFileTooLargeText: 'Imagen demasiado pesada (Max: 2MB)',
    errorChooseCategoryText: 'Selecciona una categoría',
    errorUploadImageText: 'Añade al menos la primera imagen',
    placeSavedText: 'Lugar guardado',
    reviewModalTitle: 'Añade tu reseña',
    starModalTitle: 'Añade tu Valoración',
    challengesModalTitle: 'Retos',
    checkModalTitle: 'Hacer checkin',
    shareModalTitle: 'compartir',
    writeReviewButtonText: 'Escribe una reseña',
    commentReviewInputText: 'Introduce tu comentario acerca del lugar aquí...',
    submitReviewButtonText: 'Enviar reseña',
    starReviewButtonText: 'Enviar voto',
    submitCheckButtonText: 'Checkin',
    loadingText: 'Cargando',
    openReviewsButtonText: 'Ver todas las reseñas',
    placeNotFoundErrorText: 'Lugar no encontrado',
    commentRequiredErrorText: 'El campo Comentario es obligatorio',
    commentTooShortErrorText: 'Comentario muy corto',
    successSubmitReviewText: 'Tú reseña ha sido guardada',
    successSubmitCheckinText: 'Tú checkin ha sido guardado',
    successSubmitstarText: 'Tú voto ha sido guardado',
    cancelText: 'Cancelar',
    chooseOptionText: 'Elige una opción',
    photoLibraryText: 'Librería de fotos',
    cameraText: 'Cámara',
    searchText: 'Búsqueda',
    authModalText: 'Necesitamos saber más de ti. Inicia sesión ó regístrate.',
    loggedInAsText: 'Ha iniciado sesión cómo',
    loggedOutText: 'Se ha cerrado su sesión correctamente',
    emailFacebookTakenText: 'El correo registrado en Facebook ya está siendo ' +
    'utilizado con otra cuenta',
    chooseLanguageText: 'Lenguaje',
    spanishText: 'Español',
    englishText: 'Inglés',
    favoritesText: 'Mis Favoritos',
    emptyFavoritesText: 'Aún no tienes favoritos',
    emptyRetosText: 'Noy hay retos',
    addFavoriteText: 'Añadir a favoritos',
    addedToFavoritesText: 'Lugar guardado',
    othersText: 'Otros',
    openWalkthroughText: 'Abrir guía de inicio',
    profileModalTitle: 'Edita tu perfil',
    profileSubmitText: 'Actualizar',
    profileUpdated: 'Perfil actualizado',
    profileErrorUpdate: 'Perfil no actualizado',
    deleteAccountText: 'Eliminar cuenta',
    deleteAccountConfirmText: '¿Estás seguro de eliminar tu cuenta?',
    deleteAccountSuccessText: 'Tu cuenta ha sido eliminada.',
    deleteAccountErrorText: 'Ocurrio un error con la eliminación de tu cuenta. Intenta de nuevo más tarde.',
    forgotPasswordText: '¿Olvidaste tu contraseña?',
    resetPasswordText: 'Restablecer contraseña',
    recoverPasswordSuccessText: 'Recibirás un enlace para crear una nueva contraseña vía email',
    emailNotFoundText: 'Usuario no encontrado',
    noResultsFoundText: 'No se encontraron resultados',
    noPlacesFoundText: 'No pudimos encontrar lugares de acuerdo a tu consulta',
    searchPlaceholderViewText: 'Buscar lugares por nombre',
    searchAddressText: 'Introduce una dirección',
    errorGpsDisabledText: 'Las opciones de ubicación están desactivadas. Asegura que el GPS y los datos del equipo estén activados.',
    errorLocationMissingText: 'No fue posible determinar tu ubicación actual. Intenta de nuevo en unos minutos.',
    getStartedText: 'Empezar ahora',
    slide1Text: '¡Bienvenido a Pick!',
    slide2Text: 'Busca los lugares cerca de ti',
    slide3Text: 'Compra cupones de tus lugares favoritos',
    slide4Text: 'Gana puntos para canjear premios',
    slide5Text: 'Encuentra tus lugares favoritos más rápido',
    changePhotoButtonText: 'Cambiar foto de perfil',
    AceptarButtonText: 'Aceptar reto '
  });
  $translateProvider.fallbackLanguage('en');
  $translateProvider.preferredLanguage('es');

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/walkthrough');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('app', {
      url: '/app?clear',
      abstract: true,
      templateUrl: 'main/templates/menu.html',
      controller: 'MenuCtrl'
    })
    .state('walkthrough', {
      url: '/walkthrough?force',
      templateUrl: 'main/templates/walkthrough.html',
      controller: 'WalkthroughCtrl',
    })
    .state('main', {
      url: '/main?force',
      templateUrl: 'main/templates/main.html',
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.preferences', {
      url: '/preferences',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/preferences.html',
          controller: 'PreferencesCtrl'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('app.categories', {
      url: '/categories',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/categories.html',
          controller: 'CategoryListCtrl'
        }
      }
    })

    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/search.html',
          controller: 'SearchCtrl'
        }
      }

    })
    .state('app.checkin', {
      url: '/checkin',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/checkin.html',
          controller: 'checkinCtrl'
        }
      }

    })
    .state('app.favorites', {
      url: '/favorites',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/favorites.html',
          controller: 'FavoriteListCtrl'
        }
      }
    })
    .state('app.places', {
      url: '/places/:categoryId/:categoryTitle/:type',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/places.html',
          controller: 'PlaceListCtrl'
        }
      }
    })
    .state('app.place', {
      url: '/place/',
      params: { placeId: null, obj: null },
      views: {
        'menuContent': {
          templateUrl: 'main/templates/place.html',
          controller: 'PlaceDetailCtrl'
        }
      }
    })
    .state('app.challenges', {
      url: '/place/retos',
      params: { placeId: null},
      views: {
        'menuContent': {
          templateUrl: 'main/templates/retos.html',
          controller: 'ChallengesCtrl'
        }
      }
    })
    .state('app.reviews', {
      url: '/place/:placeId/reviews',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/reviews.html',
          controller: 'ReviewListCtrl'
        }
      }
    })
    .state('app.new', {
      url: '/new',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/place-new.html',
          controller: 'PlaceNewCtrl'
        }
      }
    })
    // .state('tab', {
    //   url: "/tab",
    //   abstract: true,
    //   templateUrl: "main/templates/tabs.html",
    //   controller: 'MenuCtrl'
    // })
    // .state('app.home', {
    //   url: '/home',
    //   views: {
    //     'tab-main': {
    //       templateUrl: 'main/templates/home.html',
    //       controller: 'HomeCtrl'
    //     }
    //   }
    // })
    // .state('app.map', {
    //   url: '/map',
    //   views: {
    //     'tab-map': {
    //       templateUrl: 'templates/mapa.html',
    //       // controller: 'MainCtrl'
    //     }
    //   }
    // })
    // .state('app.promocion', {
    //   url: '/promocion',
    //   views: {
    //     'tab-promocion': {
    //       templateUrl: 'templates/promocion.html',
    //       controller: 'PromoCtrl'
    //     }
    //   }
    // })
    //
    .state('app.map2', {
      url: '/map2/:search/:type',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/map.html',
          controller: 'MapCtrl'
        }
      }
    })
    .state('app.map', {
      url: '/map/:categoryId/:categoryTitle/:type/:search',
      views: {
        'menuContent': {
          templateUrl: 'main/templates/map.html',
          controller: 'MapCtrl'
        }
      }
    });
});
