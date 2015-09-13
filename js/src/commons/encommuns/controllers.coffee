module = angular.module("commons.encommuns.controllers", ['commons.encommuns.services','chartjs'])


module.controller("TestCtrl", ($scope) =>
    $scope.lineChartData = {
      labels: [
        'Gouvernance'
        'Contribution'
        'Partage'
        'Juridique'
        'Financement'
        'Partenaires'
        ]
      datasets: [
        {
          data: [300, 300, 350, 400, 200,400]
        }            
      ]
    }
    $scope.activeData = $scope.lineChartData;
)

module.controller('CollapseCtrl', ($scope) ->
    $scope.isCollapsed = true;
)

module.controller('TooltipCtrl', ($scope) ->
  $scope.dynamicTooltipText = 'dynamic';
)

class ListUsageManagerCtrl
        constructor: (@$scope, @Pertinences) ->
                @$scope.usages = @Pertinences.getList().$object 
module.controller("ListUsageManagerCtrl", ['$scope', 'Pertinences', ListUsageManagerCtrl])


module.controller("DetailUsageManagerCtrl", ($scope, OneUsage) ->
        $scope.detailledUsage = OneUsage.one($scope.usage.id).get().$object
) 

module.controller("DetailPertinenceManagerCtrl", ($scope, OnePertinence) ->
        $scope.detailledPertinence = OnePertinence.one($scope.pertinence.id).get().$object
) 

class PertinenceManagerCtrl
        constructor: (@$scope, @Pertinences) ->
                @$scope.pertinences = @Pertinences.getList().$object  


module.controller("PertinenceManagerCtrl", ['$scope', 'Pertinences', PertinenceManagerCtrl])


class HelpfulTipsManagerCtrl
        constructor: (@$scope, @HelpfulTips) ->
                @$scope.helpfultips = @HelpfulTips.getList().$object  

module.controller("HelpfulTipsManagerCtrl", ['$scope', 'HelpfulTips', HelpfulTipsManagerCtrl])

class PrestationManagerCtrl
        constructor: (@$scope, @Prestations) ->
                @$scope.prestations = @Prestations.getList().$object    

module.controller("PrestationManagerCtrl", ['$scope', 'Prestations', PrestationManagerCtrl])
