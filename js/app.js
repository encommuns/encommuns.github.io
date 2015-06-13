// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('commons.base', ['commons.base.controllers', 'commons.base.services', 'commons.base.filters']);

  angular.module('commons.catalog', ['commons.catalog.controllers', 'commons.catalog.services']);

  angular.module('commons.commonsdevmap', ['commons.commonsdevmap.services']);

  angular.module('commons.encommuns', ['commons.encommuns.controllers', 'commons.encommuns.services']);

  angular.module('commons.accounts', ['commons.accounts.services', 'commons.accounts.controllers', 'commons.account.directives']);

  angular.module('commons.ucomment', ['commons.ucomment.controllers', 'commons.ucomment.services']);

  angular.module('imagination.catalog', ['imagination.catalog.controllers']);

  angular.module('map', ['map.controllers']);

  angular.module('imagination', ['commons.catalog', 'commons.encommuns', 'commons.commonsdevmap', 'commons.accounts', 'commons.ucomment', 'commons.base', 'imagination.catalog', 'map', 'restangular', 'ui.bootstrap', 'ui.router', 'xeditable', 'checklist-model', 'textAngular', 'angularjs-gravatardirective', 'angularFileUpload', 'ngSanitize', 'ngTagsInput', 'angularMoment', 'angular-unisson-auth', 'leaflet-directive', "angucomplete-alt", "videosharing-embed", 'geocoder-service', 'ncy-angular-breadcrumb', 'truncate', 'angular-loading-bar', 'angular-capitalize-filter']).config([
    '$httpProvider', function($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      return delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
  ]).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl(config.rest_uri);
    RestangularProvider.setRequestSuffix('?format=json');
    return RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
      var newResponse;
      newResponse = null;
      if (operation === "getList") {
        newResponse = response.objects;
        newResponse.metadata = response.meta;
      } else {
        newResponse = response;
      }
      return newResponse;
    });
  }).config([
    'TokenProvider', '$locationProvider', function(TokenProvider, $locationProvider) {
      return TokenProvider.extendConfig({
        clientId: config.oauthCliendId,
        redirectUri: config.oauthBaseUrl + '/oauth2callback.html',
        scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
      });
    }
  ]).config(function(loginServiceProvider) {
    return loginServiceProvider.setBaseUrl(config.loginBaseUrl);
  }).config([
    '$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
      $locationProvider.html5Mode(config.useHtml5Mode);
      $urlRouterProvider.otherwise("/p/list");
      return $stateProvider.state('home', {
        url: '/',
        templateUrl: 'views/homepage.html',
        ncyBreadcrumb: {
          label: 'Accueil'
        }
      }).state('project', {
        url: '/p/',
        abstract: true,
        templateUrl: 'views/catalog/project.html',
        ncyBreadcrumb: {
          parent: 'home'
        }
      }).state('project.list', {
        url: 'list?tag&query',
        templateUrl: 'views/catalog/project.list.html',
        ncyBreadcrumb: {
          label: 'Projets'
        }
      }).state('project.new', {
        url: 'new',
        templateUrl: 'views/encommuns/commons.new.html',
        ncyBreadcrumb: {
          label: 'Nouveau projet',
          parent: 'project.list'
        }
      }).state('project.detail', {
        url: ':slug',
        templateUrl: 'views/encommuns/commons.detail.html',
        controller: 'ImaginationProjectSheetCtrl',
        ncyBreadcrumb: {
          label: '{{project.title}}',
          parent: 'project.list'
        }
      }).state('profile', {
        url: '/u/',
        abstract: true,
        templateUrl: 'views/profile/profile.html',
        ncyBreadcrumb: {
          parent: 'home'
        }
      }).state('profile.list', {
        url: 'list',
        templateUrl: 'views/profile/profile.list.html',
        ncyBreadcrumb: {
          label: 'Communauté'
        }
      }).state('about', {
        url: '/about/',
        templateUrl: 'views/base/about.html',
        ncyBreadcrumb: {
          label: 'A propos',
          parent: 'home'
        }
      }).state('tags', {
        url: '/tags/',
        templateUrl: 'views/base/tag_listing.html',
        ncyBreadcrumb: {
          label: 'Tags',
          parent: 'home'
        }
      }).state('economique', {
        url: '/economique',
        templateUrl: 'views/encommuns/economique.html',
        controller: 'PrestationManagerCtrl'
      });
    }
  ]).run(function($rootScope, editableOptions, editableThemes, amMoment, loginService, $state, $stateParams, CurrentProfileService) {
    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary">Enregistrer</button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">Annuler</button>';
    amMoment.changeLocale('fr');
    $rootScope.loginService = loginService;
    $rootScope.config = config;
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.CurrentProfileService = CurrentProfileService;
    return $rootScope.Math = window.Math;
  });

  angular.module('xeditable').directive('editableTextAngular', [
    'editableDirectiveFactory', function(editableDirectiveFactory) {
      return editableDirectiveFactory({
        directiveName: 'editableTextAngular',
        inputTpl: '<div text-angular></div>'
      });
    }
  ]);

}).call(this);
