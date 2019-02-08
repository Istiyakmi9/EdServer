/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('clientRegistrationCtrl', function ($scope, $rootScope, $ajax, $compile) {


    $scope.client = {
        ClientUid: null,
        TenentId: null,
        GSTIN: null,
        AdharNumber: null,
        PersonName: null,
        ShopName: null,
        FullAddress: null,
        Mobile: null,
        Email: null,
        CreatedOn: null
    };

    angular.element(document).ready(function () {
        if (typeof Data == undefined || Data == null) {
            $scope.InitClient();
        } else {
            if (typeof Data != undefined)
                $scope.client = Data.Table[0];
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    });

    $scope.InitClient = function () {
        $scope.client.ClientUid = null;
        $scope.client.TenentId = null;
        $scope.client.GSTIN = null;
        $scope.client.AdharNumber = null;
        $scope.client.PersonName = null;
        $scope.client.ShopName = null;
        $scope.client.FullAddress = null;
        $scope.client.Mobile = null;
        $scope.client.Email = null;
        $scope.client.CreatedOn = null;
    }

    $scope.registerClient = function () {

        var Data = '';
        var index = 0;
        var tagId = '';
        var Error = 0;
        while (index < Object.keys($scope.client).length) {
            tagId = Object.keys($scope.client)[index];
            if ($('#' + tagId).attr('validate') != undefined && $('#' + tagId).attr('validate') == '1') {
                if ($('#' + tagId).val() == null || $('#' + tagId).val().trim() == '') {
                    $('#' + tagId).css({ 'border': '1px solid red' });
                    Error++;
                }
            }
            index++;
        }

        if (Error == 0) {
            waitingDialog.show('Registring client please wait ...');
            $rootScope.alertRedirectUrl = null;
            var $handler = $ajax.post('GoodsReport/AddClient', JSON.stringify($scope.client));
            $handler.done(function (result) {
                waitingDialog.hide();
                if (result != null && result != "") {
                    if (result.StatusCode <= 0) {
                        var Message = "Fail to Insert/Update. ";
                        for (var i = 0; i < result.ErrorResultedList.length; i++) {
                            if (i == 0)
                                Message += result.ErrorResultedList[i]
                            else
                                Message += ", " + result.ErrorResultedList[i]
                        }
                        Message += " Required fields.";
                    } else {
                        Message = 'Registration done successfully.';
                        $rootScope.alertRedirectUrl = '../GoodsReport/Client';
                    }
                    $('#ppmsg').text(Message);
                }
                $('#ppalert').modal('show');
            });
            $handler.fail(function (e, x) {
                waitingDialog.hide();
                $('#ppmsg').text('Registration fail. Please contact to your admin.');
                console.log(JSON.stringify(e));
                $('#ppalert').modal('show');
            })
        }
    }
})