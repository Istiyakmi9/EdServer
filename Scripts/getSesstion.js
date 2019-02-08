/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.js" />
/// <reference path="layout.js" />


app.controller('SesstionCtrl', function ($scope, $ajax, $rootScope) {

    $scope.records = [];
    angular.element(document).ready(function () {
        waitingDialog.hide();
        $scope.callServer();
    });

    $scope.FormatDateTime = function (UserPassedDateValue) {
        var NewDateValue = null;
        if (UserPassedDateValue != null && UserPassedDateValue != '') {
            NewDateValue = new Date(UserPassedDateValue).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
        }
        return NewDateValue;
    }

    $scope.callServer = function () {
        var $handler = $ajax.get('home/GetAllUserSesstionObject', 'json');
        $handler.done(function (result) {
            if (result != null) {
                var Data = JSON.parse(result);
                for (var i = 0; i < Data.Table.length; i++) {
                    if (Data.Table[i].DestroyedOn == null) {
                        var DurationSpend = (new Date() - new Date(Data.Table[i].CreatedOn)) / 1000;
                        if (Data.Table[i].Duration != 0)
                            DurationSpend = Data.Table[i].Duration;
                    } else {
                        DurationSpend = Data.Table[i].Duration;
                    }
                    $scope.records.push({
                        Token: Data.Table[i].Token,
                        CreatedOn: $scope.FormatDateTime(Data.Table[i].CreatedOn),
                        LastUpdatedOn: $scope.FormatDateTime(Data.Table[i].LastUpdatedOn),
                        Duration: DurationSpend,
                        ExceptionMessage: Data.Table[i].ExceptionMessage,
                        UserName: Data.Table[i].UserName,
                        UserMobileNo: Data.Table[i].UserMobileNo,
                        DestroyedOn: $scope.FormatDateTime(Data.Table[i].DestroyedOn)
                    })
                }
            }

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        })

        $handler.fail(function (e, x) {
            if (e.status == 520) {
                location.href = "../";
            }
        })
    }
})