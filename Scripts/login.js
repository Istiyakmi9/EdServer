/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.js" />
/// <reference path="ajaxcall.js" />

angular.module('loginModule', ['service'])
.controller('loginController', function ($scope, $ajax, $rootScope) {

    $rootScope.ServerName = 'EdServer';
    $scope.schoolName = 'Education system';

    $scope.dologin = function () {
        //$('#exampleModal').modal();
        var message = 'Please wait we are getting your details.';
        waitingDialog.show(message)

        var parameter = {
            MobileNo: $('#userid').val(),
            Password: $('#passwd').val(),
            SchoolTenentId: $('#passwd').val(),
            IsFaculty: true
        };

        var defer = $ajax.post('UserLogin/AuthenticateUser', JSON.stringify(parameter));
        defer.done(function (result) {
            console.log(result);
            if (result != null && result != "") {
                $rootScope.UserObj = result;
                location.href = '../Home/Dashboard';
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
})