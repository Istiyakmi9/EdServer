/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('vehicles', function ($scope, $rootScope) {

    $scope.record = null;
    $scope.total = 0;
    $scope.RecordsArray = [];
    angular.element(document).ready(function () {
        if (Data != null && Data != "") {
            $scope.record = Data.Table;
            $scope.total = Data.Table1[0].Total;
            $scope.BindTable($scope.record);
            $rootScope.pagination({
                total: $scope.total,
                pageno: 1
            }, true);
        }
    });

    $scope.BindTable = function (record) {
        $scope.RecordsArray = [];
        for (var i = 0; i < record.length; i++) {
            $scope.RecordsArray.push(record[i]);
        }
    }
});