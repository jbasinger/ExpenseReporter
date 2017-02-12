angular.module('app.controllers')
.controller('QuickExpensesCtrl', function($scope, QuickExpenses, $ionicActionSheet, $ionicModal, $ionicPopup) {

  $scope.fileNotFound = false;
  $scope.quick = {
    mileageExpenses: []
  };

  $scope.mileageExpense = {};
  $scope.isNewMileageExpense = false;

  function loadUp(){
    QuickExpenses.getQuickExpenses().then(function(expenses){
      $scope.quick.mileageExpenses = expenses;
    }, function(err){
      if(err == QuickExpenses.ERROR.FILE_NOT_FOUND){
        $scope.fileNotFound = true;
      }
    });
  };

  loadUp();

  $scope.getMileageExpenses = function(){
    return _.filter($scope.quick.mileageExpenses, function(i){
      return !i.deleteMe;
    });
  }

  $scope.createQuickExpenseSheet = function(){
    QuickExpenses.createQuickExpenseSheet().then(function(){
      loadUp();
    },function(err){
      console.log(err);
    });
  }

  $scope.saveMileageExpense = function(expense, isNew){
    if(isNew){
      $scope.quick.mileageExpenses.push(expense);
    }
    QuickExpenses.saveQuickExpenses($scope.quick).then(function(){
      $scope.mileageExpenseModal.hide();
    }, function(err){
      console.log(err);
      $scope.mileageExpenseModal.hide();
    });

  }

  $scope.deleteMileageExpense = function(index){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Mileage Expense',
      template: 'Are you sure you want to delete this?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $scope.quick.mileageExpenses[index].deleteMe = true;
        QuickExpenses.saveQuickExpenses($scope.quick).then(function(){
          loadUp();
        }, console.log)
      }
    });
  }

  $scope.editMileageExpense = function(index){
    $scope.mileageExpense = $scope.quick.mileageExpenses[index];
    $scope.isNewMileageExpense = false;
    $scope.mileageExpenseModal.show();
  }

  $scope.addQuickExpense = function(){
    $ionicActionSheet.show({
      buttons: [
       { text: 'Item Expense' },
       { text: 'Mileage Expense' }
      ],
      titleText: 'Add a Quick Expense',
      cancelText: 'Cancel',
      cancel: function() {
          // add cancel code..
      },
      buttonClicked: function(index) {
        if(index == 1){
          $scope.mileageExpense = {};
          $scope.isNewMileageExpense = true;
          $scope.mileageExpenseModal.show();
        } else {
          var alertPopup = $ionicPopup.alert({
             title: 'Whoops!',
             template: "This isn't implemented yet!"
           });
        }
        return true;
      }
    });
  }

  $ionicModal.fromTemplateUrl('templates/quickMileageExpenseModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.mileageExpenseModal = modal;
  });

  $scope.$on('$destroy', function() {
    $scope.mileageExpenseModal.remove();
  });

});
