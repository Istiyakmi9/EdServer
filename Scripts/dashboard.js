/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.js" />
/// <reference path="layout.js" />


app.controller('dashboard', function ($scope, $ajax, $rootScope) {

    angular.element(document).ready(function () {
        waitingDialog.hide();
        $scope.callServer();
        $scope.BindDashboardData();
    });

    $scope.BindDashboardData = function () {
        $scope.UserBO = $rootScope.GetValue('userobj');
        if ($scope.UserBO != null && $scope.UserBO != "") {

        }
    }

    $scope.callServer = function () {
        var $handler = $ajax.get('home/CalculateAttendence', 'json');
        $handler.done(function (result) {

        })

        $handler.fail(function (e, x) {
            if (e.status == 520) {
                location.href = "../";
            }
        })
    }
})