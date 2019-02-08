/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('EditGoodsItemCtrl', function ($scope, $rootScope, $ajax, $compile) {


    $scope.client = {
        GoodsItemUid: '',
        TenentId: '',
        GoodsUid: '',
        Item: '',
        ItemName: '',
        ItemCompanyName: '',
        HSNCode: '',
        salePrice: '',
        PurchasedPrice: '',
        MRP: '',
        Unit: '',
        M_Qty: '',
        Discount: '',
        GST: '',
        BatchNo: '',
        CreatedOn: '',
        UpdatedOn: ''
    };

    angular.element(document).ready(function () {
        if (typeof Data != undefined && Data != null) {
            $scope.client = Data.Table[0];
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    });

    $scope.validateFields = function () {

        var errors = [];
        if ($scope.client.Item == null || $scope.client.Item.trim() == '')
            errors.push('item');
        if ($scope.client.ItemName == null || $scope.client.ItemName.trim() == '')
            errors.push('ItemName');
        if ($scope.client.HSNCode == null || $scope.client.HSNCode.trim() == '')
            errors.push('HSNCode');
        if ($scope.client.GST == null || $scope.client.GST.trim() == '')
            errors.push('GST');

        if (errors.length > 0) {
            for (var i = 0; i < errors.length; i++) {
                $('#' + errors[i]).css({ 'border': '1px solid red' });
            }
        }

        return errors;
    }

    $scope.UpdateRecord = function () {
        $rootScope.formpatentId = 'goodsitem';
        waitingDialog.show('Wait...  Update is under progress.');
        var ErrorMsg = $scope.validateFields();
        if (ErrorMsg.length == 0) {
            var Url = 'GoodsReport/UpdateSingleGoods';
            var $handler = $ajax.post(Url, JSON.stringify($scope.client));
            $handler.done(function (result) {
                waitingDialog.hide();
                if (result != null && result.IsValidModal) {
                    $('#ppmsg').text(result.SuccessMessage)
                    $('#ppalert').modal('show')
                } else {
                    if (result.ErrorResultedList.length > 0) {
                        var errormsg = result.ErrorResultedList.join(',') + ' required fiedls.'
                        $('#ppmsg').text(errormsg)
                    } else {
                        $('#ppmsg').text(result.ErrorMessage)
                    }
                    $('#ppalert').modal('show')
                }
            });

            $handler.fail(function (error) {
                waitingDialog.hide();
                $('#ppmsg').text("Internal error, fail to perform operation. Please contact admin.")
                $('#ppalert').modal('show')
                console.log('[Reports StaffReports] fail to get result: ' + JSON.stringify(error));
            });
        } else {
            waitingDialog.hide();
        }
    }
})