/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.js" />
/// <reference path="layout.js" />

app.controller('QuickRegistration', function ($scope, $compile, $ajax, $rootScope) {

    $scope.student = {
        StudentUid: null,
        SchooltenentId: null,
        ParentDetailId: null,
        FirstName: null,
        LastName: null,
        ImageUrl: '../images/picture.png',
        Dob: new Date(-1),
        Age: 0,
        Sex: true,
        PSAddress: null,
        CurrentSchoolMedium: null,
        PSMedium: null,
        LastSchoolName: null,
        Rollno: -1,
        Mobilenumber: null,
        AlternetNumber: null,
        EmailId: null,
        RegistrationNo: null,
        AdmissionDatetime: null,
        FeeCode: -1,
        MotherTongue: null,
        Religion: null,
        Category: null,
        CategoryDocPath: null,
        SiblingRegistrationNo: null,
        FatherFirstName: null,
        FatherLastName: null,
        MotherFirstname: null,
        MotherLastname: null,
        LocalGuardianFullName: null,
        Fathermobileno: null,
        Mothermobileno: null,
        LocalGuardianMobileno: null,
        Address: null,
        City: null,
        Pincode: '-1',
        State: null,
        Fatheremailid: null,
        Motheremailid: null,
        LocalGuardianemailid: null,
        Fatheroccupation: null,
        Motheroccupation: null,
        Fatherqualification: null,
        Motherqualification: null,
        LastClass: null,
        Class: null,
        Section: null,
        ExistingNumber: null,
        CreatedBy: null,
        ParentRecordExist: true,
        ClassDetailId: null,
        siblings: null,
        MobileNumbers: null,
        EmailIds: null
    };
    $scope.Staffs = {
        FirstName: '',
        LastName: '',
        MobileNumber: '',
        AdminId: ''
    }
    $scope.fatherName = '';
    $scope.motherName = '';
    $scope.ImageUrl = '../images/picture.png';

    $scope.getImage = function () {
        $('#profileImage').click();
    }

    angular.element(document).ready(function () {
        console.log('QuickRegistration started');
        $("#profileImage").change(function () {
            $scope.readURL(this);
        });
    });

    $scope.readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#profileImgUrl').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $scope.registerNow = function () {

        var ErrorArrary = [];
        var tab = $('#myTab1').find('li.active').attr('name');
        if (tab == 'student') {
            if ($scope.student.ParentRecordExist) {
                if (typeof $scope.student.ExistingNumber == 'undefined' || $scope.student.ExistingNumber == '' || $scope.student.ExistingNumber == null) {
                    if ($('#ExistingNumber').val().trim() == '')
                        ErrorArrary.push('ExistingNumber');
                    else
                        $scope.student.ExistingNumber = $scope.student.ExistingNumber.replace(/-/g, '');
                } else {
                    $scope.student.ExistingNumber = $scope.student.ExistingNumber.replace(/-/g, '');
                    $scope.student.Fathermobileno = $scope.student.ExistingNumber;
                    $scope.student.FatherFirstName = "New User";
                }
            } else {
                if ($scope.fatherName != null && $scope.fatherName != '') {
                    if ($scope.fatherName.split(' ').length > 1) {
                        $scope.student.FatherFirstName = $scope.fatherName.split(' ')[0];
                        $scope.student.FatherLastName = $scope.fatherName.substr($scope.fatherName.indexOf(' ')).trim();
                    } else {
                        $scope.student.FatherFirstName = $scope.fatherName
                    }
                } else {
                    ErrorArrary.push('fathername');
                }

                if (typeof $scope.student.Fathermobileno == 'undefined' || $scope.student.Fathermobileno == null || $scope.student.Fathermobileno == '')
                    ErrorArrary.push('Fathermobileno');
                else
                    $scope.student.Fathermobileno = $scope.student.Fathermobileno.replace(/-/g, '');
            }


            if (typeof $scope.student.FirstName == 'undefined' || $scope.student.FirstName == null || $scope.student.FirstName == '')
                ErrorArrary.push('studentfirstname');

            if (typeof $scope.student.LastName == 'undefined' || $scope.student.LastName == null || $scope.student.LastName == '')
                ErrorArrary.push('studentlastname');

            if (typeof $scope.student.Mobilenumber == 'undefined' || $scope.student.Mobilenumber == '' || $scope.student.Mobilenumber == null)
                ErrorArrary.push('studentmobile');
            else
                $scope.student.Mobilenumber = $scope.student.Mobilenumber.replace(/-/g, '');

            if (ErrorArrary.length > 0) {
                for (var i = 0; i < ErrorArrary.length; i++) {
                    $('#' + ErrorArrary[i]).css({ 'border': '1px solid red' });
                }
                $('html, body').animate({ scrollTop: $("#studentRegistration").offset().top }, 300);
            } else {
                $scope.registerStudent();
            }

        } else if (tab == 'faculty') {
            if ($scope.ValidateStaffModal('Faculty')) {
                $scope.registerFaculty();
            }
        } else if (tab == 'driver') {
            if ($scope.ValidateStaffModal('Staff')) {
                $scope.registerOtherStaff();
            }
        }
    }

    $scope.ValidateStaffModal = function (Prefix) {
        var Flag = false;
        var Errors = [];
        if ($scope.Staffs.FirstName == '')
            Errors.push('FirstName');
        if ($scope.Staffs.LastName == '')
            Errors.push('LastName');
        if ($scope.Staffs.MobileNumber == '') {
            Errors.push('MobileNumber');
        } else {
            $scope.Staffs.MobileNumber = $scope.Staffs.MobileNumber.replace(/-/g, '');
        }

        if (Errors.length > 0) {
            for (var i = 0; i < Errors.length; i++) {
                $('#' + Prefix + Errors[i]).css({ 'border': '1px solid red' });
            }
        } else {
            Flag = true;
        }

        return Flag;
    }

    $scope.activetab = function () {
        $scope.student.ExistingNumber = '';
        $scope.Staffs.MobileNumber = '';
        $scope.student.Mobilenumber = '';
        var tabname = $(event.currentTarget).attr('name');
        $('div[name="quick-tabs"]').removeClass('in').hide();
        $('#' + tabname).addClass('in').fadeIn(600);
    }

    $scope.selectUser = function () {
        var mobile = $(event.currentTarget).find('span[name="mobile"]').text().trim();
        var name = $(event.currentTarget).find('span[name="fullname"]').text().trim();
        var userId = $(event.currentTarget).find('input[type="hidden"]').val().trim();
        $scope.student.ExistingNumber = mobile;
        $scope.student.ParentDetailId = userId;
        $('#ExistingNumber').val(name + " [" + mobile + "]");
        $scope.student.ParentRecordExist = true;
        //$('#existingNumber').val(mobile);
        $('#ddlfilter').hide();
    }

    $scope.findParent = function () {
        var input = $(event.currentTarget).val().replace(/-/g, '').length;
        if (input >= 3) {
            $scope.parentList = [];
            var handler = $ajax.get('Registration/GetParentInfo?MobileNumber=' + $(event.currentTarget).val().replace(/-/g, ''), 'json');
            handler.done(function (result) {
                if (result != null && result.Table != undefined) {
                    for (var i = 0; i < result.Table.length; i++) {
                        $scope.parentList.push(result.Table[i]);
                    }

                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();

                    $('#ddlfilter').show();
                }
            });

            handler.fail(function (e, x) {
                console.log('fail');
            });
        }
    }

    $scope.EnableField = function () {
        var Mobile = $(event.currentTarget).val().replace(/-/g, '');
        if (Mobile.length == 10) {
            $(event.currentTarget).css({ 'border': ' 1px solid rgb(204, 204, 204)' });
        }
    }

    $scope.gotoStudentViewPage = function () {
        var tab = $('#myTab1').find('li.active').attr('name');
        if (tab == 'student') {
            location.href = $rootScope.Baseurl + 'Reports/Student';
        } else if (tab == 'faculty' || tab == 'driver') {
            location.href = $rootScope.Baseurl + 'Reports/Faculty';
        }
    }

    $scope.enablenew = function () {
        $scope.isGurdianEnabled = true;
        $('#perent-existing-dv').css({ 'display': 'none' });
        if ($('#new_parentdetail').css('display') == 'none')
            $('#new_parentdetail').fadeIn(500);
        else
            $('#new_parentdetail').css({ 'display': 'none' });

        $scope.student.ExistingNumber = '';
        $scope.fatherName = '';
        $scope.student.Fathermobileno = '';
        $scope.student.ParentRecordExist = false;
    }

    $scope.enableexisting = function () {
        $scope.isGurdianEnabled = true;
        $('#new_parentdetail').css({ 'display': 'none' });
        $('#perent-existing-dv').fadeIn(500);

        $scope.fatherName = '';
        $scope.student.Fathermobileno = '';
        $scope.motherName = '';
        $scope.student.ParentRecordExist = true;
    }

    $scope.AddNumberEmailCheck = function () {
        var MobileNumbers = '';
        if ($rootScope.CheckValid($scope.student.Fathermobileno)) {
            MobileNumbers += $scope.student.Fathermobileno;
        }

        if ($rootScope.CheckValid($scope.Staffs.MobileNumber)) {
            if (MobileNumbers == "")
                MobileNumbers += $scope.Staffs.MobileNumber;
            else
                MobileNumbers += "," + $scope.Staffs.MobileNumber;
        }

        if ($rootScope.CheckValid($scope.student.Mobilenumber)) {
            if (MobileNumbers == "")
                MobileNumbers += $scope.student.Mobilenumber;
            else
                MobileNumbers += "," + $scope.student.Mobilenumber;
        }

        $scope.student.MobileNumbers = MobileNumbers;
        $scope.student.EmailIds = '';
    }

    $scope.registerStudent = function () {

        var fileUpload = $('#profileImage').get(0);
        var files = fileUpload.files;

        // Create FormData object  
        var fileData = new FormData();

        // Looping over all files and add it to FormData object  
        if (files != undefined) {
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            }
        }

        $scope.AddNumberEmailCheck();

        $scope.student.RegistrationNo = 'ED' + (new Date()).getTime().toString();
        $scope.student.AdmissionDatetime = new Date();

        fileData.append('studentFormObject', JSON.stringify($scope.student));
        $scope.MakeAjaxCall(fileData);
    }

    $scope.registerFaculty = function () {

        var fileUpload = $('#profileImage').get(0);
        var files = fileUpload.files;

        // Create FormData object  
        var fileData = new FormData();
        $scope.AddNumberEmailCheck();

        // Looping over all files and add it to FormData object  
        if (files != undefined) {
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            }
        }

        $scope.student.ParentRecordExist = false;
        // Adding one more key to FormData object  
        fileData.append('facultyFormObject', JSON.stringify($scope.Staffs));
        $scope.MakeAjaxCall(fileData);
    }

    $scope.registerOtherStaff = function () {

        var fileUpload = $('#profileImage').get(0);
        var files = fileUpload.files;

        // Create FormData object  
        var fileData = new FormData();

        // Looping over all files and add it to FormData object  
        if (files != undefined) {
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            }
        }

        $scope.student.ParentRecordExist = false;
        $scope.AddNumberEmailCheck();

        // Adding one more key to FormData object  
        fileData.append('otherStaffFormObject', JSON.stringify($scope.Staffs));
        $scope.MakeAjaxCall(fileData);
    }

    $scope.MakeAjaxCall = function (fileData) {
        waitingDialog.show('Wait... Trying to insert your record.')
        var tab = $('#myTab1').find('li.active').attr('name');
        if (fileData != undefined && fileData != null && fileData != "") {
            $.ajax({
                url: '../QuickRegistration/QuickRegisterStudent',
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    waitingDialog.hide();
                    if (result.EmailMobileExists != undefined && result.EmailMobileExists != null) {
                        var ObjCheck = JSON.parse(result.EmailMobileExists)
                        var ErrorMessage = '';
                        var MobileNumbers = '';
                        if (ObjCheck.mobile.length > 0) {
                            if (tab == 'student') {
                                var i = 0;
                                while (i < ObjCheck.mobile.length) {
                                    if ($('#ExistingNumber').val() == ObjCheck.mobile[i]) {
                                        $('#ExistingNumber').css({ 'border': '1px solid red' });
                                    } else if ($('#Fathermobileno').val() == ObjCheck.mobile[i]) {
                                        $('#Fathermobileno').css({ 'border': '1px solid red' });
                                        if (MobileNumbers == '')
                                            MobileNumbers = ObjCheck.mobile[i];
                                        else
                                            MobileNumbers += ', ' + ObjCheck.mobile[i];
                                    } else if ($('#studentmobile').val() == ObjCheck.mobile[i]) {
                                        $('#studentmobile').css({ 'border': '1px solid red' });
                                        if (MobileNumbers == '')
                                            MobileNumbers = ObjCheck.mobile[i];
                                        else
                                            MobileNumbers += ', ' + ObjCheck.mobile[i];
                                    }
                                    i++;
                                }
                            }

                            if (tab == 'faculty') {
                                var i = 0;
                                while (i < ObjCheck.mobile.length) {
                                    MobileNumbers = ObjCheck.mobile[i];
                                    if ($('#FacultyMobileNumber').val() == ObjCheck.mobile[i])
                                        $('#FacultyMobileNumber').css({ 'border': '1px solid red' });
                                    i++;
                                }
                            }

                            if (tab == 'driver') {
                                var i = 0;
                                while (i < ObjCheck.mobile.length) {
                                    MobileNumbers = ObjCheck.mobile[i];
                                    if ($('#StaffMobileNumber').val() == ObjCheck.mobile[i])
                                        $('#StaffMobileNumber').css({ 'border': '1px solid red' });
                                    i++;
                                }
                            }
                        }

                        if (ObjCheck.email.length > 0) {
                            if (tab == 'student') {

                            }
                        }

                        ErrorMessage = 'Following mobile no already exists : [' + MobileNumbers + ']';
                        $('#btnlayoutOk').hide();
                        $('#ppmsg').text(ErrorMessage);
                        $('#ppalert').modal('show');
                    } else {
                        if (result != null && result != "") {
                            $('#regmsg').text(result);
                            $('textarea').val('');
                            $('input').val('');
                            $('select').val(-1);
                            $('#profileImgUrl').attr('src', '../images/picture.png');
                            $('#btnClose').hide();
                            $('#btnOk').show();
                        } else {
                            $('#btnOk').hide();
                            $('#btnClose').show();
                            $('#regmsg').text('Error encountered from server. Please try to resolve following error or else contact your admin.');
                            $('#errormsg').text('Error: ' + result);
                        }
                        $('#quickpopup').modal('show');
                    }
                },
                error: function (err) {
                    waitingDialog.hide();
                    $scope.regmsg = err.statusText;
                    $('#btnOk').hide();
                    $('#btnClose').show();
                    $('#regmsg').text('Unknown error.');
                    $('#quickpopup').modal('show');
                }
            });
        }
    }
});