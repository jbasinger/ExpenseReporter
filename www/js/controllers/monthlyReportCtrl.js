angular.module('app.controllers')
.controller('MonthlyReportCtrl', function($scope,$state,$stateParams,Expenses, QuickExpenses, $ionicActionSheet) {

  var month = $stateParams.month;

  $scope.fileNotFound = false;
  $scope.monthName = moment({month:month}).format("MMMM");

  $scope.mileageExpenses = [];

  function loadMileageForMonth(m){
    return Expenses.getMileageExpensesByMonth(m).then(function(items){
      $scope.mileageExpenses = items;
    }, function(error){
      if(error == Expenses.ERROR.FILE_NOT_FOUND){
        $scope.fileNotFound = true;
      }
      console.log(error);
    });
  }

  $scope.mileageTotal = function(){
    return _.reduce($scope.mileageExpenses, function(sum, obj){return sum + parseFloat(obj.miles);}, 0);
  }

  $scope.dollarTotal = function(){
    var value = _.reduce($scope.mileageExpenses, function(sum, obj){return sum + parseFloat(obj.dollars);}, 0);
    return value.toFixed(2);
  }

  $scope.createReport = function(){
    Expenses.createReportForMonth(month).then(function(){
      loadMileageForMonth(month).then(function(){
        $scope.fileNotFound = false;
      });
    }, function(error){
      console.log(error);
    });
  }

  $scope.addExpense = function(){

    QuickExpenses.getQuickExpenses().then(function(quickExpenses){
      
      var quicks = { mileageExpenses: quickExpenses };
      var buttons = [];

      _.each(quicks.mileageExpenses, function(item){
        buttons.push({text: item.customer + ' ' + item.miles + ' miles'});
      });

      $ionicActionSheet.show({
        buttons: buttons,
        titleText: 'Add a Quick Expense',
        cancelText: 'Cancel',
        cancel: function() {
            // add cancel code..
        },
        buttonClicked: function(index) {
          var quickExpense = quicks.mileageExpenses[index];

          var mileage = new MileageExpense();

          mileage.date = moment().format("L");
          mileage.place = quickExpense.place;
          mileage.customer = quickExpense.customer;
          mileage.miles = quickExpense.miles;

          $scope.mileageExpenses.push(mileage);

          Expenses.saveMileageExpensesByMonth($scope.mileageExpenses, month).then(function(){
            loadMileageForMonth(month);
          });
          return true;
        }
      });
    },console.log);

  }

  loadMileageForMonth(month);

});
