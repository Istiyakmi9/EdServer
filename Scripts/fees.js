/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.min.js" />
/// <reference path="layout.js" />


app.controller('ViewFeesCtrl', function ($scope, $ajax, $rootScope, $compile, $local) {
    $scope.RecordAvailable = 1;
    $scope.SearchResult = true;
    $scope.DefaultMessage = "Filter";
    $scope.ClassDetail = [];
    $scope.FeesResult = [];
    $scope.CommonFeesModal = {
        SchoolFeeDetailId: '',
        schooltenentId: '',
        Class: '',
        ClassDetailUid: '',
        FineForPayeeUid: '',
        FeeCode: 0,
        Amount: 0,
        IsFeeChanged: false,
        NewAmount: 0,
        AffectedDate: '',
        PaymentDate: 0,
        LastPaymentDate: '',
        LateFineAmount: 0,
        LateFineType: '',
        LateFinePerDayAmount: 0,
        LateFinePerMonthAmount: 0
    }
    $scope.ElapsedTime = 0;

    angular.element(document).ready(function () {
        $scope.BindClass();
        if (typeof Data != "undefined")
            $scope.BindInitialTable(Data);
    });

    $scope.BindInitialTable = function (ResultedData) {
        var IsValidResult = false;
        IsValidResult = $rootScope.IsValidResponse(ResultedData);
        if (IsValidResult) {
            if (Object.keys(ResultedData).length == 2 && Object.keys(ResultedData)[0] == "Table" && Object.keys(ResultedData)[1] == "Table1") {
                $scope.FeesResult = ResultedData.Table;
                $scope.TotalResultCount = ResultedData.Table1[0].Total;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                    $scope.$digest();
            }
        }
        $('#viewfeestimetable-dv').fadeIn();
        return IsValidResult;
    }

    $scope.InitModal = function () {
        $scope.CommonFeesModal.SchoolFeeDetailId = '';
        $scope.CommonFeesModal.schooltenentId = '';
        $scope.CommonFeesModal.Class = '';
        $scope.CommonFeesModal.ClassDetailUid = '';
        $scope.CommonFeesModal.FineForPayeeUid = '';
        $scope.CommonFeesModal.FeeCode = 0;
        $scope.CommonFeesModal.Amount = 0;
        $scope.CommonFeesModal.IsFeeChanged = false;
        $scope.CommonFeesModal.NewAmount = 0;
        $scope.CommonFeesModal.AffectedDate = '';
        $scope.CommonFeesModal.PaymentDate = 0;
        $scope.CommonFeesModal.LastPaymentDate = '';
        $scope.CommonFeesModal.LateFineAmount = 0;
        $scope.CommonFeesModal.LateFineType = '';
        $scope.CommonFeesModal.LateFinePerDayAmount = 0;
        $scope.CommonFeesModal.LateFinePerMonthAmount = 0;
    }
    $scope.BindClass = function () {
        $scope.ClassDetail = $local.get('masterdata');
        if ($scope.ClassDetail != null && $scope.ClassDetail != "") {
            $scope.ClassDetail = $scope.ClassDetail.Classes;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    }

    $scope.Applyaction = function () {
        var LabelValue = $(event.currentTarget).attr('name');
        if (LabelValue != null && LabelValue != '') {
            if (LabelValue == '/Day')
                $('#Finetype').val('perday');
            else if (LabelValue == '/Month')
                $('#Finetype').val('permonth');
            else
                $('#Finetype').val('normal');
            $(event.currentTarget).closest('div').find('span[name="actiontxt"]').text(LabelValue);
        }
    }

    $scope.AddNewFeestructure = function () {
        $scope.InitModal();
        var SelectedClass = $('#class option:selected').val()
        var Amount = $('#amount').val();
        var FineType = $('#Finetype').val();
        var Latefineamount = $('#latefineamount').val();
        var LastDay = $('#lastday option:selected').val();
        var ErrorFlag = 0;

        if (FineType == null || FineType == "") {
            $('#Finetype').css({ 'border': '1px solid red' });
            ErrorFlag++;
        }

        if (LastDay == null || LastDay == "") {
            $('#lastday').css({ 'border': '1px solid red' });
            ErrorFlag++;
        }

        if (Latefineamount == null || Latefineamount == "") {
            $('#latefineamount').css({ 'border': '1px solid red' });
            $('#latefinetype').find('button').css({ 'border': '1px solid red' });
            ErrorFlag++;
        }

        if (SelectedClass == null || SelectedClass == "") {
            $('#class').css({ 'border': '1px solid red' });
            ErrorFlag++;
        }

        if (Amount == null || Amount == "") {
            $('#amount').css({ 'border': '1px solid red' });
            ErrorFlag++;
        }

        if (ErrorFlag == 0) {
            $rootScope.ShowLoader();
            $scope.CommonFeesModal.Class = SelectedClass;
            $scope.CommonFeesModal.Amount = Amount;
            if ($('#CurrentEditFees').val() == $scope.CommonFeesModal.Amount)
                $scope.CommonFeesModal.IsFeeChanged = true;
            else
                $scope.CommonFeesModal.IsFeeChanged = false;
            $scope.CommonFeesModal.LastPaymentDate = LastDay;
            $scope.CommonFeesModal.LateFineType = FineType;
            if (FineType == 'normal') {
                $scope.CommonFeesModal.LateFineAmount = parseFloat(Latefineamount);
                $scope.CommonFeesModal.LateFinePerDayAmount = 0;
                $scope.CommonFeesModal.LateFinePerMonthAmount = 0;
            } else if (FineType == 'perday') {
                $scope.CommonFeesModal.LateFinePerDayAmount = parseFloat(Latefineamount);
                $scope.CommonFeesModal.LateFineAmount = 0;
                $scope.CommonFeesModal.LateFinePerMonthAmount = 0;
            } else if (FineType == 'permonth') {
                $scope.CommonFeesModal.LateFinePerMonthAmount = parseFloat(Latefineamount);
                $scope.CommonFeesModal.LateFineAmount = 0;
                $scope.CommonFeesModal.LateFinePerDayAmount = 0;
            }
            if ($('#CurrentEditSchoolFeeId').val() != '')
                $scope.CommonFeesModal.SchoolFeeDetailId = $('#CurrentEditSchoolFeeId').val();
            else
                $scope.CommonFeesModal.SchoolFeeDetailId = '';
            var $AjaxHandler = $ajax.post("Accounts/AddEditFees", JSON.stringify({ ObjCommonFeesModal: $scope.CommonFeesModal }));
            $AjaxHandler.done(function (result) {
                var IsValidResult = $scope.BindInitialTable(result);
                if (!IsValidResult) {
                    $rootScope.ShowMessage('Unable to insert record. Please contact to your admin.', null);
                } else {
                    $scope.ClearFields();
                }
                $rootScope.HideLoader(true);
            });

            $AjaxHandler.fail(function (error) {
                $scope.ClearFields();
                $rootScope.HideLoader(true);
                $rootScope.ShowMessage('Unable to insert record. Please contact to your admin.', null);
            });
        } else {
            $rootScope.HideLoader();
            $scope.ClearFields();
        }
    }

    $scope.ClearFields = function () {
        $('#Finetype').val('normal');
        $('#lastday').prop('selectedIndex', 0);
        $('#latefineamount').val('');
        $('#latefinetype').find('span[name="actiontxt"]').text('Fine');
        $('#class').prop('selectedIndex', 0);
        $('#amount').val('');
    }

    $scope.EnableField = function () {
        var TagId = $(event.currentTarget).attr('id');
        if (TagId == 'Finetype') {
            $('#Finetype').css({ 'border': "1px solid rgb(204, 204, 204)" });
        } else if (TagId == "lastday") {
            $('#lastday').css({ 'border': "1px solid rgb(204, 204, 204)" });
        } else if (TagId == "latefineamount" | TagId == "latefinetype") {
            $('#latefineamount').css({ 'border': "1px solid rgb(204, 204, 204)" });
            $('#latefinetype').find('button').css({ 'border': "1px solid rgb(204, 204, 204)" });
        } else if (TagId == "class") {
            $('#class').css({ 'border': "1px solid rgb(204, 204, 204)" });
        } else if (TagId == "amount") {
            $('#amount').css({ 'border': "1px solid rgb(204, 204, 204)" });
        }
    }

    $scope.EditCurrentRecord = function () {
        var $Target = $(event.currentTarget).closest('div[name="table"]');
        if ($Target != null) {
            $scope.InitModal();
            var Class = $Target.find('div[name="class"]').attr('value');
            if (Class != null)
                $('#class').val(Class);
            //var FeeCode = $Target.find('div[name="feecode"]').attr('value');
            var Amount = $Target.find('div[name="amount"]').attr('value');
            if (Amount != null) {
                $('#amount').val(Amount);
                $('#CurrentEditFees').val(Amount);
            }
            var LastPaymentDate = $Target.find('div[name="lastpaymentdate"]').attr('value');
            if (LastPaymentDate != null)
                $('#lastday').val(LastPaymentDate);
            var SchoolFeeDetailid = $Target.find('input[name="schoolfeedetailid"]').val();
            var LateFineAmount = $Target.find('input[name="latefineamount"]').val();
            if (LateFineAmount != null)
                $('#latefineamount').val(LateFineAmount);
            var Latefinetype = $Target.find('input[name="latefinetype"]').val();
            if (Latefinetype != null) {
                $('#Finetype').val(Latefinetype);
                if (Latefinetype == 'perday')
                    $('#latefinetype').find('span[name="actiontxt"]').text('/Day');
                else if (Latefinetype == 'permonth')
                    $('#latefinetype').find('span[name="actiontxt"]').text('/Month');
                else
                    $('#latefinetype').find('span[name="actiontxt"]').text('Fine');
            }

            if (SchoolFeeDetailid != null && SchoolFeeDetailid != '')
                $('#CurrentEditSchoolFeeId').val(SchoolFeeDetailid);
        }
    }

    $scope.FilterRecord = function () {
        var SearchString = '';
        var FilteredClassed = $('#filterclass option:selected').val();
        if (FilteredClassed != null && FilteredClassed != '')
            SearchString = '';
    }
}).filter('GetMonthPrefix', function () {
    return function (data) {
        var Suffix = '';
        var ParseDate = 0;
        try {
            if (data.indexOf('week') == -1) {
                ParseDate = parseInt(data)
                if (ParseDate % 10 == 1)
                    Suffix = 'st';
                else if (ParseDate % 10 == 2)
                    Suffix = 'nd'
                else if (ParseDate % 10 == 3)
                    Suffix = 'rd'
                else
                    Suffix = 'th'
            } else {
                Suffix = '';
            }
        } catch (e) {
            Suffix = '';
        }
        return data + Suffix;
    }
});