/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.min.js" />
/// <reference path="layout.js" />


app.controller('attendenceCtrl', function ($scope, $ajax, $rootScope, $local) {

    $scope.rowset = [];
    $scope.attendence = null;
    $scope.cellset = [];
    $scope.RecordInfo = [];
    $scope.StartDate = '';
    $scope.EndDate = '';
    $scope.CurrentDate = new Date();
    $scope.AttendenceData = [];
    $scope.MonthDate = [];
    $scope.AttrReportDemo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    const MonthName = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    angular.element(document).ready(function () {
        $scope.attendence = Data;
        if ($scope.attendence.length > 0)
            $scope.InitCurrenMonthAttendence();

        $scope.InitDefaultFun();
        //$scope.InitCalender();
        $scope.BindClass();
        $scope.LoadStudentAttendenceReport();
    });

    $scope.InitDefaultFun = function () {
        $(function () {
            $('[data-toggle="popover"]').popover()
        });

        $('#calendar-monthyearpicker').datetimepicker({
            viewMode: 'years',
            format: 'MM/YYYY'
        });
    }

    $scope.LoadStudentAttendenceReport = function () {
        var Url = "Reports/AttendenceAllByFilter?SearchString=1=1&SortBy=Rollno&PageIndex=1&PageSize=10";
        var $handler = $ajax.get(Url, 'json');
        $handler.done(function (result) {
            if (typeof result.Table != "undefined" && typeof result.Table1 != "undefined") {
                $scope.TableResultSet = result.Table;
                $scope.TotalCount = result.Table1[0].Total;
                $rootScope.pagination({
                    total: $scope.TotalCount,
                    pageno: 1
                }, true);
            }

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        });

        $handler.fail(function (e, x) {

        });
    }

    $scope.GetFilteredData = function () {
        var url = "Reports/AttendenceAllByFilter?SearchString=1=1&SortBy=Rollno&PageIndex=1&PageSize=10";
    }

    $scope.InitCalender = function () {
        if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
        console.log('init_daterangepicker_right');

        var cb = function (start, end, label) {
            console.log(start.toISOString(), end.toISOString(), label);
            $('#reportrange_right span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        };

        var optionSet1 = {
            startDate: moment().subtract(29, 'days'),
            endDate: moment(),
            minDate: '01/01/2012',
            maxDate: '12/31/2020',
            dateLimit: {
                days: 60
            },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'right',
            buttonClasses: ['btn btn-default'],
            applyClass: 'btn-small btn-primary',
            cancelClass: 'btn-small',
            format: 'MM/DD/YYYY',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                cancelLabel: 'Clear',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        };

        $('#reportrange_right span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

        $('#reportrange_right').daterangepicker(optionSet1, cb);

        $('#reportrange_right').on('show.daterangepicker', function () {
            console.log("show event fired");
        });
        $('#reportrange_right').on('hide.daterangepicker', function () {
            console.log("hide event fired");
        });
        $('#reportrange_right').on('apply.daterangepicker', function (ev, picker) {
            console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
            $scope.StartDate = new Date(picker.startDate);
            $scope.EndDate = new Date(picker.endDate);
        });
        $('#reportrange_right').on('cancel.daterangepicker', function (ev, picker) {
            console.log("cancel event fired");
        });

        $('#options1').click(function () {
            $('#reportrange_right').data('daterangepicker').setOptions(optionSet1, cb);
        });

        $('#options2').click(function () {
            $('#reportrange_right').data('daterangepicker').setOptions(optionSet2, cb);
        });

        $('#destroy').click(function () {
            $('#reportrange_right').data('daterangepicker').remove();
        });
    }

    $scope.filterAttendence = function () {
        var serverData = {
            StartDate: $scope.StartDate,
            EndDate: $scope.EndDate,
            StudentUid: null,
            ForClass: '1',
            Section: 'D'
        }
        var Url = 'Reports/AttendenceReportByFilter';
        var $handler = $ajax.post(Url, JSON.stringify(serverData));
        $handler.done(function (result) {
            if (result != null && result != '') {
                $scope.attendence = result;
                if ($scope.attendence.length > 0)
                    $scope.InitCurrenMonthAttendence();
            }
        })

        $handler.fail(function (e, x) {

        })
    }

    $scope.BindClass = function () {
        $scope.ClassDetail = $local.get('masterdata');
        if ($scope.ClassDetail != null && $scope.ClassDetail != "") {
            $scope.ClassDetail = $scope.ClassDetail.Classes;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    }

    $scope.ClearSearch = function () {
        $('#calendar-monthyearpicker').find('input[type="text"]').val('');
        $('#Class>option:eq(0)').prop('selected', true).attr('selected', 'selected');
        $('#section').prop('selected', true).attr('disabled', 'disabled');
    }

    $scope.BindSection = function (Class) {
        $('#section').prop('disabled', false).removeAttr('disabled');
        var SelectedClass = null;
        if (Class != null && Class != '')
            SelectedClass = Class;
        else SelectedClass = $('#Class option:selected').val();
        $scope.SectionDetail = $rootScope.GetSections(SelectedClass)
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    }

    $scope.GetClassDetail = function () {
        if ($scope.ClassDetailUid == null)
            $scope.ClassDetailUid = $(event.currentTarget).find('option:selected').val();
    }

    $scope.EnableField = function () {
        var $CurrentTagId = $(event.currentTarget).attr('id');
        if ($CurrentTagId == 'calendar-monthyearpicker') {
            $('#date-value').css({ 'border': '1px solid rgb(204, 204, 204)' });
            $('#date-icon').css({ 'border': '1px solid rgb(204, 204, 204)' });
        } else if ($CurrentTagId == 'Class') {
            $('#Class').css({ 'border': '1px solid rgb(204, 204, 204)' });
        } else if ($CurrentTagId == 'section') {
            $('#section').css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $scope.FilterByMonthReport = function () {
        var Error = 0;
        var SelectedDate = $('#calendar-monthyearpicker').find('input[type="text"]').val();
        if (!$rootScope.IsValid(SelectedDate)) {
            $('#calendar-monthyearpicker').find('input[type="text"]').css({ 'border': '1px solid red' });
            $('#calendar-monthyearpicker').find('span').css({ 'border': '1px solid red' });
            Error++;
        }

        if (!$rootScope.IsValid($scope.ClassDetailUid)) {
            $('#Class').css({ 'border': '1px solid red' });
            $('#section').css({ 'border': '1px solid red' });
            Error++;
        }

        if (Error == 0) {
            $rootScope.ShowLoader();
            var SlipttedDate = SelectedDate.split('/');
            var FullDate = SlipttedDate[0] + '/01/' + SlipttedDate[1];
            $scope.ActualDate = new Date(FullDate);
            var Year = $scope.ActualDate.getFullYear();
            var Month = $scope.ActualDate.getMonth();
            var StartDate = new Date(Year, Month).toLocaleDateString();
            var EndDate = new Date(Year, Month + 1, 0).toLocaleDateString();
            var Url = 'Reports/AttendenceReport?FromDate=' + StartDate + '&ToDate=' +
                EndDate + '&ClassDetailId=' + $scope.ClassDetailUid;
            var $handler = $ajax.get(Url, 'json');
            $handler.done(function (result) {
                if (result != null && result != '') {
                    $scope.attendence = result;
                    var date = new Date($scope.ActualDate);
                    var TotalAttr = $scope.attendence[0].AbsentOn;
                    if (TotalAttr != null && TotalAttr.length > 0) {
                        var day = '';
                        var i = 0;
                        $scope.MonthDate = [];
                        $scope.AttendenceData = [];
                        while (i < TotalAttr.length) {
                            $scope.AttendenceData.push(TotalAttr[i]);
                            day = new Date(date.getFullYear(), date.getMonth(), i + 1).toLocaleDateString('en-US', { weekday: 'long' });
                            $scope.MonthDate.push({ date: i + 1, day: day.substr(0, 3) });
                            i++;
                        }
                    }
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                    $('#default-content').hide();
                    $('#tblattedence').fadeIn(500);
                    $('a[name="studentNamePopover"]').popover({
                        html: true,
                        content: function () {
                            return $('#AttendenceDetailContent').html();
                        }
                    });
                    $rootScope.HideLoader();
                    //if ($scope.attendence.length > 0)
                    //    $scope.InitCurrenMonthAttendence();
                } else {
                    $scope.MonthDate = [];
                    $scope.AttendenceData = [];
                    $rootScope.HideLoader();
                    $rootScope.ShowToast('No record found. Please select different month', 10000);
                }
            })

            $handler.fail(function (e, x) {
                $rootScope.HideLoader();
            })
        } else {
            $rootScope.ShowToast('Please correct red color bordered fields.', 10000);
        }
    }

    $scope.InitCurrenMonthAttendence = function () {
        var date = new Date();
        var day = '';
        $scope.RecordInfo = [];
        $scope.MonthLength = $scope.attendence[0].AbsentOn.length;
        for (var i = 1; i <= $scope.MonthLength; i++) {
            day = new Date(date.getFullYear(), date.getMonth(), i).toLocaleDateString('en-US', { weekday: 'long' });
            $scope.rowset.push({ date: i, day: day.substr(0, 3) });
        }

        for (var i = 0; i < $scope.attendence.length; i++) {
            for (var j = 0; j < $scope.MonthLength; j++) {
                if ($scope.attendence[i].AbsentOn[j] == "1")
                    $scope.cellset.push("P");
                else
                    $scope.cellset.push("A");
            }

            $scope.RecordInfo.push({
                'AttendenceDate': $scope.attendence[i].AttendenceDate,
                'AttendenceId': $scope.attendence[i].AttendenceId,
                'StudenName': $scope.attendence[i].StudenName,
                'studentUid': $scope.attendence[i].studentUid,
                'TotalAbsentTillDate': $scope.attendence[i].TotalAbsentTillDate,
                'TotalWorkingDaysTillDate': $scope.attendence[i].TotalWorkingDaysTillDate,
                'AttendenceRecord': $scope.cellset
            });
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();

        $('#default-content').hide();
        $('#tblattedence').fadeIn(500);
    }

    $rootScope.getNewPage = function (pageNo) {
        $('#pageindex').val(pageNo);
        if (pageNo != '' && !$(event.currentTarget).prop('disabled')) {
            waitingDialog.show('Loading ...');
            $scope.PageIndex = pageNo;
            $scope.PageSize = '';
            if ($('#searchstring').val().trim() != '')
                $scope.SearchString = $('#searchstring').val();
            else
                $scope.SearchString = "";
            $scope.SortBy = $('#sortby').val();
            var PadingUrl = 'Reports/AttendenceAllByFilter?SearchString=' + $scope.SearchString + '&SortBy=' + $scope.SortBy +
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
            var PadingUrl = 'Reports/AttendenceAllByFilter?SearchString=' + $scope.SearchString + '&SortBy=' + $scope.SortBy +
                '&PageIndex=' + $scope.PageIndex + '&PageSize=' + $scope.PageSize;
            var $handler = $ajax.get(PadingUrl, 'json');
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
});