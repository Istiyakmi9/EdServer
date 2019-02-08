/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('vendorRegistrationCtrl', function ($scope, $rootScope, $ajax, $compile) {

    $scope.vendor = {
        AdminId: null,
        VendorUId: null,
        TenentId: null,
        SellerFirstName: null,
        SellerLastName: null,
        ShopName: null,
        FullAddress: null,
        Mobile: null,
        Email: null,
        GSTIN: null,
        BankName: null,
        AccountNo: null,
        IFSCCode: null,
        PurchasedAmount: null,
        PurchasedOn: null
    }

    angular.element(document).ready(function () {
        if (typeof Data == undefined || Data == null) {
            $scope.InitVendor();
        } else {
            $scope.vendor = Data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    });

    $scope.InitVendor = function () {
        $scope.vendor.AdminId = null;
        $scope.vendor.VendorUId = null;
        $scope.vendor.TenentId = null;
        $scope.vendor.SellerFirstName = null;
        $scope.vendor.SellerLastName = null;
        $scope.vendor.ShopName = null;
        $scope.vendor.FullAddress = null;
        $scope.vendor.Mobile = null;
        $scope.vendor.Email = null;
        $scope.vendor.GSTIN = null;
        $scope.vendor.BankName = null;
        $scope.vendor.AccountNo = null;
        $scope.vendor.IFSCCode = null;
        $scope.vendor.PurchasedAmount = null;
        $scope.vendor.PurchasedOn = null;
    }

    $scope.registerVendor = function () {

        var Data = '';
        var index = 0;
        var tagId = '';
        var Error = 0;
        while (index < Object.keys($scope.vendor).length) {
            tagId = Object.keys($scope.vendor)[index];
            if ($('#' + tagId).attr('validate') != undefined && $('#' + tagId).attr('validate') == '1') {
                if ($('#' + tagId).val() == null || $('#' + tagId).val().trim() == '') {
                    $('#' + tagId).css({ 'border': '1px solid red' });
                    Error++;
                }
            }
            index++;
        }

        if (Error == 0) {
            waitingDialog.show('Registring vendor please wait ...');
            $rootScope.alertRedirectUrl = null;
            var $handler = $ajax.post('GoodsReport/AddVendorToDb', JSON.stringify($scope.vendor));
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
                        $rootScope.alertRedirectUrl = '../GoodsReport/Vender';
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