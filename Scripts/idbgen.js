/// <reference path="angular.min.js" />
/// <reference path="layout.js" />
/// <reference path="jquery-3.3.1.min.js" />


var dynamicTable = `<div class="row" id="dy-table" ng-click="hideTooltips()">
                        <div ng-repeat="row in Wrapper" tabindex="{{row.Counter}}" class="header-row-dv">
                            <div class="dbtabledv" ng-repeat="table in row" priorityLevel="{{table.ReferencedCount}}">
                                <div class="dynamic-dv" name="{{table.TableName}}" style="">
                                    <img src="../images/table.png" alt="Table" class="dynamic-table" />
                                    <a class="anc-tableview" href="javascript:void(0)" ng-click="ViewTableDetail()">
                                        {{table.TableName}}
                                    </a>
                                    <div name="tableSchema" class="tooltop-table" style="display: none;">
                                        <table>
                                            <thead>
                                                <tr style="background-color: #2b3f53;color: #eee;">
                                                    <th>Column</th>
                                                    <th>Datatype</th>
                                                    <th>Size</th>
                                                    <th>IsNullable</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr ng-repeat="column in table.SchemaDetail">
                                                    <td>{{column.ColumnName}}</td>
                                                    <td>{{column.Datatype}}</td>
                                                    <td>{{column.Length}}</td>
                                                    <td>{{column.IsNullable}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div name="constraint" class="tooltop-table" style="display: none;">
                                        <table>
                                            <thead>
                                                <tr style="background-color: #2b3f53;color: #eee;">
                                                    <th>Column</th>
                                                    <th>Constraint</th>
                                                    <th>Referenced Table</th>
                                                    <th>Referenced Column</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr ng-repeat="rist in table.Constraint">
                                                    <td>{{rist.ColumnName}}</td>
                                                    <td>{{rist.ConstraintName}}</td>
                                                    <td>{{rist.ReferencedColumnName}}</td>
                                                    <td>{{rist.ReferencedTableName}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;


var uiTemplate = '<div class="dynamic-dv" name="{{TableName}}">\
                    <img src="../images/table.png" alt="Table" class="dynamic-table" />\
                    {{ColumnsDiv}}\
                </div>';
var columnView = '<a href="javascript:void(0)" ng-click="ViewTableDetail()">{{TableName}}</a>\
                  <div class="columns">\
                     <div>{{ColumnName}}</div>\
                  </div>';

var svgline = '<svg name="{{TableName-relation}}">\
                <line x1="{{x1}}" y1="{{y1}}" x2="{{x2}}" y2="{{y2}}" style="stroke:rgb(132, 132, 132)"></line>\
            </svg>';

app.controller('tablechatCtrl', function ($scope, $rootScope, $compile, $ajax) {

    $scope.counter = 1;
    $scope.jsonData = {};
    $scope.TableInformation = [];
    $scope.DbSchema = null;
    angular.element(document).ready(function () {

        $scope.GetDbSchema();
        setTimeout(() => {
            $('h2').removeClass('bcd');
            $('small').removeClass('bcd');
            $('label').removeClass('bcd');
            $('button').removeClass('bcd');
            $('input').removeClass('bcd');
            $('span').removeClass('bcd');
            $('div').removeClass('bcd');
        }, 1000);

        if ($scope.$root.$$phase != '$digest' && $scope.$root.$$phase != '$apply')
            $scope.$digest();
    });

    $scope.GetDbSchema = function () {

        var ServerUrl = 'DbAction/GetDatabaseSchema?Database=null&Username=null&Password=null&IntegratedSecurity=null&Provider=null';
        var $handler = $ajax.get(ServerUrl, 'json');
        $handler.done((result) => {
            if (result != null && result != "") {
                $scope.DbSchema = result.Schema;
                $scope.TableDetail = result.TableSchema;
                if ($scope.BindTables()) {

                    $scope.DbSchema = null;
                    $scope.TableDetail = null;
                    $scope.DbName = result.DatabaseName;
                }
            }

            if ($scope.$root.$$phase != '$digest' && $scope.$root.$$phase != '$apply')
                $scope.$digest();
        });

        $handler.fail((e, x) => {
            console.log(JSON.stringify(e));
        })
    }

    $scope.BindTables = function () {

        $scope.Wrapper = [];
        var SortedObject = {}
        if ($scope.DbSchema != null && $scope.DbSchema.length > 0) {

            var isFound = false;
            for (var i = 0; i < $scope.TableDetail.length; i++) {

                isFound = false;
                for (var j = 0; j < $scope.DbSchema.length; j++) {

                    if ($scope.TableDetail[i].TableName.toLocaleLowerCase() == $scope.DbSchema[j].TableName.toLocaleLowerCase()) {

                        isFound = true;
                        $scope.TableInformation.push({
                            ReferencedCount: $scope.DbSchema[j].ObjConstraintValues.length,
                            TableName: $scope.TableDetail[i].TableName.toLocaleLowerCase(),
                            Constraint: $scope.DbSchema[j].ObjConstraintValues,
                            SchemaDetail: $scope.TableDetail[i].ObjTableDetail
                        });

                        if (typeof SortedObject[$scope.DbSchema[j].ObjConstraintValues.length + '-index'] == 'undefined')
                            SortedObject[$scope.DbSchema[j].ObjConstraintValues.length + '-index'] = [];
                        SortedObject[$scope.DbSchema[j].ObjConstraintValues.length + '-index'].push({
                            ReferencedCount: $scope.DbSchema[j].ObjConstraintValues.length,
                            TableName: $scope.TableDetail[i].TableName.toLocaleLowerCase(),
                            Constraint: $scope.DbSchema[j].ObjConstraintValues,
                            SchemaDetail: $scope.TableDetail[i].ObjTableDetail
                        });
                        break;
                    }
                }

                if (!isFound) {
                    if (typeof SortedObject['0-index'] == 'undefined')
                        SortedObject['0-index'] = [];
                    $scope.TableInformation.push({
                        ReferencedCount: 0,
                        TableName: $scope.TableDetail[i].TableName.toLocaleLowerCase(),
                        Constraint: [],
                        SchemaDetail: $scope.TableDetail[i].ObjTableDetail
                    });

                    SortedObject['0-index'].push({
                        ReferencedCount: 0,
                        TableName: $scope.TableDetail[i].TableName.toLocaleLowerCase(),
                        Constraint: [],
                        SchemaDetail: $scope.TableDetail[i].ObjTableDetail
                    });
                }
            }

            $.each(SortedObject, function (obj, index) {
                $scope.Wrapper.push(SortedObject[obj]);
            });

            $scope.Wrapper.sort(function (a, b) {
                if (a.length > 0 && b.length > 0) {
                    return a[0].ReferencedCount - b[0].ReferencedCount;
                }
            });

            return true;
        }
    }

    $scope.enableServerUri = function () {
        if ($('#serveruri').css('display') == 'none')
            $('#serveruri').fadeIn(500);
        else
            $('#serveruri').fadeOut(500);
    }

    $scope.connectToServer = function () {
        $('.collapse-link').click();
        setTimeout(() => {
            $scope.jsonData = data;
        }, 5000);
    }

    $rootScope.showTableSelection = function () {

        if ($('#dynamodal').html().trim() == '') {
            var $handler = $ajax.get('DbAction/GetTableSchemaView', 'html');

            $handler.done(function (result) {
                var html = result;
                $('#dynamodal').empty();
                $('#dynamodal').append($compile(html)($scope));
                $('#createtable').show(200);

                if ($scope.$root.$$phase != '$digest' && $scope.$root.$$phase != '$apply')
                    $scope.$digest();
            });

            $handler.fail(function (e, x) {
                alert(JSON.stringify(e));
            });
        } else {
            $('#createtable').show(200);
        }
    }

    $scope.openSelection = function () {
        event.stopPropagation();
        var selectedType = $(event.currentTarget).val();
        if (selectedType == 'VARCHAR(10)') {
            $('#datatypewithsize').val(selectedType);
        } else {
            $('#datatypewithsize').val(selectedType);
        }
        $(event.currentTarget).closest('td').find('input[name="datatype"]').val(selectedType);
        $(event.currentTarget).closest('td').css({ 'background-color': '#fff' });
        $(event.currentTarget).closest('td').find('input[name="datatype"]').css({ 'background-color': '#fff' });
    }

    $scope.preventSelection = function () {
        $('#dynamic-row').find('div[name="select-dv"]').hide();
    }

    $scope.selectType = function () {

        var selectedValue = $(event.currentTarget).text().trim();
        $(event.currentTarget).closest('td').find('input[type="text"]').val(selectedValue);
        $('#dynamic-row').find('div[name="select-dv"]').hide();
    }

    $scope.resetSelected = function () {
        if ($(event.currentTarget).attr('name') != 'selection-box')
            $('#dynamic-row').find('div[name="select-dv"]').hide();
    }

    $scope.addNewEntry = function () {

        if ($scope.previousFilled()) {
            var row = `<tr name="row">
                        <td class ="" style="width: 4%; text-align:center" ng-click="selectRow()">
                            {{index}}
                        </td>
                        <td style="width: 26%;">
                            <input type="text" class ="txtNoBoarder" ng-keydown="hideError()" name="column" placeholder="Column name">
                        </td>
                        <td style="width: 16%;" disabled="disabled">
                           <div class ="select-editable">
                                <select class ="newtype" ng-focus="getInitValue()" name="select-option" ng-model="datatype" ng-change="openSelection()">
                                    <option selected="selected" value="">DATATYPE</option>
                                    <option value="VARCHAR(10)">VARCHAR(10)</option>
                                    <option value="INT">INT</option>
                                    <option value="BIT">BIT</option>
                                    <option value="DATETIME">DATETIME</option>
                                </select>
                                <input type="text" placeholder="DATATYPE" name="datatype" style="padding-left: 4px;" value="" />
                            </div>
                        </td>
                        <td class="tickColumn">
                            <input type="checkbox" class ="chkStyle" ng-click="checkPrimary()" name="pk" />
                        </td>
                        <td class="tickColumn">
                            <input type="checkbox" class="chkStyle" name="null" />
                        </td>
                        <td class="tickColumn">
                            <input type="checkbox" class="chkStyle" name="uq" />
                        </td>
                        <td class="tickColumn">
                            <input type="checkbox" class="chkStyle" name="bin" />
                        </td>
                        <td class="tickColumn">
                            <input type="checkbox" class="chkStyle" name="uf" />
                        </td>
                        <td class="tickColumn">
                            <input type="checkbox" class="chkStyle" name="zf" />
                        </td>
                        <td class="tickColumn">
                            <input type="checkbox" class="chkStyle" name="al" />
                        </td>
                    </tr>`;

            row = row.replace('{{index}}', ++$scope.counter);
            $(event.currentTarget).closest('tr').before($compile(row)($scope));
            var currentTagHeight = $(event.currentTarget).css('height');
            var divHeight = $('table[name="databaseTable"]').closest('div').css('height');
            $('table[name="databaseTable"]').closest('div').scrollTop(currentTagHeight + divHeight)
            $(event.currentTarget).closest('tr').prev().find('input[name="column"]').focus();
        }
    }

    $scope.previousFilled = function () {
        var state = false;
        if ($(event.currentTarget).closest('tr').prev().find('input[name="column"]').val().trim() != '') {
            if ($(event.currentTarget).closest('tr').prev().find('select[name="select-option"]').val() != '') {
                state = true;
            } else {
                //$(event.currentTarget).closest('tr').prev().find('select[name="select-option"]').closest('td').css({ 'border-bottom': '1px solid red' });
                $(event.currentTarget).closest('tr').prev().find('input[name="datatype"]').val('');
                $(event.currentTarget).closest('tr').prev().find('input[name="datatype"]').closest('td').css({ 'background-color': 'rgba(241, 241, 56, 0.18823529411764706)' });
                $(event.currentTarget).closest('tr').prev().find('input[name="datatype"]').css({ 'background-color': 'rgba(241, 241, 56, 0.18823529411764706)' });
                state = false;
            }
        } else {
            //$(event.currentTarget).closest('tr').prev().find('input[name="column"]').closest('td').css({ 'border-bottom': '1px solid red' });
            $(event.currentTarget).closest('tr').prev().find('input[name="column"]').closest('td').css({ 'background-color': 'rgba(241, 241, 56, 0.18823529411764706)' });
            $(event.currentTarget).closest('tr').prev().find('input[name="column"]').closest('td').find('input[type="text"]').css({ 'background-color': 'rgba(241, 241, 56, 0.18823529411764706)' });
            state = false;
        }
        return state;
    }

    $scope.hideError = function () {
        //$(event.currentTarget).closest('td').css({ 'border': '1px solid #d9d9d9' });
        $(event.currentTarget).closest('td').css({ 'background-color': '#fff' });
        $(event.currentTarget).closest('td').find('input[type="text"]').css({ 'background-color': '#fff' });
    }

    $scope.executeQuery = function () {

        if ($('#tablename').val().trim() != '') {
            var columnProperty = {};
            $scope.columnInfo = [];
            var keys = '';
            $.each($('#dynamic-row').find('tr[name="row"]'), function (index, tag) {
                columnProperty = {
                    isNull: false,
                    name: '',
                    datatype: ''
                };
                var properties = $(tag).find('input[type="checkbox"]:checked');

                if ($(tag).find('input[type="text"]').length > 0) {
                    columnProperty.name = $(tag).find('input[name="column"]').val();
                    columnProperty.datatype = $(tag).find('input[name="datatype"]').val();
                }

                var isPrimary = false;
                if (properties.length > 0) {
                    $.each(properties, function (index, el) {
                        if ($(el).attr('name') == 'pk') {
                            if ($(el).prop('checked')) {
                                keys += '\n\tprimary key(' + columnProperty.name + ')';
                                isPrimary = true;
                            }
                        } else if ($(el).attr('name') == 'null' && !isPrimary) {
                            if ($(el).prop('checked')) {
                                columnProperty.isNull = true;
                            }
                        } else if ($(el).attr('name') == 'uq') {
                            if ($(el).prop('checked')) {
                                keys += ',\n\tunique key(' + columnProperty.name + ')';
                            }
                        } else if ($(el).attr('name') == 'bin') {
                            if ($(el).prop('checked')) {
                            }
                        } else if ($(el).attr('name') == 'uf') {
                            if ($(el).prop('checked')) {
                            }
                        } else if ($(el).attr('name') == 'zf') {
                            if ($(el).prop('checked')) {
                            }
                        } else if ($(el).attr('name') == 'al') {
                            if ($(el).prop('checked')) {
                            }
                        }
                    });
                }
                $scope.columnInfo.push(columnProperty);
            });

            if ($scope.columnInfo.length > 0) {
                if ($scope.GenerateQuery($scope.columnInfo, keys)) {
                    $scope.DesignUI();
                }
            }
        } else {
            $('#tablename').css({ 'background-color': 'rgba(241, 241, 56, 0.18823529411764706)' });
        }
    }

    $scope.DesignUI = function () {
        var tableName = $('#tablename').val();
        var template = uiTemplate.replace(/{{tablename-dv}}/g, tableName.replace(/ /g, '').trim().toLocaleLowerCase());

    }

    $scope.closeCreator = function () {
        $('#createtable').hide(200);
    }

    $scope.enableField = function () {
        if ($('#tablename').val().trim() != '')
            $('#tablename').css({ 'background-color': '#fff' });
    }

    $scope.GenerateQuery = function (tableInfo, keys) {

        var state = false;
        if (tableInfo != null && tableInfo.length > 0) {

            var query = 'Create table ' + $('#tablename').val() + '(\n';
            var nullType = '(\n';
            for (var i = 0; i < tableInfo.length; i++) {

                nullType = '';
                if (tableInfo[i].isNull)
                    nullType = ' null';
                query += '\n\t' + tableInfo[i].name + ' ' + tableInfo[i].datatype + ' ' + nullType + ',';
            }

            if (keys == null)
                keys = '';
            query += keys + '\n);';
            //alert(query);
            state = true;
        }
        return state;
    }

    $scope.getInitValue = function () {
        $(event.currentTarget).closest('tr').find('input[name="datatype"]').focus();
        $(event.currentTarget).closest('tr').find('select[name="select-option"] option').prop('selected', false).removeAttr('selected');
        $(event.currentTarget).closest('tr').find('select[name="select-option"] option[value="VARCHAR(10)"]').prop('selected', true).attr('selected', 'selected');
        $scope.openSelection();
        $(event.currentTarget).closest('tr').find('input[name="datatype"]').val('VARCHAR(10)');
    }

    $scope.checkPrimary = function () {
        if ($('table[name="databaseTable"]').find('input[type="checkbox"][name="pk"]:checked').length > 1)
            event.preventDefault();
    }

    $scope.selectRow = function () {

    }

    $scope.ViewTableDetail = function () {
        event.stopPropagation();
        $('#dy-table').find('div[name="tableSchema"]').hide();
        var position = $(event.currentTarget).offset();
        var height = $(event.currentTarget).closest('.dynamic-dv').find('div[name="tableSchema"]').outerHeight();
        $(event.currentTarget).closest('.dynamic-dv').find('div[name="tableSchema"]').css({ 'top': position.top - height / 2, 'left': position.left + 110 });
        $(event.currentTarget).closest('.dynamic-dv').find('div[name="tableSchema"]').show();
    }

    $scope.hideTooltips = function () {
        $('#dy-table').find('div[name="tableSchema"]').hide();

        var ReferencedTable = '';
        var CurrentTable = '';
        for (var item = 0; item < $scope.Wrapper.length; item++) {

            for (var i = 0; i < $scope.Wrapper[item].length; i++) {

                CurrentTable = '';
                CurrentTable = $scope.Wrapper[item][i].TableName;
                for (var j = 0; j < $scope.Wrapper[item][i].ReferencedCount; j++) {
                    ReferencedTable = '';
                    ReferencedTable = $scope.Wrapper[item][i].Constraint[j].ReferencedTableName;
                    $scope.DrawRelation(CurrentTable, ReferencedTable);
                }
            }
        }
    }

    $scope.DrawRelation = function (t1, t2) {
        var x1, x2, y1, y2, x3, y3 = 0;
        var h1, h2, w1, w2 = 0;
        var width1 = 1;
        var height1 = 1;
        var width2 = 1;
        var height2 = 1;
        var arrow = '';
        var top1, left1, top2, left2 = 0;
        var firstTable = $('div[name="' + t1 + '"]');
        var secondTable = $('div[name="' + t2 + '"]');
        var tagName = firstTable.attr('name') + '-' + secondTable.attr('name');

        h1 = firstTable.outerHeight();
        h2 = secondTable.outerHeight();
        w1 = firstTable.outerWidth();
        w2 = secondTable.outerWidth()

        x1 = firstTable.offset().left;
        y1 = firstTable.offset().top;
        x2 = secondTable.offset().left;
        y2 = secondTable.offset().top;

        if (x1 == x2) {
            if (y1 > y2) {
                x1 = x1 + w1 / 2;
                x2 = x2 + w2 / 2;
                y2 = y2 + h2;
            } else {
                x1 = x1 + w1 / 2;
                y1 = y1 + h1;
                x2 = x2 + w2 / 2;
            }
        } else if (y1 == y2) {
            if (x1 > x2) {
                x2 = x2 + w2;
                y1 = y1 + h1 / 2;
                y2 = y2 + h2 / 2;
            } else {
                x1 = x1 + w1;
                y1 = y1 + h1 / 2;
                y2 = y2 + h2 / 2;
            }
        } else {
            if (x1 > x2) {
                if (y1 > y2) {
                    x1 = x1 + w1 / 2;
                    x2 = x2 + w2;
                    y2 = y2 + h2 / 2;
                } else {
                    x1 = x1 + w1 / 2;
                    y1 = y1 + h1;
                    x2 = x2 + w2;
                    y2 = y2 + h2 / 2;
                }
            } else {
                if (y1 > y2) {
                    x1 = x1 + w1 / 2;
                    y2 = y2 + h2 / 2;
                } else {
                    x1 = x1 + w1 / 2;
                    y1 = y1 + h1;
                    y2 = y2 + h2 / 2;

                }
            }
        }

        x3 = x1;
        y3 = y2;
        var isEqual = false;
        if (x1 == x2) {
            if (y1 > y2) {
                top2 = y2;
                left2 = x2;
                height2 = y1 - y2;
                arrow = 'arrow_top';
            } else {
                top2 = y1;
                left2 = x1;
                height2 = y2 - y1;
                arrow = 'arrow_bottom';
            }

            isEqual = true;
        } else if (y1 == y2) {
            if (x1 > x2) {
                top2 = y2;
                left2 = x2;
                width2 = x1 - x2;
                arrow = 'arrow_left';
            } else {
                top2 = y1;
                left2 = x1;
                width2 = x2 - x1;
                arrow = 'arrow_right';
            }
            isEqual = true;
        } else {

            if (x1 > x2) {
                if (y1 > y2) {
                    top1 = y3;
                    left1 = x3;
                    height1 = y1 - y3;
                    top2 = y2;
                    left2 = x2;
                    width2 = x3 - x1;
                    arrow = 'arrow_left';
                } else {
                    top2 = y2;
                    left2 = x2;
                    width2 = x3 - x2;
                    left1 = x1;
                    top1 = y1;
                    height1 = y3 - y1;
                    arrow = 'arrow_left';
                }
            } else {
                if (y1 > y2) {
                    top2 = y3;
                    left2 = x3;
                    width2 = x2 - x3;
                    top1 = y3;
                    left1 = x3;
                    height1 = y1 - y3;
                    arrow = 'arrow_right';
                } else {
                    top2 = y3;
                    left2 = x3;
                    width2 = x2 - x3;
                    top1 = y1;
                    left1 = x1;
                    height1 = y3 - y1;
                    arrow = 'arrow_right';
                }
            }
        }

        //var firstLine = svgline.replace('{{x1}}', x1)
        //                     .replace('{{y1}}', y1)
        //                     .replace('{{x2}}', x3)
        //                     .replace('{{y2}}', y3)
        //                     .replace('{{TableName-relation}}', tagName);

        //var secondLint = svgline.replace('{{x1}}', x3)
        //             .replace('{{y1}}', y3)
        //             .replace('{{x2}}', x2)
        //             .replace('{{y2}}', y2)
        //             .replace('{{TableName-relation}}', tagName);


        var template = '<div style="width:{{width}}px;height:{{height}}px;background-color:#444;position:absolute;top:{{lineTop}}px;left:{{lineLeft}}px;" class="{{arrow-class}}"></div>';
        var firstLine = template.replace('{{width}}', width1)
                                .replace('{{height}}', height1)
                                .replace('{{lineTop}}', top1)
                                .replace('{{arrow-class}}', '')
                                .replace('{{lineLeft}}', left1);

        var secondLine = template.replace('{{width}}', width2)
                                .replace('{{height}}', height2)
                                .replace('{{lineTop}}', top2)
                                .replace('{{arrow-class}}', arrow)
                                .replace('{{lineLeft}}', left2);


        console.log(t1);
        console.log(t2);

        if (!isEqual) {
            firstTable.append(firstLine);
            firstTable.append(secondLine);
        } else {
            firstTable.append(secondLine);
        }

        //$('svg[name="accesslevel"] line').attr({ x1: x1, y1: y1, x2: x2, y2: y2 });
    }
});