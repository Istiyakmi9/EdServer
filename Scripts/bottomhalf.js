/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="localstorage.js" />

var module = angular.module('BottomhalfHome', ['service', 'localstorageservice']);
module.controller('BhController', function ($scope, $ajax, $local) {
    angular.element(document).ready(function () {
        $local.clearall();
    });
    $scope.launchlogin = function () {
        $('#loginmodal').modal('show');
    }

    $scope.dologin = function () {
        //$('#exampleModal').modal();
        var message = 'Please wait we are getting your details.';
        waitingDialog.show(message)

        var parameter = {
            UserId: $('#userid').val(),
            Password: $('#passwd').val(),
            SchoolTenentId: $('#passwd').val(),
            IsFaculty: true
        };

        var defer = $ajax.post('Bottomhalf/ValidateUser', JSON.stringify(parameter));
        defer.done(function (result) {
            console.log(result);
            if (result != 'null' && result != null) {
                parameter.SessionToken = result;
                var DeferedLogin = $ajax.post('UserLogin/AuthenticateUser', JSON.stringify(parameter));
                DeferedLogin.done(function (loginresult) {
                    if (loginresult != '' && loginresult != null && loginresult != 'null') {
                        $scope.StoreToLocalStorage(loginresult);
                        location.href = location.href + 'Home/Dashboard';
                    } else {
                        waitingDialog.hide();
                        $('#errorMsg').show();
                        $('#errorMsg').fadeOut(5000);
                    }
                })
                DeferedLogin.fail(function (error) {
                    console.log(error);
                    waitingDialog.hide();
                });
            } else {
                waitingDialog.hide();
                $('#errorMsg').show();
                $('#errorMsg').fadeOut(5000);
            }
        });

        defer.fail(function (error) {
            console.log(error);
            waitingDialog.hide();
        });
    }

    $scope.StoreToLocalStorage = function (ServerData) {
        var Data = JSON.parse(ServerData);
        if (Data != null && Data != '' && typeof Data.Classes != 'undefined' && typeof Data.TotalCount != 'undefined') {
            var DistinctClasses = [];
            var AlphaClasses = [];
            var HigherClasses = [];
            var FormattedClassDetail = {};
            var Class = 0;
            var Classes = Data.Classes;
            var index = 0;
            while (index < Classes.length) {
                if (!isNaN(parseInt(Classes[index].Class))) {
                    if (DistinctClasses.indexOf(parseInt(Classes[index].Class.trim())) == -1 && HigherClasses.indexOf(parseInt(Classes[index].Class.trim())) == -1) {
                        if (parseInt(Classes[index].Class) < 10)
                            DistinctClasses.push(parseInt(Classes[index].Class));
                        else
                            HigherClasses.push(parseInt(Classes[index].Class));
                    }
                } else {
                    if (AlphaClasses.indexOf(Classes[index].Class) == -1) {
                        AlphaClasses.push(Classes[index].Class);
                    }
                }
                index++;
            }

            HigherClasses = HigherClasses.sort();
            DistinctClasses = DistinctClasses.sort();
            DistinctClasses = DistinctClasses.concat(HigherClasses);
            DistinctClasses = AlphaClasses.concat(DistinctClasses);
            FormattedClassDetail['Classes'] = DistinctClasses;
            FormattedClassDetail['ClassDescription'] = Data.Classes;
            FormattedClassDetail['UserObj'] = Data.UserObj;
            $local.put('masterdata', FormattedClassDetail);
        }
    }
});
