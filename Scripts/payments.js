/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.min.js" />
/// <reference path="layout.js" />


app.controller('paymentCtrl', function ($scope, $ajax, $rootScope, $compile, $local) {

    $scope.rowset = [];
    $scope.attendence = null;
    $scope.cellset = [];
    $scope.RecordInfo = [];
    $scope.StartDate = '';
    $scope.EndDate = '';
    $scope.CurrentDate = new Date();
    $scope.selectedSection = null;
    $scope.IsRecord = "0";
    $scope.currentAmount = 0;
    $scope.TotalAmount = 0.0;
    $scope.currentSelectedAmount = 0.0;
    $scope.TotalSumAmount = 0.0;

    $scope.FeesDetailList = [];

    $scope.FeesDetail = {
        ForMonth: 0,
        FeeCode: 0,
        FineCode: 0,
        Amount: 0
    };

    $scope.StudentDetailInfo = {
        ExistingClientUid: '',
        ObjFeesDetail: null
    }

    $scope.IndividualPaymentDetail = {
        PaymentDetailId: "",
        PaymentForMonth: "",
        ForYear: "",
        TxnId: "",
        Statu: "",
        FeeCode: "",
        FineCode: "",
        FineAmount: "",
        Amount: "",
        StatusMessage: "",
        AddedOn: "",
        FullName: "",
        rollno: "",
        registrationNo: "",
        ImageUrl: "",
        feeCode: "",
        Class: "",
        Section: "",
        studentUid: '',
        CurrentData: new Date()
    }


    $scope.MonthName = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    angular.element(document).ready(function () {
        $scope.BindClass();
        $scope.BindInitClassSection();
        $('html').find('.page-init').removeClass('page-init');
    });

    $scope.BindInitClassSection = function () {
        if ($('#Class').find('option').length > 0) {
            var ClassValue = $('#Class option:eq(1)').val();
            if (ClassValue != '') {
                $('#Class option:eq(1)').attr('selected', 'selected').prop('selected', true);
                $scope.BindSection(ClassValue);
                $('#section option:eq(1)').attr('selected', 'selected').prop('selected', true);
                if (!$rootScope.IsValid($scope.selectedSection))
                    $scope.selectedSection = $('#section option:selected').val();
                if ($rootScope.IsValid($scope.selectedSection))
                    $scope.GetPaymentDetail();
            }
        }
    }

    $scope.GoPaymentViewPage = function () {
        $('#paymentoption').empty();
        $('#payment-dv').hide();
        $('#resultlist').fadeIn(500);
    }

    $scope.DoPayment = function () {
        $rootScope.ShowLoader();
        var StudentUid = $scope.IndividualPaymentDetail.studentUid;
        if (StudentUid == null || StudentUid == "")
            StudentUid = $('#studentUid').val();

        var Errors = [];
        if (StudentUid != "" && StudentUid != null)
            $scope.StudentDetailInfo.ExistingClientUid = StudentUid;
        else
            Errors.push('StudentUid');
        if ($scope.FeesDetailList.length > 0)
            $scope.StudentDetailInfo.ObjFeesDetail = $scope.FeesDetailList;
        else {
            alert('Please select atleast one month to proceed for payment')
            Errors.push('No item');
        }

        if (Errors.length == 0) {
            var Url = "Accounts/FeesPayment";
            var $handler = $ajax.post(Url, JSON.stringify({ ObjFeesPaymentDetail: $scope.StudentDetailInfo }));
            $handler.done(function (result) {
                if (result != null && result != "") {
                    if (typeof result == "string")
                        $('#formcollectionData').val(result);
                    else
                        $('#formcollectionData').val(JSON.stringify(result));
                    $('#btnform').click();
                    $rootScope.HideLoader();
                }
            })

            $handler.fail(function () {
                $rootScope.HideLoader();
            })

            //$('#btnform').click();
        } else {
            return false;
        }
    }

    $scope.CalculateAmount = function () {
        var monthno = $(event.currentTarget).closest('div[name="pamentcard"]').find('input[name="monthnumber"]').val();
        if ($(event.currentTarget).hasClass('ng-empty')) {
            var amount = $(event.currentTarget).closest('div').find('input[type="hidden"]').val();
            $scope.currentSelectedAmount = parseFloat(amount);
            var ErrorList = [];
            FeesDetailData = {};
            $scope.TotalAmount = parseFloat($scope.TotalAmount) + parseFloat(amount);
            if (monthno != "") {
                FeesDetailData.ForMonth = parseInt(monthno);
                FeesDetailData.MonthName = $scope.MonthName[monthno];
            } else {
                ErrorList.push('ForMonth');
                FeesDetailData.MonthName = 'NA';
            };

            if ($scope.IndividualPaymentDetail.FeeCode != 0)
                FeesDetailData.FeeCode = $scope.IndividualPaymentDetail.FeeCode;
            else
                ErrorList.push('FeeCode');

            FeesDetailData.FineAmount = parseFloat($scope.IndividualPaymentDetail.FineAmount);
            FeesDetailData.FineCode = $scope.IndividualPaymentDetail.FineCode;

            if ($scope.IndividualPaymentDetail.Amount != 0)
                FeesDetailData.Amount = parseFloat($scope.IndividualPaymentDetail.Amount);
            else
                ErrorList.push('Amount');

            if (ErrorList.length > 0) {
                return null;
            } else {
                $scope.FeesDetailList.push(FeesDetailData);
            }
        } else {
            for (var i = 0; i < $scope.FeesDetailList.length; i++) {
                if ($scope.FeesDetailList[i].ForMonth == parseInt(monthno)) {
                    $scope.FeesDetailList.splice(i, 1);
                    break;
                }
            }
        }

        $scope.TotalSumAmount = 0;
        for (var i = 0; i < $scope.FeesDetailList.length; i++) {
            $scope.TotalSumAmount += $scope.FeesDetailList[i].Amount;
        }

        if ($scope.FeesDetailList.length > 0) {
            $('#paymentmsg').hide();
            $('#paymentsum').fadeIn(500)
        } else {
            $('#paymentsum').hide();
            $('#paymentmsg').fadeIn(500);
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    }

    $scope.GetIndividualPaymentDetail = function () {
        $('#loader').show();
        $('#data-body').show();
        $scope.FeesDetailList = [];
        $rootScope.BlurIn('scrollable-section', 'class');
        $scope.PaidMonths = [];
        var PayeeUid = $(event.currentTarget).closest('td').find('input[name="studentUid"]').val().trim();
        var Url = "Home/GetPartial?PayeeUid=" + PayeeUid + "&View=1";
        var $handler = $ajax.get(Url, 'html');
        $handler.done(function (result) {
            if (result != null && result != "") {
                $scope.Html = result;
                $('#resultlist').hide();
                $('#paymentoption').append($compile($scope.Html)($scope));
                if (typeof PaymentData != "undefined" && PaymentData != "No record found") {
                    if (PaymentData.Table != undefined) {
                        $scope.IndividualPaymentDetail = PaymentData.Table[0];
                        $scope.IndividualPaymentDetail.ImageUrl = '../Uploads/' + $scope.IndividualPaymentDetail.ImageUrl;

                        var item = 0;
                        while (item < PaymentData.Table.length) {
                            //if (PaymentData.Table[item].Status.toLowerCase() == 'success') {
                            if (PaymentData.Table[item].PaymentForMonth != null) {
                                $scope.PaidMonths = $scope.PaidMonths.concat(PaymentData.Table[item].PaymentForMonth.split(','));
                            }
                            //}
                            item++;
                        }
                    }
                }

                var TotalMonths = 12;
                $scope.PaymentMonthlyList = [];
                var colorCode = [
                    { name: $scope.MonthName[0] + ' ' + ($scope.IndividualPaymentDetail.ForYear + 1), monthNumber: 0, color: 'yellowgreen', text: '#fff' },
                    { name: $scope.MonthName[1] + ' ' + ($scope.IndividualPaymentDetail.ForYear + 1), monthNumber: 1, color: 'bisque', text: '#444' },
                    { name: $scope.MonthName[2] + ' ' + ($scope.IndividualPaymentDetail.ForYear + 1), monthNumber: 2, color: 'violet', text: '#fff' },
                    { name: $scope.MonthName[3] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 3, color: 'yellow', text: '#444' },
                    { name: $scope.MonthName[4] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 4, color: 'turquoise', text: '#444' },
                    { name: $scope.MonthName[5] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 5, color: 'tomato', text: '#fff' },
                    { name: $scope.MonthName[6] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 6, color: 'rosybrown', text: '#fff' },
                    { name: $scope.MonthName[7] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 7, color: 'ghostwhite', text: '#444' },
                    { name: $scope.MonthName[8] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 8, color: 'slategrey', text: '#fff' },
                    { name: $scope.MonthName[9] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 9, color: 'khaki', text: '#444' },
                    { name: $scope.MonthName[10] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 10, color: 'steelblue', text: '#fff' },
                    { name: $scope.MonthName[11] + ' ' + $scope.IndividualPaymentDetail.ForYear, monthNumber: 11, color: 'darkseagreen', text: '#fff' }];
                var extraClass = '';
                var index = 0;
                for (var i = 0; i < TotalMonths; i++) {
                    extraClass = '';
                    if (i == 1 || i == 5 || i == 9) {
                        extraClass = 'extra-padding-both';
                    } else if (i == 2 || i == 6 || i == 10) {
                        extraClass = 'extra-padding-right';
                    }

                    index = i + 3;
                    if (index > 11) {
                        index = index - 12;
                    }

                    var PaidMonth = '';
                    if ($scope.PaidMonths.indexOf(index.toString()) != -1)
                        PaidMonth = 'block-dv';
                    $scope.PaymentMonthlyList.push({
                        Sno: i,
                        Month: colorCode[index],
                        Payment: $scope.IndividualPaymentDetail.Amount,
                        FineCode: $scope.IndividualPaymentDetail.FineCode,
                        Status: 'Paid',
                        ClassSection: '5-A',
                        Class: extraClass,
                        PaidMonthClass: PaidMonth
                    });

                    index++;
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                    $scope.$digest();

                $rootScope.BlurOut('scrollable-section', 'class');
                $('#payment-dv').fadeIn(500);
            }
            $('#loader').hide();
        });

        $handler.fail(function (e, x) {
            $('#loader').hide();
            $rootScope.BlurOut('scrollable-section', 'class');
        });
    }

    $scope.GetPaymentDetail = function () {
        $('#loader').show();
        var Url = "Home/PaymentDetail?ClassDetailId=" + $scope.selectedSection;
        var $handler = $ajax.get(Url, 'json');
        $handler.done(function (result) {
            if (typeof result.Table != "undefined") {

                var PaidDate = null;
                var PaymentMonthYear = "";
                var Status = null;
                var AccedemicYear = '';
                $scope.Records = [];
                for (var i = 0; i < result.Table.length; i++) {
                    $scope.IsRecord = "1";
                    PaidDate = null;
                    PaymentMonthYear = "";
                    PaidDate = result.Table[i].AddedOn == null ? "NA" : new Date(result.Table[i].AddedOn).toLocaleDateString('en-Ud', { year: 'numeric', month: 'long', day: 'numeric' });
                    Status = result.Table[i].Status == null ? "NA" : result.Table[i].Status;

                    if (result.Table[i].ForYear == null || result.Table[i].PaymentForMonth == null) {
                        PaymentMonthYear = "NA";
                    } else {
                        var PaymentMonths = result.Table[i].PaymentForMonth.split(',');
                        for (var month = 0; month < PaymentMonths.length; month++) {
                            if (month < 3) {
                                AccedemicYear = (parseInt(result.Table[i].ForYear + 1)).toString();
                            } else {
                                AccedemicYear = result.Table[i].ForYear.toString();
                            }

                            if (month == 0)
                                PaymentMonthYear += $scope.MonthName[parseInt(PaymentMonths[month])] + ", " + AccedemicYear;
                            else
                                PaymentMonthYear += ", " + $scope.MonthName[parseInt(month)] + ", " + AccedemicYear;
                        }
                    }
                    $scope.Records.push({
                        AddedOn: PaidDate,
                        PaymentMonthYear: PaymentMonthYear,
                        FullName: result.Table[i].FullName,
                        Status: Status,
                        registrationNo: result.Table[i].registrationNo,
                        rollno: result.Table[i].rollno,
                        studentUid: result.Table[i].studentUid
                    });
                }
                $('#data-body').fadeIn(500);
            }

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
            $('#loader').hide();
        });

        $handler.fail(function (e, x) {
            $('#loader').hide();
        });
    }

    $scope.BindClass = function () {
        $scope.ClassDetail = $local.get('masterdata');
        if ($scope.ClassDetail != null && $scope.ClassDetail != "") {
            $scope.ClassDetail = $scope.ClassDetail.Classes;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
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

    $scope.FilterByMonthReport = function () {
        $scope.StartMonthName = $scope.MonthName[$scope.StartDate.getMonth()].substr(0, 3);
        $scope.EndMonthName = $scope.MonthName[$scope.EndDate.getMonth()].substr(0, 3);
        var Url = 'Reports/AttendenceReport?FromDate=' + $scope.StartDate.toLocaleString() + '&ToDate=' +
            $scope.EndDate.toLocaleString() + '&ClassDetailId=' + $scope.ClassDetailUid;
        var $handler = $ajax.get(Url, 'json');
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
            });
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();

        $('#default-content').hide();
        $('#tblattedence').fadeIn(500);
    }
});