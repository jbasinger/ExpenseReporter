// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app.services',[]);
angular.module('app.controllers',['app.services']);
angular.module('app', ['ionic', 'app.controllers'])

.run(function($ionicPlatform, GoogleApi, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    GoogleApi.isAuthorized().then(function(result){
      var month = parseInt(moment().format("M"))-1;
      $state.go('app.monthlyReport', {month: month});
    }, function(result){
      console.log(result);
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })
  .state('googleAuth',{
    url: '/googleAuth',
    templateUrl: 'templates/googleAuth.html',
    controller: 'GoogleAuthCtrl'
  })

  .state('app.expenseReports', {
    url: '/expenseReports',
    views: {
      'menuContent': {
        templateUrl: 'templates/expenseReports.html',
        controller: 'ExpenseReportsCtrl'
      }
    }
  })
  .state('app.monthlyReport', {
    url: '/monthlyReport/:month',
    views: {
      'menuContent': {
        templateUrl: 'templates/monthlyReport.html',
        controller: 'MonthlyReportCtrl'
      }
    }
  })
  .state('app.quickExpenses', {
    url: '/quickExpenses',
    views: {
      'menuContent': {
        templateUrl: 'templates/quickExpenses.html',
        controller: 'QuickExpensesCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/googleAuth');
});
