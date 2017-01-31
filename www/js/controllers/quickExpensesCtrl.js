angular.module('app.controllers')
.controller('QuickExpensesCtrl', function($scope, QuickExpenses, $ionicActionSheet, $ionicModal, $ionicPopup) {

  $scope.quick = QuickExpenses.getQuickExpenses();

  $scope.mileageExpense = {};
  $scope.isNewMileageExpense = false;

  $scope.saveMileageExpense = function(expense, isNew){
    if(isNew){
      $scope.quick.mileageExpenses.push(expense);
    }
    QuickExpenses.saveQuickExpenses($scope.quick);
    $scope.mileageExpenseModal.hide();
  }

  $scope.deleteMileageExpense = function(index){
    var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Mileage Expense',
     template: 'Are you sure you want to delete this?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.quick.mileageExpenses.splice(index,1);
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
