﻿/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('facultyReportCtrl', function ($scope, $rootScope, $ajax) {

    $scope.TableResultSet = [];
    $scope.TotalCount = 0;
    $scope.PageIndex = '';
    $scope.PageSize = '';
    $scope.SearchString = '';
    $scope.SortBy = '';
    angular.element(document).ready(function () {
        if (Data != null && Data != '') {
            $('#pageindex').val('1');
            $scope.TableResultSet = Data.Table;
            $scope.TotalCount = Data.Table1[0].Total;
            $('#pageindex').val('1');
            $rootScope.pagination({
                total: $scope.TotalCount,
                pageno: 1
            }, true);
        } else {
            $rootScope.pagination({
                total: 0,
                pageno: 1
            }, true);
        }
    });

    $scope.searchByFilter = function () {
        var searchStr = '';
        if ($('#nameFilter').val().trim() != '') {
            searchStr += " FName like '" + $('#nameFilter').val() + "%'";
        } if ($('#mobileFilter').val().trim() != '') {
            if (searchStr != '')
                searchStr += " and MobileNumber like '" + $('#mobileFilter').val() + "%'";
            else
                searchStr += " MobileNumber like '" + $('#mobileFilter').val() + "%'";
        } if ($('#emailFilter').val().trim() != '') {
            if (searchStr != '')
                searchStr += " and email like '" + $('#emailFilter').val() + "%'";
            else
                searchStr += " email like '" + $('#emailFilter').val() + "%'";
        }

        if (searchStr == '')
            searchStr = '1=1';

        $('#searchstring').val(searchStr);
        $rootScope.getNewPage($('#pageindex').val());
    }

    $scope.resetAll = function () {
        $('#nameFilter').val('');
        $('#emailFilter').val('');
        $('#mobileFilter').val('');
        $('#searchstring').val('1=1');
        $('#sortby').val();
        $('#pageindex').val('1');
        $rootScope.getNewPage('1');
    }

    $rootScope.getNewPage = function (pageNo) {
        $('#pageindex').val(pageNo);
        if (pageNo != '' && !$(event.currentTarget).prop('disabled')) {
            waitingDialog.show('Loading ...');
            $scope.PageIndex = pageNo;
            $scope.PageSize = '';
            if ($('#searchstring').val().trim() != '')
                $scope.SearchString = $('#searchstring').val();
            $scope.SortBy = $('#sortby').val();
            var PadingUrl = 'Reports/FacultyReports?SearchString=' + $scope.SearchString + '&SortBy=' + $scope.SortBy +
                            '&PageIndex=' + $scope.PageIndex + '&PageSize=' + $scope.PageSize;

            var $handler = $ajax.get(PadingUrl, 'json');
            $handler.done((result) => {
                if (result != null && result != '') {
                    var Data = result;
                    $scope.TableResultSet = Data.Table;
                    $scope.TotalCount = Data.Table1[0].Total;
                    $('#pageindex').val($scope.PageIndex);
                    $rootScope.pagination({
                        total: $scope.TotalCount,
                        pageno: $scope.PageIndex
                    }, true);
                }
            });

            $handler.fail((error) => {
                console.log('[Reports StaffReports] fail to get result: ' + JSON.stringify(error));
            });
        }
    }

    $rootScope.getPreviousPage = function (pageNo) {
        $('#pageindex').val(pageNo);
        if (pageNo != '' && !$(event.currentTarget).prop('disabled')) {
            waitingDialog.show('Loading ...');
            $scope.PageIndex = pageNo;
            $scope.PageSize = '';
            $scope.SearchString = '';
            $scope.SortBy = $('#sortby').val();
            var PadingUrl = 'Reports/FacultyReports?SearchString=' + $scope.SearchString + '&SortBy=' + $scope.SortBy +
                            '&PageIndex=' + $scope.PageIndex + '&PageSize=' + $scope.PageSize;
            var $handler = $ajax.get('Reports/StaffReport', 'json');
            $handler.done((result) => {
                if (result != null && result != '') {
                    var Data = resul;
                    $scope.TableResultSet = Data.Table;
                    $scope.TotalCount = Data.Table1[0].Total;
                    $('#pageindex').val($scope.PageIndex);
                    $rootScope.pagination({
                        total: $scope.TotalCount,
                        pageno: $scope.PageIndex
                    }, false);
                }
            });

            $handler.fail((error) => {
                console.log('[Reports StaffReports] fail to get result: ' + JSON.stringify(error));
            });
        }
    }

    $scope.editStaffMember = function () {
        var staffUid = $(event.currentTarget).closest('td').find('input[name="uid"]').val();
        location.href = '../Registration/FacultyRegistration?StaffUid=' + staffUid;
    }
})