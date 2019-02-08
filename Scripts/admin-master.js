/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('master', function ($scope, $rootScope, $ajax, $local) {

    $scope.record = null;
    $scope.total = 0;
    $scope.Sections = [];
    $scope.SelectedClass = null;
    $scope.RecordsArray = [];
    $scope.AvalClassSection = [];
    $scope.SubjectArray = [];
    $scope.Sections = ['A', 'B', 'C', 'D', 'E', 'F'];

    angular.element(document).ready(function () {
        $scope.BindClass();
        if (typeof Type != "undefined") {
            if (Type == "vehicle") {
                $('#currentpageindex').val('1');
                $scope.HandlePageData(Data);
            } else if (Type == "subject") {
                $scope.HandleSubjectPage(Data);
            }
        }
    });

    $scope.HandleSubjectPage = function (Result) {
        $scope.SubjectArray = [];
        if (typeof Result.Table != 'undefined' && Result.Table != null) {
            $scope.SubjectArray = Result.Table;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    }

    $scope.HandlePageData = function (ServerData) {
        if (ServerData != null && ServerData != "") {
            $scope.record = ServerData.Table;
            var pageno = 1;
            if ($('#currentpageindex').val() != '')
                pageno = parseInt($('#currentpageindex').val());
            $scope.total = ServerData.Table1[0].Total;
            $scope.BindTable($scope.record);
            $rootScope.pagination({
                total: $scope.total,
                pageno: pageno
            }, true);
        }
    }

    $scope.BindTable = function (record) {
        var Std = '';
        var FilteredSection = [];
        $scope.RecordsArray = [];
        for (var i = 0; i < record.length; i++) {
            $scope.Sections = ['A', 'B', 'C', 'D', 'E', 'F'];
            if (record[i].Class == 'NUR')
                Std = { name: record[i].Class, value: 'Nursury' };
            else if (record[i].Class == 'UKG')
                Std = { name: record[i].Class, value: 'UKG' };
            else if (record[i].Class == 'LKG')
                Std = { name: record[i].Class, value: 'LKG' };
            else if (record[i].Class == 'PRE')
                Std = { name: record[i].Class, value: 'Pre Primary' };
            else if (record[i].Class == '1')
                Std = { name: record[i].Class, value: record[i].Class + 'st Standand' };
            else if (record[i].Class == '2')
                Std = { name: record[i].Class, value: record[i].Class + 'nd Standand' };
            else if (record[i].Class == '3')
                Std = { name: record[i].Class, value: record[i].Class + 'rd Standand' };
            else
                Std = { name: record[i].Class, value: record[i].Class + 'th Standand' };

            var SectionList = $scope.FilterUnusedClass(record[i].Section);
            for (var j = 0; j < $scope.AvalClassSection.length; j++) {

                if ($scope.AvalClassSection[j].ClassValue.toLowerCase() == record[i].Class.toLowerCase()) {
                    $scope.AvalClassSection[j].Section = SectionList;
                    $scope.AvalClassSection[j].Active = 1;
                    break;
                }
            }

            $scope.RecordsArray.push({
                'Class': Std,
                'Section': record[i].Section,
                'GirlSeats': record[i].GirlSeats,
                'BoySeats': record[i].BoySeats,
                'TotalSeats': record[i].TotalSeats,
                'Available': record[i].Available,
                'ClassDetailId': record[i].ClassDetailId
            });
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
        $('#viewfeestimetable-dv').fadeIn();
    }

    $scope.FilterUnusedClass = function (PassedClassList) {

        var FilterClass = ['A', 'B', 'C', 'D', 'E', 'F'];
        if (PassedClassList != null && PassedClassList != "") {
            var ClassList = PassedClassList.split(',');
            for (i = 0; i < ClassList.length; i++) {
                if (ClassList[i].toLowerCase() == 'a')
                    FilterClass.splice(FilterClass.indexOf('A'), 1);

                if (ClassList[i].toLowerCase() == 'b')
                    FilterClass.splice(FilterClass.indexOf('B'), 1);

                if (ClassList[i].toLowerCase() == 'c')
                    FilterClass.splice(FilterClass.indexOf('C'), 1);

                if (ClassList[i].toLowerCase() == 'd')
                    FilterClass.splice(FilterClass.indexOf('D'), 1);

                if (ClassList[i].toLowerCase() == 'e')
                    FilterClass.splice(FilterClass.indexOf('E'), 1);

                if (ClassList[i].toLowerCase() == 'f')
                    FilterClass.splice(FilterClass.indexOf('F'), 1);
            }
        }

        return FilterClass;
    }

    $scope.BindClass = function () {
        $scope.ClassDetail = $local.get('masterdata');
        if ($scope.ClassDetail != null && $scope.ClassDetail != "") {
            $scope.ClassDetail = $scope.ClassDetail.Classes;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    }

    $scope.addNewClass = function () {
        $rootScope.ShowLoader();
        $scope.InsertUpdateStatus = "";
        $scope.FormData = {};
        var ErrorArrary = [];

        if ($('#class option:selected').val() != "")
            $scope.FormData.Class = $('#class option:selected').val().trim();
        else
            ErrorArrary.push('class');

        if ($('#section option:selected').val() != "")
            $scope.FormData.Section = $('#section option:selected').val().trim();
        else
            ErrorArrary.push('section');

        if ($('#totalseats').val() != "")
            $scope.FormData.TotalSeats = $('#totalseats').val().trim();
        else
            ErrorArrary.push('totalseats');

        if ($('#gseats').val() != "")
            $scope.FormData.GirlSeats = $('#gseats').val().trim();
        else
            $scope.FormData.GirlSeats = 0;

        if ($('#bseats').val() != "")
            $scope.FormData.BoySeats = $('#bseats').val().trim();
        else
            $scope.FormData.BoySeats = 0;

        if ($('#CurrentClassDetailId').val() != "")
            $scope.FormData.ClassDetailId = $('#CurrentClassDetailId').val();
        else
            $scope.FormData.ClassDetailId = '';

        if (ErrorArrary.length > 0) {
            for (var i = 0; i < ErrorArrary.length; i++) {
                $('#' + ErrorArrary[i]).css({ 'border': '1px solid red' });
            }
        } else {

            var handler = $ajax.post('AdminMaster/InsertNewClassInfo', JSON.stringify($scope.FormData));
            handler.done(function (result) {
                if (result != null && result != '') {
                    if (Type == "vehicle") {
                        if (Object.keys(result).length == 2) {
                            $scope.InsertUpdateStatus = result.result;
                            $rootScope.ShowToast($scope.InsertUpdateStatus, 3000);
                            if (typeof result.data == 'string')
                                result = JSON.parse(result.data);
                            $scope.HandlePageData(result);
                            $scope.ResetForm();
                        }
                        $rootScope.HideLoader();
                    } else if (Type == "subject") {
                        if (typeof result == 'string')
                            result = JSON.parse(result);
                        $scope.HandleSubjectPage(result);
                    }
                }
            });

            handler.fail(function (e, x) {
                $rootScope.HideLoader();
                console.log('[Reports StaffReports] fail to get result: ' + JSON.stringify(error));
            });
        }
    }

    $scope.ClearPopup = function () {
        $('#subjectname').val('');
        $('#subjectcode').val('');
        $('#credit').val('');
    }

    $scope.AddSubject = function () {
        var ErrorCount = 0;
        var RequestData = {
            SubjectName: '',
            SubjectCode: '',
            Credit: 0
        };

        if ($('#subjectname').val().trim() == '') {
            $('#subjectname').addClass('error-field');
            ErrorCount++;
        } else {
            RequestData.SubjectName = $('#subjectname').val().trim();
        }

        if ($('#subjectcode').val().trim() == '') {
            $('#subjectcode').addClass('error-field');
            ErrorCount++;
        } else {
            if (!isNaN($('#subjectcode').val().trim())) {
                RequestData.SubjectCode = parseInt($('#subjectcode').val().trim());
            } else {
                $('#subjectcode').addClass('error-field');
                ErrorCount++;
            }
        }

        if (!isNaN($('#credit').val().trim())) {
            RequestData.Credit = parseInt($('#credit').val().trim());
        }

        if (ErrorCount == 0) {
            $('#addclassmodal').modal('hide');
            var $handler = $ajax.post('AdminMaster/AddEditSubjects', JSON.stringify(RequestData));
            $handler.done(function (result) {
                if (result != null) {
                    var SubjectResult = JSON.parse(result)
                    if (SubjectResult != null && SubjectResult != "") {
                        $scope.HandleSubjectPage(SubjectResult);
                        $rootScope.ShowMessage('Inserted/Updated successfully');
                    } else {
                        $rootScope.ShowMessage('Fail to insert subject. Please contact to your admin.');
                    }
                } else {
                    // Subject insertion fail
                    $rootScope.ShowMessage('Fail to insert subject. Please contact to your admin.');
                }
            });

            $handler.fail(function (error, ex) {
                $rootScope.ShowMessage('Fail to insert subject. Please contact to your admin.');
            });
        }
    }

    $scope.EditCurrentItem = function () {
        $('#addclassmodal').modal('show');
    }

    $scope.DeleteCurrentItem = function () {
        var Msg = "Do you want to delete this entry. If YES press [OK] else press [CLOSE] to perform your action.";
        $rootScope.ShowMessage(Msg, null);
    }

    $scope.FilterRecord = function () {
        $rootScope.ShowLoader();
        var SelectedClass = $('#filterclass option:selected').val();
        var SelectedSection = $('#filtersection option:selected').val();
        var SearchStr = '';
        SearchStr = SelectedClass != '' ? 'Class=' + SelectedClass : '1=1';
        SearchStr += SelectedSection != "" ? " and Section='" + SelectedSection + "'" : "";
        $('#searchstring').val(SearchStr);
        $('#currentpageindex').val('1');
        $scope.MakeServerClassOnTable('AdminMaster/GetClassDetail', SearchStr, $('#sortby').val(), $('#currentpageindex').val(), 10);
    }

    $scope.ResetFilter = function () {
        $rootScope.ShowLoader();
        $('#searchstring').val('1=1');
        $('#sortby').val(' Class');
        $('#currentpageindex').val('1');
        $scope.MakeServerClassOnTable('AdminMaster/GetClassDetail', '1=1', $('#sortby').val(), $('#currentpageindex').val(), 10);
    }

    $scope.MakeServerClassOnTable = function (Url, SearchString, SortBy, PageIndex, PageSize) {
        if ($('#searchstring').val() == "" || $('#searchstring').val() == null)
            $('#searchstring').val('1=1');
        if ($('#sortby').val() == "" || $('#sortby').val() == null)
            $('#sortby').val('Class');
        var PaggeUrl = Url + '?SearchStr=' + SearchString + '&SortBy=' + SortBy + '&PageIndex=' + PageIndex + '&PageSize=' + PageSize;
        var $handler = $ajax.get(PaggeUrl, 'json');
        $handler.done((result) => {
            if (result != null && result != '') {
                if (Type == "vehicle") {
                    if (typeof result == 'string')
                        result = JSON.parse(result);
                    $scope.HandlePageData(result);
                    $rootScope.HideLoader();
                } else if (Type == "subject") {
                    if (typeof result == 'string')
                        result = JSON.parse(result);
                    $scope.HandleSubjectPage(result);
                }
            }
        });

        $handler.fail((error) => {
            $rootScope.HideLoader();
            console.log('[Reports StaffReports] fail to get result: ' + JSON.stringify(error));
        });
    }

    $rootScope.getNewPage = function (pageNo) {
        $('#pageindex').val(pageNo);
        if (pageNo != '' && !$(event.currentTarget).prop('disabled')) {
            $rootScope.ShowLoader();
            $('#currentpageindex').val(pageNo)
            if ($('#searchstring').val() == "" || $('#searchstring').val() == null)
                $('#searchstring').val('1=1');
            if ($('#sortby').val() == "" || $('#sortby').val() == null)
                $('#sortby').val('Class');
            $scope.MakeServerClassOnTable('AdminMaster/GetClassDetail', $('#searchstring').val(), $('#sortby').val(), $('#currentpageindex').val(), 10);
        }
    }

    $rootScope.getPreviousPage = function (pageNo) {
        $('#pageindex').val(pageNo);
        if (pageNo != '' && !$(event.currentTarget).prop('disabled')) {
            $rootScope.ShowLoader();
            $('#currentpageindex').val(pageNo)
            if ($('#searchstring').val() == "" || $('#searchstring').val() == null)
                $('#searchstring').val('1=1');
            if ($('#sortby').val() == "" || $('#sortby').val() == null)
                $('#sortby').val('Class');
            $scope.MakeServerClassOnTable('AdminMaster/GetClassDetail', $('#searchstring').val(), $('#sortby').val(), $('#currentpageindex').val(), 10);
        }
    }

    $scope.ResetForm = function () {
        $('#class').val("");
        $('#section').val("");
        $('#totalseats').val('');
        $('#gseats').val('');
        $('#bseats').val('');
    }

    $scope.EditCurrentRecord = function () {
        var $CurrentRow = $(event.currentTarget).closest('div[name="table"]');
        var Class = $CurrentRow.find('div[name="class"]').attr('value');
        if ($rootScope.IsValid(Class))
            $('#class').val(Class);
        var Section = $CurrentRow.find('div[name="section"]').attr('value');
        if ($rootScope.IsValid(section))
            if (Section.indexOf(',') == -1)
                $('#section').val(Section);
        var TotalSeats = $CurrentRow.find('div[name="totalseats"]').attr('value');
        if ($rootScope.IsValid(TotalSeats))
            $('#totalseats').val(TotalSeats);
        var Gseats = $CurrentRow.find('div[name="gseats"]').attr('value');
        if ($rootScope.IsValid(Gseats))
            $('#gseats').val(Gseats);
        var Bseats = $CurrentRow.find('div[name="bseats"]').attr('value');
        if ($rootScope.IsValid(Bseats))
            $('#bseats').val(Bseats);
        var ClassDetailId = $CurrentRow.find('input[name="classid"]').val();
        if ($rootScope.IsValid(ClassDetailId))
            $('#CurrentClassDetailId').val(ClassDetailId);
    }
});