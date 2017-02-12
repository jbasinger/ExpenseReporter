angular.module('app.controllers')
.controller('GoogleAuthCtrl', function($scope, GoogleApi, $state) {

  $scope.login = function(){
    GoogleApi.isAuthorized().then(function(result){
      var month = parseInt(moment().format("M"))-1;
      $state.go('app.monthlyReport', {month: month});
    }, function(result){
      console.log(result);
    });
  };

});
