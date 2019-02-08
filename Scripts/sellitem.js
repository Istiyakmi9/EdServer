/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

var HtmlCode = `<tr id="first-item" name="record-row" tabindex="{{index}}">
                                        <td>
                                            <div class ="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class ="form-control" name="Item" ng-keyup="maskTextBox()"
                                                       placeholder="Item" value="">
                                                <a ng-click="showoptions()" class ="fa fa-angle-down right" aria-hidden="true"></a>
                                            </div>
                                        </td>
                                        <td>
                                            <div class ="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class ="form-control" name="Company" ng-keyup="maskTextBox()"
                                                       placeholder="Company name" value="">
                                                <a ng-click="showCompany()" class ="fa fa-angle-down right" aria-hidden="true"></a>
                                            </div>
                                        </td>
                                        <td>
                                            <div class ="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class ="form-control" name="ItemName" ng-keyup="maskTextBox()"
                                                       placeholder="Item name" value="">
                                                <a ng-click="showItemName()" class ="fa fa-angle-down right" aria-hidden="true"></a>
                                            </div>
                                        </td>
                                        <td style="width: 10%;">
                                            <div class ="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class ="form-control" name="SellingPrice" ng-keypress="OnlyFloat()"
                                                       ng-keyup="CalculateAmount()" placeholder="S-Price" value="">
                                            </div>
                                        </td>
                                        <td style="width: 8%;">
                                            <div class ="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class ="form-control" name="MQty" ng-keypress="Money()"
                                                       ng-keyup="CalculateAmount()" placeholder="MQty" value="">
                                            </div>
                                        </td>
                                        <td style="width: 8%;">
                                            <div class ="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class ="form-control" name="Total" ng-keypress="CloneNew()"
                                                       ng-keyup="maskTextBox()" placeholder="Total" value="">
                                            </div>
                                        </td>
                                    </tr>`;

var Ddl = `<div class="dllTable" id="dllTable">
                <table style="background-color: lightgoldenrodyellow;">
                    <tbody>
                        {{row-data}}
                    </tbody>
                </table>
            </div>`;

app.controller('sellGoodsCtrl', function ($scope, $rootScope, $ajax, $compile) {

    $scope.ItemDetail = {
        Item: null,
        ItemName: null,
        Company: null,
        HSNCode: null,
        SellingPrice: 0.0,
        MRP: 0.0,
        Unit: 0,
        MQty: 0,
        TotalAmount: 0
    };
    $scope.Client = {
        GSTIN: '',
        AdharNumber: '',
        PersonName: '',
        ShopName: '',
        BankName: '',
        AccountNo: '',
        IFSCCode: '',
        GSTIN: '',
        FullAddress: '',
        Mobile: '',
        Email: '',
        GoodsAsXml: '',
        ExistingClientUid: '',
        objItemDetail: null,
        ObjFeesDetail: null
    }

    $scope.GrandTotalPrice = 0.0;
    $scope.Name = {
        FirstName: '',
        LastName: ''
    }
    $scope.ItemList = [];
    $scope.ItemRecords = [];
    $scope.SelectionFor = null;
    $scope.IsClientActivated = false;
    $scope.TotalItemCount = 0;
    angular.element(document).ready(function () {
        $scope.InitFields();
        if (typeof ClientRecord != "undefined" && ClientRecord.Table != null) {
            $scope.ClientRecord = ClientRecord.Table;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    });

    $scope.showoptions = function () {
        event.stopPropagation();
        $('#dllTable').remove();
        $scope.SelectionFor = $(event.currentTarget);
        var offset = $(event.currentTarget).closest('td').offset();
        var row = `<tr ng-click="selectCurrentOption()">
                       <td><div>{{Name}}</div></td>
                   </tr>`;
        var NewRow = '';
        if ($scope.ItemRecords.length > 0) {
            for (var i = 0; i < $scope.ItemRecords.length; i++) {
                NewRow += row.replace('{{Name}}', $scope.ItemRecords[i].Name);
            }
        } else {
            NewRow += row.replace('{{Name}}', 'No record found');
        }

        var width = $(event.currentTarget).closest('div').outerWidth();
        var height = $(event.currentTarget).closest('div').outerHeight();
        $('body').append($compile(Ddl.replace('{{row-data}}', NewRow))($scope));
        $('#dllTable').css({ 'left': offset.left + 1, 'top': offset.top + height, 'display': 'block', 'width': width });
    }

    $scope.showCompany = function () {
        event.stopPropagation();
        $scope.SelectionFor = $(event.currentTarget);
        $scope.BindCodes(1);
    }

    $scope.showItemName = function () {
        event.stopPropagation();
        $scope.SelectionFor = $(event.currentTarget);
        $scope.BindCodes(2);
    }

    $scope.showHsnCode = function () {
        event.stopPropagation();
        $scope.SelectionFor = $(event.currentTarget);
        $scope.BindCodes(4);
    }

    $scope.BindCodes = function (index) {
        $('#dllTable').remove();
        var offset = $scope.SelectionFor.closest('td').offset();
        var ItemSelected = $scope.SelectionFor.closest('tr[name="record-row"]').find('input[name="Item"]').val();
        var row = `<tr ng-click="selectCurrentOption()">
                       <td><div>{{Name}}</div></td>
                   </tr>`;
        var NewRow = '';
        if ($scope.ItemRecords.length > 0 && ItemSelected.trim() != '') {
            var ItemName = [];
            for (var i = 0; i < $scope.ItemRecords.length; i++) {
                if ($scope.ItemRecords[i].Name.toLocaleLowerCase() == ItemSelected.toLocaleLowerCase()) {
                    for (var j = 0; j < $scope.ItemRecords[i].Data.length; j++) {
                        if (ItemName.indexOf($scope.ItemRecords[0].Data[j].ItemArray[index]) == -1)
                            ItemName.push($scope.ItemRecords[0].Data[j].ItemArray[index]);
                    }
                }
            }

            for (var i = 0; i < ItemName.length; i++) {
                NewRow += row.replace('{{Name}}', ItemName[i]);
            }
        } else {
            var msg = '';
            if (index == 1)
                msg = 'No item selected.'
            else if (index == 2)
                msg = 'No company selected.';
            else if (index == 4)
                msg = 'No itemname selected.';
            NewRow += row.replace('{{Name}}', msg);
        }

        var width = $scope.SelectionFor.closest('div').outerWidth();
        var height = $scope.SelectionFor.closest('div').outerHeight();
        $('body').append($compile(Ddl.replace('{{row-data}}', NewRow))($scope));
        $('#dllTable').css({ 'left': offset.left + 1, 'top': offset.top + height, 'display': 'block', 'width': width });
    }

    $scope.selectCurrentOption = function () {
        var SelectedOption = $(event.currentTarget).find('div').text().trim();
        $scope.SelectionFor.closest('div').find('input').val(SelectedOption);
        $scope.SelectionFor = null;
        $('#dllTable').remove();
    }

    $scope.hideDynamicDdl = function () {
        $('#dllTable').remove();
    }

    $scope.InitFields = function () {
        var $handler = $ajax.get('GoodsReport/GetItemPreFetchDetail', 'json');
        $handler.done(function (result) {
            if (result != null && result != "") {
                $scope.ItemRecords = result;
            }
        })

        $handler.fail(function (e, x) {

        })
    }

    $scope.AddClient = function () {

        if ($('#Client-dv').css('display') == 'none') {
            $('#Client-dv').fadeIn(500);
            $('#prevbtn').text('Hide Client');
            $('#select-Client').hide();
            $scope.IsClientActivated = true;
        } else {
            $('#Client-dv').fadeOut(200);
            $('#prevbtn').text('Add Client');
            $('#select-Client').show();
            $scope.IsClientActivated = false;
        }
    }

    $scope.CloneNew = function () {
        var ErrorFields = [];
        if (event.keyCode < 48) {
            if ($(event.currentTarget).closest('tr').find('input[name="Item"]').val().trim() == '')
                ErrorFields.push('Item');
            if ($(event.currentTarget).closest('tr').find('input[name="Company"]').val().trim() == '')
                ErrorFields.push('Company');
            if ($(event.currentTarget).closest('tr').find('input[name="ItemName"]').val().trim() == '')
                ErrorFields.push('ItemName');
            if ($(event.currentTarget).closest('tr').find('input[name="SellingPrice"]').val().trim() == '')
                ErrorFields.push('SellingPrice');
            if ($(event.currentTarget).closest('tr').find('input[name="MQty"]').val().trim() == '')
                ErrorFields.push('MQty');
            if ($(event.currentTarget).closest('tr').find('input[name="Total"]').val().trim() == '')
                ErrorFields.push('Total');
            if (ErrorFields.length > 0) {
                $.each(ErrorFields, function (index, item) {
                    $(event.currentTarget).closest('tr').find('input[name="' + ErrorFields + '"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' })
                });
            } else {
                var Counter = $(event.currentTarget).closest('tr').attr('tabindex');
                $(event.currentTarget).closest('tr').after($compile(HtmlCode.replace('{{index}}', ++Counter))($scope));
                $('#sellingitem-body').find('tr[tabindex="' + Counter + '"]').find('input[name="Item"]').focus();
            }
        } else if (event.keyCode < 48 || event.keyCode > 57) {
            event.preventDefault();
        }
    }

    $scope.varifyAddRow = function () {

        var ErrorName = [];
        $(event.currentTarget).closest('tr').prev().find('input').each(function (index, item) {

            if ($(item).val().trim() == '') {
                ErrorName.push($(item).attr('name'));
            }
        });

        if (ErrorName.length == 0) {
            var Counter = $(event.currentTarget).closest('tr').prev().attr('tabindex');
            $(event.currentTarget).closest('tr').before($compile(HtmlCode.replace('{{index}}', ++Counter))($scope));
            $('#sellingitem-body').find('tr[tabindex="' + Counter + '"]').find('input[name="Item"]').focus();
        } else {
            $('#sellingitem-body').find('tr[tabindex="0"]').find('input[name="Item"]').focus();
        }
    }

    $scope.ReadGoodsTable = function () {
        var ItemDetailClone = null;
        var ErrorCount = 0;
        $scope.ItemList = [];
        $('#sellingitem-body').find('tr').each(function (index, item) {
            if ($(item).attr('id') != 'default') {
                var Item = {};
                if ($(item).find('input[name="MQty"]').val().trim() != '') {
                    Item.MQty = $(item).find('input[name="MQty"]').val().trim();
                } else {
                    $(item).find('input[name="MQty"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }
                if ($(item).find('input[name="SellingPrice"]').val().trim() != '') {
                    Item.SellingPrice = parseFloat($(item).find('input[name="SellingPrice"]').val().trim());
                } else {
                    $(item).find('input[name="SellingPrice"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }
                if ($(item).find('input[name="Company"]').val().trim() != '') {
                    Item.Company = $(item).find('input[name="Company"]').val().trim();
                } else {
                    $(item).find('input[name="Company"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }
                if ($(item).find('input[name="ItemName"]').val().trim() != '') {
                    Item.ItemName = $(item).find('input[name="ItemName"]').val().trim();
                } else {
                    $(item).find('input[name="ItemName"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }
                if ($(item).find('input[name="Item"]').val().trim() != '') {
                    Item.Item = $(item).find('input[name="Item"]').val().trim();
                } else {
                    $(item).find('input[name="Item"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }

                if ($(item).find('input[name="Total"]').val().trim() != '') {
                    Item.TotalAmount = $(item).find('input[name="Total"]').val().trim();
                } else {
                    $(item).find('input[name="Total"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }

                if (ErrorCount == 0)
                    $scope.ItemList.push(Item);
            }
        });
        if (ErrorCount > 0)
            return null;
        else {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
            return $scope.ItemList;
        }
        //return $scope.ConvertToXml($scope.ItemList);
    }

    $scope.ConvertToXml = function (ListItem) {
        var xmlFields = '<field id="{{name}}">{{data}}</field>';
        var xmlContent = '';
        var xmlContentRow = '';
        var columnName = '';
        $scope.obj = JSON.parse(localStorage.getItem('userObj'));
        var columnCount = Object.keys(ListItem[0]).length;
        for (var i = 0; i < ListItem.length; i++) {
            for (var j = 0; j < columnCount ; j++) {
                columnName = Object.keys(ListItem[i])[j];
                xmlContent += xmlFields.replace('{{name}}', columnName)
                                       .replace('{{data}}', ListItem[i][columnName]);
            }

            xmlContent += xmlFields.replace('{{name}}', 'CreatedBy')
                                   .replace('{{data}}', $scope.obj.UserId);
            xmlContentRow += '<row>' + xmlContent + '</row>';
            xmlContent = '';
        }
        return '<?xml version="1.0"?>' + xmlContentRow;
    }

    $scope.ValidateModal = function () {
        if ($scope.Client.ExistingClientUid == '') {
            var Errors = [];
            if ($scope.Client.GSTIN == '')
                Errors.push('GSTIN')
            if ($scope.Client.ShopName == '')
                Errors.push('ShopName')
            if ($scope.Name.FirstName == '')
                Errors.push('FirstName')
            else {
                $scope.Client.PersonName = $scope.Name.FirstName + ' ' + $scope.Name.LastName;
                $scope.Client.PersonName = $scope.Client.PersonName.trim();
            }
            if ($scope.Client.FullAddress == '')
                Errors.push('FullAddress')

            if (Errors.length > 0) {
                for (var i = 0; i < Errors.length; i++) {
                    $('#Client-dv').find('input[name="' + Errors[i] + '"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' })
                }
                return false;
            }
        }
        return true;
    }

    $scope.CalculateAmount = function () {
        if ($(event.currentTarget).val().trim() != '') {
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)', 'background-color': '#fff' });

            var BasePrice = $(event.currentTarget).closest('tr').find('input[name="SellingPrice"]').val().trim();
            var TotalItem = $(event.currentTarget).closest('tr').find('input[name="MQty"]').val().trim();
            if (BasePrice != "" && TotalItem != "") {
                BasePrice = parseFloat(BasePrice) * parseFloat(TotalItem);
                $(event.currentTarget).closest('tr').find('input[name="Total"]').val(BasePrice)
                $scope.GrandTotalPrice = 0;
                var Result = $scope.ReadGoodsTable();
                if (Result != null && Result.length > 0) {
                    $scope.TotalItemCount = Result.length;
                    for (var i = 0; i < Result.length; i++) {
                        if (Result[i].TotalAmount != "") {
                            $scope.GrandTotalPrice += parseFloat(Result[i].TotalAmount);
                        }
                    }

                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                }
            }
        }
    }

    $scope.printInvoice = function () {
        $('#invoice-sec').printThis();
    }

    $scope.SubmitForPayment = function () {
        $('#btnform').click();
    }

    $scope.GoPaymentViewPage = function () {
        $('#link-info').closest('ul').find('li[name="breadcrum"]').hide();
        $('#link-info').show();
        $('#invoice').empty();
        $('#main').fadeIn(500)
    }

    $scope.MakePaymentTransaction = function () {
        var Data = '';
        var index = 0;
        var ValidatedResult = 0;
        var DllIsValid = true;
        if ($scope.IsClientActivated)
            ValidatedResult = $rootScope.ValidateFields($scope.Client);
        else {
            if ($('#SelClient option:selected').val() == "") {
                $('#SelClient').css({ 'border': '1px solid red' });
                DllIsValid = false;
                event.preventDefault();
            } else {
                $scope.Client.ExistingClientUid = $('#SelClient option:selected').val();
            }
        }

        if ($scope.ValidateModal()) {
            var TableData = $scope.ReadGoodsTable();
            if (ValidatedResult == 0 && TableData != null && DllIsValid) {
                waitingDialog.show('Inserting data into database ...');
                var obj = JSON.parse(localStorage.getItem('userObj'));
                $scope.Client.AdminId = obj.UserId;
                $scope.Client.objItemDetail = TableData;
                $scope.Client.TotalAmount = $scope.GrandTotalPrice;
                $rootScope.alertRedirectUrl = null;
                var Url = "SellGoods/VerifyNGetPartial";
                var $handler = $ajax.post(Url, JSON.stringify({ ObjSoldItems: $scope.Client, ClientViewName: 'Default' }), 'html');
                $handler.done(function (result) {
                    if (result != null && result != "") {
                        $('#main').hide();
                        $('#link-info').hide();
                        $('#link-info').closest('ul').find('li[name="breadcrum"]').show();
                        $('#invoice').append($compile(result)($scope)).fadeIn(500);

                        var ServerData = null;
                        if (typeof PaymentData != "undefined" && PaymentData != "") {
                            if (typeof PaymentData == "string") {
                                PaymentData = JSON.parse(PaymentData);
                                PaymentData.ObjClientDetail = null;
                                PaymentData = JSON.stringify(PaymentData);
                                $('#formcollectionData').val(PaymentData);
                                ServerData = JSON.stringify(PaymentData);
                            } else {
                                PaymentData.ObjClientDetail = null;
                                $('#formcollectionData').val(JSON.stringify(PaymentData));
                                ServerData = PaymentData;
                            }

                            $scope.Client = ServerData.ObjClientDetail;
                            waitingDialog.hide();
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                                $scope.$digest();
                        } else {
                            waitingDialog.hide();
                        }
                    }
                })

                $handler.fail(function (e) {
                    waitingDialog.hide();
                })
            }
        }
    }
})