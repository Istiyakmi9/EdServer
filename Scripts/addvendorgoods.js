/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

var HtmlCode = `<tr id="first-item" name="record-row" tabindex="{{index}}">
                                        <td>
                                            <div class="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class="form-control" name="Item" ng-keyup="maskTextBox()"
                                                       placeholder="Item" value="">
                                                <a ng-click="showoptions()" class="fa fa-angle-down right" aria-hidden="true"></a>
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
                                            <div class="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class="form-control" name="ItemName" ng-keyup="maskTextBox()"
                                                       placeholder="Item name" value="">
                                                <a ng-click="showItemName()" class ="fa fa-angle-down right" aria-hidden="true"></a>
                                            </div>
                                        </td>
                                        <td style="width: 10%;">
                                            <div class="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class="form-control" name="HSNCode" ng-keyup="maskTextBox()"
                                                       placeholder="HSN Code" value="">
                                                <a ng-click="showHsnCode()" class ="fa fa-angle-down right" aria-hidden="true"></a>
                                            </div>
                                        </td>
                                        <td style="width: 10%;">
                                            <div class="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class="form-control" name="SellingPrice" ng-keypress="OnlyFloat()"
                                                       ng-keyup="maskTextBox()" placeholder="S-Price" value="">
                                            </div>
                                        </td>
                                        <td style="width: 10%;">
                                            <div class="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class="form-control" name="MRP" ng-keypress="OnlyFloat()"
                                                       ng-keyup="maskTextBox()" placeholder="MRP" value="">
                                            </div>
                                        </td>
                                        <td style="width: 8%;">
                                            <div class="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class="form-control" name="Unit" ng-keypress="OnlyNumber()"
                                                       ng-keyup="maskTextBox()" placeholder="Unit" value="">
                                            </div>
                                        </td>
                                        <td style="width: 8%;">
                                            <div class="col-md-12 col-sm-12 col-xs-12 no-spacing form-group has-feedback">
                                                <input type="text" class="form-control" name="MQty" ng-keypress="CloneNew()"
                                                       ng-keyup="maskTextBox()" placeholder="M-Qty" value="">
                                            </div>
                                        </td>
                                    </tr>`;

var Ddl = `<div class="dllTable" id="dllTable">
                <table>
                    <thead>
                        <tr>
                            <th>Item name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{row-data}}
                    </tbody>
                </table>
            </div>`;

app.controller('addVendorGoodsCtrl', function ($scope, $rootScope, $ajax, $compile) {

    $scope.ItemDetail = {
        Item: null,
        ItemName: null,
        Company: null,
        HSNCode: null,
        SellingPrice: 0.0,
        MRP: 0.0,
        Unit: 0,
        MQty: 0
    };
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
        PurchasedOn: null,
        ExistingVendorUid: null,
        GoodsAsXml: null
    }
    $scope.ItemList = [];
    $scope.IsVendorActivated = false;
    $scope.ItemRecords = [];
    $scope.SelectionFor = null;
    angular.element(document).ready(function () {
        $scope.InitFields();
        if (typeof VendorRecord != undefined && VendorRecord.Table != null) {
            $scope.VendorDetail = VendorRecord.Table;
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

    $scope.AddVendor = function () {

        if ($('#vendor-dv').css('display') == 'none') {
            $('#vendor-dv').fadeIn(500);
            $('#prevbtn').text('Hide Vendor');
            $('#select-vendor').hide();
            $scope.IsVendorActivated = true;
        } else {
            $('#vendor-dv').fadeOut(200);
            $('#prevbtn').text('Add Vendor');
            $('#select-vendor').show();
            $scope.IsVendorActivated = false;
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
            if ($(event.currentTarget).closest('tr').find('input[name="HSNCode"]').val().trim() == '')
                ErrorFields.push('HSNCode');
            if ($(event.currentTarget).closest('tr').find('input[name="SellingPrice"]').val().trim() == '')
                ErrorFields.push('SellingPrice');
            if ($(event.currentTarget).closest('tr').find('input[name="MRP"]').val().trim() == '')
                ErrorFields.push('MRP');
            if ($(event.currentTarget).closest('tr').find('input[name="Unit"]').val().trim() == '')
                ErrorFields.push('Unit');
            if ($(event.currentTarget).closest('tr').find('input[name="MQty"]').val().trim() == '')
                ErrorFields.push('MQty');
            if (ErrorFields.length > 0) {
                $.each(ErrorFields, function (index, item) {
                    $(event.currentTarget).closest('tr').find('input[name="' + ErrorFields + '"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' })
                });
            } else {
                var Counter = $(event.currentTarget).closest('tr').attr('tabindex');
                $(event.currentTarget).closest('tr').after($compile(HtmlCode.replace('{{index}}', ++Counter))($scope));
                $('#item-body').find('tr[tabindex="' + Counter + '"]').find('input[name="Item"]').focus();
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
            $('#item-body').find('tr[tabindex="' + Counter + '"]').find('input[name="Item"]').focus();
        } else {
            $('#item-body').find('tr[tabindex="0"]').find('input[name="Item"]').focus();
        }
    }

    $scope.ReadGoodsTable = function () {
        var ItemDetailClone = null;
        var ErrorCount = 0;
        $scope.ItemList = [];
        $('#item-body').find('tr').each(function (index, item) {
            if ($(item).attr('id') != 'default') {
                var Item = {};
                if ($(item).find('input[name="MQty"]').val().trim() != '') {
                    Item.MQty = $(item).find('input[name="MQty"]').val().trim();
                } else {
                    $(item).find('input[name="MQty"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }
                if ($(item).find('input[name="Unit"]').val().trim() != '') {
                    Item.Unit = $(item).find('input[name="Unit"]').val().trim();
                } else {
                    $(item).find('input[name="Unit"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }
                if ($(item).find('input[name="MRP"]').val().trim() != '') {
                    Item.MRP = $(item).find('input[name="MRP"]').val().trim();
                } else {
                    $(item).find('input[name="MRP"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }
                if ($(item).find('input[name="SellingPrice"]').val().trim() != '') {
                    Item.SellingPrice = $(item).find('input[name="SellingPrice"]').val().trim();
                } else {
                    $(item).find('input[name="SellingPrice"]').css({ 'border': '1px solid red', 'background-color': '#f9f9ae' });
                    ErrorCount++;
                }

                if ($(item).find('input[name="HSNCode"]').val().trim() != '') {
                    Item.HSNCode = $(item).find('input[name="HSNCode"]').val().trim();
                    Item.GoodsItemTypeUid = $(item).find('input[type="hidden"]').val().trim();
                } else {
                    Item.HSNCode = 'NA';
                    Item.GoodsItemTypeUid = 'NA';
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

                if (ErrorCount == 0)
                    $scope.ItemList.push(Item);
            }
        });
        if (ErrorCount > 0)
            return null;
        else
            return $scope.ConvertToXml($scope.ItemList);
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

            xmlContent += xmlFields.replace('{{name}}', 'TenentId')
                                   .replace('{{data}}', $scope.obj.UserId);
            xmlContentRow += '<row>' + xmlContent + '</row>';
            xmlContent = '';
        }
        return '<?xml version="1.0"?>' + xmlContentRow;
    }

    $scope.AddGoods = function () {
        var Data = '';
        var index = 0;
        var ValidatedResult = 0;
        var DllIsValid = true;
        if ($scope.IsVendorActivated)
            ValidatedResult = $rootScope.ValidateFields($scope.vendor);
        else {
            if ($('#SelVender option:selected').val() == "") {
                $('#SelVender').css({ 'border': '1px solid red' });
                DllIsValid = false;
                event.preventDefault();
            } else {
                $scope.vendor.ExistingVendorUid = $('#SelVender option:selected').val();
            }
        }
        var TableData = $scope.ReadGoodsTable();
        if (ValidatedResult == 0 && TableData != null && DllIsValid) {
            waitingDialog.show('Inserting data into database ...');
            $scope.vendor.GoodsAsXml = TableData;
            $rootScope.alertRedirectUrl = null;
            var $handler = $ajax.post('GoodsReport/AddGoodsItem', JSON.stringify($scope.vendor));
            $handler.done(function (result) {
                waitingDialog.hide();
                if (result != null && result.toLocaleLowerCase().indexOf('inserted') != -1) {
                    $('#ppmsg').text('Successfully done.' + result);
                } else {
                    $('#ppmsg').text('Insertion fails');
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