angular.module('app.controllers')
.controller('ExpenseReportsCtrl', function($scope, $state) {

  $scope.months = [];

  for(var i=0; i < 12; i++){
    $scope.months.push(moment({month:i}).format('MMMM'));
  }

  $scope.goToMonth = function(month){
    $state.go('app.monthlyReport', {month: month});
  }

})
