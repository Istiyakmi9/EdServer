/// <reference path="angular.js" />
/// <reference path="layout.js" />

var intelidiv = '<div class="filterdd" style="{{ddlstyle}}"></div>';

app.controller('studentRegistration', function ($scope, $compile, $ajax, $rootScope, $local) {

    $scope.getImage = function () {
        $('#profileImage').click();
    }

    $scope.gurdain = false;
    $scope.isGurdianEnabled = false;
    $scope.parentList = [];
    $scope.SiblingDetail = [];
    $scope.ImageUrl = '../images/picture.png';
    $scope.studForm = {
        StudentUid: '',
        SchooltenentId: '',
        ParentDetailId: '',
        FirstName: '',
        LastName: '',
        ImageUrl: '../images/picture.png',
        Dob: '',
        Age: '',
        Sex: '',
        PSAddress: '',
        CurrentSchoolMedium: '',
        PSMedium: '',
        LastSchoolName: '',
        Rollno: '',
        Mobilenumber: '',
        AlternetNumber: '',
        EmailId: '',
        RegistrationNo: '',
        AdmissionDatetime: '',
        FeeCode: '',
        MotherTongue: '',
        Religion: '',
        Category: '',
        CategoryDocPath: '',
        SiblingRegistrationNo: '',
        FatherFirstName: '',
        FatherLastName: '',
        MotherFirstname: '',
        MotherLastname: '',
        LocalGuardianFullName: '',
        Fathermobileno: '',
        Mothermobileno: '',
        LocalGuardianMobileno: '',
        Address: '',
        City: '',
        Pincode: '',
        State: '',
        Fatheremailid: '',
        Motheremailid: '',
        LocalGuardianemailid: '',
        Fatheroccupation: '',
        Motheroccupation: '',
        Fatherqualification: '',
        Motherqualification: '',
        LastClass: '',
        Class: '',
        Section: '',
        ExistingNumber: '',
        CreatedBy: '',
        ParentRecordExist: '',
        ClassDetailId: '',
        MobileNumbers: '',
        EmailIds: '',
        siblings: ''
    };
    $scope.ParentDetail = {};
    $scope.IsUpdating = false;
    $scope.male = false;
    $scope.female = false;
    $scope.confirmed = false;
    $scope.RedirectionUrl = '';
    $scope.IsRedirected = false;
    $scope.languages = ['Hindi', 'Urdu', 'English', 'Bangali', 'Bhojpuri', 'Bihari'];
    $scope.Occupation = ['Business Man', 'Doctor', 'Engineer', 'Government Emp.', 'Teacher', 'Other'];
    $scope.Qualification = ["Graduate", 'B.Tech', 'PHD', 'Matriculation', 'Intermediate'];

    angular.element(document).ready(function () {
        console.log('Registration started');
        $("#profileImage").change(function () {
            $scope.readURL(this);
        });
        if (StudentData != undefined && StudentData != null && typeof StudentData.Table != "undefined") {
            $scope.PageData = StudentData.Table[0];
            if ($scope.PageData.SiblingRegistrationNo == null || $scope.PageData.SiblingRegistrationNo == '')
                $scope.addsibling();
            $scope.IsUpdating = true;
            $scope.BindStudent();
        } else {
            $scope.addsibling();
            $('#parentInfoSelection').fadeIn(500);
        }
        $scope.BindClass();
        $('#profileImgUrl-demo').hide();
        $('#profileImgUrl').show();
        $rootScope.RemovePageInit();
    });

    $scope.BindStudent = function () {
        $scope.studForm.StudentUid = $scope.PageData.studentUid;
        $scope.studForm.SchooltenentId = $scope.PageData.schooltenentId;
        $scope.studForm.ParentDetailId = $scope.PageData.ParentDetailId;
        $scope.studForm.FirstName = $scope.PageData.FirstName;
        $scope.studForm.LastName = $scope.PageData.LastName;
        if ($scope.PageData.ImageUrl == null || $scope.PageData.ImageUrl.trim() == '' || $scope.PageData.ImageUrl.indexOf('picture.png') != -1)
            $scope.studForm.ImageUrl = '../images/picture.png';
        else
            $scope.studForm.ImageUrl = '../Uploads/Doc_' + $scope.PageData.studentUid + "/" + $scope.PageData.ImageUrl;
        $scope.studForm.Dob = $rootScope.FormateToDateTime($scope.PageData.Dob);
        $scope.studForm.Age = $scope.PageData.age;
        $scope.studForm.Sex = $scope.PageData.sex;
        $scope.studForm.PSAddress = $scope.PageData.PSAddress;
        $scope.studForm.CurrentSchoolMedium = $scope.PageData.CurrentSchoolMedium;
        $scope.studForm.PSMedium = $scope.PageData.PSMedium;
        $scope.studForm.LastSchoolName = $scope.PageData.LastSchoolName;
        $scope.studForm.Rollno = $scope.PageData.rollno;
        $scope.studForm.Mobilenumber = $scope.PageData.mobilenumber;
        if ($rootScope.CheckValid($scope.PageData.mobilenumber)) {
            $rootScope.Disable('Mobilenumber', null);
        }
        $scope.studForm.AlternetNumber = $scope.PageData.alternetNumber;
        $scope.studForm.EmailId = $scope.PageData.emailId;
        if ($rootScope.CheckValid($scope.PageData.emailId)) {
            $rootScope.Disable('EmailId', null);
        }
        $scope.studForm.RegistrationNo = $scope.PageData.registrationNo;
        $scope.studForm.AdmissionDatetime = $scope.PageData.admissionDatetime;
        $scope.studForm.FeeCode = $scope.PageData.feeCode;
        $scope.studForm.MotherTongue = $scope.PageData.MotherTongue;
        $scope.studForm.Religion = $scope.PageData.Religion;
        $scope.studForm.Category = $scope.PageData.Category;
        $scope.studForm.CategoryDocPath = $scope.PageData.CategoryDocPath;
        $scope.studForm.SiblingRegistrationNo = $scope.PageData.SiblingRegistrationNo;
        $scope.studForm.FatherFirstName = $scope.PageData.FatherFirstName;
        $scope.studForm.FatherLastName = $scope.PageData.FatherLastName;
        $scope.studForm.MotherFirstname = $scope.PageData.MotherFirstName;
        $scope.studForm.MotherLastname = $scope.PageData.MotherLastName;
        $scope.studForm.LocalGuardianFullName = $scope.PageData.LocalGuardianFullName;
        $scope.studForm.Fathermobileno = $scope.PageData.FatherMobileno;
        if ($rootScope.CheckValid($scope.PageData.FatherMobileno)) {
            $rootScope.Disable('Fathermobileno', null);
        }
        $scope.studForm.Mothermobileno = $scope.PageData.MotherMobileno;
        if ($rootScope.CheckValid($scope.PageData.MotherMobileno)) {
            $rootScope.Disable('Mothermobileno', null);
        }

        if ($rootScope.CheckValid($scope.PageData.FatherFirstName))
            $scope.FatherFullName = $scope.PageData.FatherFirstName;
        if ($rootScope.CheckValid($scope.PageData.FatherLastName))
            $scope.FatherFullName += " " + $scope.PageData.FatherLastName;

        if ($rootScope.CheckValid($scope.PageData.MotherFirstName))
            $scope.MotherFullName = $scope.PageData.MotherFirstName;
        if ($rootScope.CheckValid($scope.PageData.MotherLastName))
            $scope.MotherFullName += " " + $scope.PageData.MotherLastName;

        $scope.studForm.LocalGuardianMobileno = $scope.PageData.LocalGuardianMobileno;
        if ($rootScope.CheckValid($scope.PageData.LocalGuardianMobileno)) {
            $rootScope.Disable('Gurdainnumber', null);
        }
        $scope.studForm.Address = $scope.PageData.FullAddress;
        $scope.studForm.City = $scope.PageData.City;
        $scope.studForm.Pincode = $scope.PageData.Pincode;
        $scope.studForm.State = $scope.PageData.State;
        $scope.studForm.Fatheremailid = $scope.PageData.Fatheremailid;
        if ($rootScope.CheckValid($scope.PageData.Fatheremailid)) {
            $rootScope.Disable('Fatheremailid', null);
        }
        $scope.studForm.Motheremailid = $scope.PageData.Motheremailid;
        if ($rootScope.CheckValid($scope.PageData.Motheremailid)) {
            $rootScope.Disable('Motheremailid', null);
        }
        $scope.studForm.LocalGuardianemailid = $scope.PageData.LocalGuardianemailid;
        if ($rootScope.CheckValid($scope.PageData.LocalGuardianemailid)) {
            $rootScope.Disable('Gurdainemailid', null);
        }
        $scope.studForm.Fatheroccupation = $scope.PageData.FatherOccupation;
        $scope.studForm.Motheroccupation = $scope.PageData.MotherOccupation;
        $scope.studForm.Fatherqualification = $scope.PageData.FatherQualification;
        $scope.studForm.Motherqualification = $scope.PageData.MotherQualification;
        $scope.studForm.LastClass = $scope.PageData.LastClass;
        $scope.studForm.Class = $scope.PageData.Class;
        $scope.studForm.Section = $scope.PageData.Section;
        $scope.BindSection($scope.studForm.Class);
        $scope.studForm.ClassDetailId = $scope.PageData.ClassDetailId;
        if ($scope.PageData.ClassDetailId != null && $scope.PageData.ClassDetailId != '')
            $('#section option[value="' + $scope.PageData.ClassDetailId + '"]').prop('selected', true).attr('selected', 'selected')
        $scope.studForm.ParentRecordExist = true;
        $scope.enableexistingDefault();

        if ($scope.studForm.Sex == 1) {
            $('#genderM').prop('checked', true).attr('checked', 'checked');
            $('#genderF').prop('checked', false).removeAttr('checked');
        } else {
            $('#genderF').prop('checked', true).attr('checked', 'checked');
            $('#genderM').prop('checked', false).removeAttr('checked');
        }

        if ($scope.PageData.SiblingRegistrationNo != null)
            $scope.siblings = $scope.PageData.SiblingRegistrationNo.split(',');
        else
            $scope.siblings = '';

        var registrationIds = '';
        if ($scope.siblings != '') {
            for (var reg = 0; reg < $scope.siblings.length; reg++) {
                if (reg == 0)
                    registrationIds = "'" + $scope.siblings[reg] + "'";
                else
                    registrationIds += ",'" + $scope.siblings[reg] + "'";
            }
        }

        if ($scope.siblings != null && $scope.siblings.length > 0 && registrationIds != '') {
            var handler = $ajax.get('Registration/GetStudentList?RegistrationNo=' + registrationIds +
                '&CompleteReg=' + true, 'json');
            handler.done(function (result) {
                if (result != null && result != '') {
                    var siblings = JSON.parse(result);
                    for (var rows = 0; rows < siblings.length; rows++) {
                        if (siblings.length > 0) {
                            var divId = $scope.addsibling();
                            $('#' + divId).find('input[name="existingStudentRegno"]').val(siblings[rows].registrationNo);
                            $('#' + divId).find('input[name="sblingname"]').val(siblings[rows].FullName)
                            $('#' + divId).find('input[name="existingStudentUid"]').val(siblings[rows].studentUid)
                        }
                    }
                }
            });

            handler.fail(function (e, x) {
                console.log('fail');
            });
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
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
        var SelectedClass = null;
        if (Class != null && Class != '')
            SelectedClass = Class;
        else SelectedClass = $('#Class option:selected').val();
        $scope.SectionDetail = $rootScope.GetSections(SelectedClass)
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    }

    //$scope.BindClass1 = function () {
    //    $scope.classDetail = [];
    //    var handler = $ajax.get('Registration/ListClasses', 'json');
    //    var IsExists = false;
    //    handler.done(function (result) {
    //        if (result != null && result != "") {
    //            var classRecord = JSON.parse(result);
    //            for (var i = 0; i < classRecord.length; i++) {
    //                if ($scope.classDetail.length > 0) {
    //                    IsExists = false;
    //                    for (var j = 0; j < $scope.classDetail.length; j++) {
    //                        if ($scope.classDetail[j].Class == classRecord[i].Class) {
    //                            IsExists = true;
    //                            var SectionArray = $scope.classDetail[j].Sections;
    //                            SectionArray.push({
    //                                section: classRecord[i].Section,
    //                                ClassDetailId: classRecord[i].ClassDetailId
    //                            });
    //                            $scope.classDetail[j].Sections = SectionArray;
    //                        }
    //                    }

    //                    if (!IsExists) {
    //                        $scope.classDetail.push({
    //                            Class: classRecord[i].Class,
    //                            Sections: new Array({
    //                                section: classRecord[i].Section,
    //                                ClassDetailId: classRecord[i].ClassDetailId
    //                            })
    //                        });
    //                    }
    //                } else {
    //                    $scope.classDetail.push({
    //                        Class: classRecord[i].Class,
    //                        Sections: new Array({
    //                            section: classRecord[i].Section,
    //                            ClassDetailId: classRecord[i].ClassDetailId
    //                        })
    //                    });
    //                }
    //            }

    //            if ($scope.PageData != null && $scope.PageData != '') {
    //                $scope.BindStudent();
    //                $scope.BindSection($scope.PageData.Class);
    //                $('#section').find('option[value="' + $scope.studForm.ClassDetailId + '"]').attr('selected', 'selected');
    //            }
    //        }

    //        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
    //            $scope.$digest();
    //    });

    //    handler.fail(function (e, x) {
    //        console.log('fail');
    //    });
    //}

    $scope.BindSectionValue = function () {
        if ($('#section option:selected').val() != '') {
            $('#section').css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $scope.readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#profileImgUrl').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $scope.EmptyForm = function () {
        $scope.studForm.StudentUid = '';
        $scope.studForm.SchooltenentId = '';
        $scope.studForm.ParentDetailId = '';
        $scope.studForm.FirstName = '';
        $scope.studForm.LastName = '';
        $scope.studForm.ImageUrl = '';
        $scope.studForm.Dob = '';
        $scope.studForm.Age = '';
        $scope.studForm.Sex = '';
        $scope.studForm.PSAddress = '';
        $scope.studForm.CurrentSchoolMedium = '';
        $scope.studForm.PSMedium = '';
        $scope.studForm.LastSchoolName = '';
        $scope.studForm.Rollno = '';
        $scope.studForm.Mobilenumber = '';
        $scope.studForm.AlternetNumber = '';
        $scope.studForm.EmailId = '';
        $scope.studForm.RegistrationNo = '';
        $scope.studForm.AdmissionDatetime = '';
        $scope.studForm.FeeCode = '';
        $scope.studForm.MotherTongue = '';
        $scope.studForm.Religion = '';
        $scope.studForm.Category = '';
        $scope.studForm.CategoryDocPath = '';
        $scope.studForm.SiblingRegistrationNo = '';
        $scope.studForm.FatherFirstName = '';
        $scope.studForm.FatherLastName = '';
        $scope.studForm.MotherFirstname = '';
        $scope.studForm.MotherLastname = '';
        $scope.studForm.LocalGuardianFullName = '';
        $scope.studForm.Fathermobileno = '';
        $scope.studForm.Mothermobileno = '';
        $scope.studForm.LocalGuardianMobileno = '';
        $scope.studForm.Address = '';
        $scope.studForm.City = '';
        $scope.studForm.Pincode = '';
        $scope.studForm.State = '';
        $scope.studForm.Fatheremailid = '';
        $scope.studForm.Motheremailid = '';
        $scope.studForm.LocalGuardianemailid = '';
        $scope.studForm.Fatheroccupation = '';
        $scope.studForm.Motheroccupation = '';
        $scope.studForm.Fatherqualification = '';
        $scope.studForm.Motherqualification = '';
        $scope.studForm.LastClass = '';
        $scope.studForm.Class = '';
        $scope.studForm.Section = '';
        $scope.studForm.ExistingNumber = '';
        $scope.studForm.CreatedBy = '';
        $scope.studForm.ParentRecordExist = '';
        $scope.studForm.ClassDetailId = '';
        $scope.studForm.siblings = '';
    }

    $scope.registerNow = function () {

        if ($scope.isGurdianEnabled) {
            var mobile = '';
            var ErrorArrary = [];
            //$scope.EmptyForm();
            if ($('#parent-dv').css('display') != 'none') {
                if ($('#Fatherfullname').val().trim() != '') {
                    var Names = $('#Fatherfullname').val().split(' ');
                    if (Names.length == 1) {
                        $scope.studForm.FatherFirstName = Names[0];
                        $scope.studForm.FatherLastName = '';
                    } else {
                        $scope.studForm.FatherFirstName = Names[0];
                        $scope.studForm.FatherLastName = $('#Fatherfullname').val().slice($('#Fatherfullname').val().indexOf(' ')).trim();
                    }
                } else
                    ErrorArrary.push('Fatherfullname');

                if (!$('#Fatheremailid').is(':disabled')) {
                    if ($('#Fatheremailid').val().trim() != '') {
                        email = '';
                        email = $('#Fatheremailid').val().trim();
                        if ($rootScope.maskEmailId(email))
                            $scope.studForm.Fatheremailid = $('#Fatheremailid').val().trim();
                        else
                            ErrorArrary.push('Fatheremailid');
                    }
                }

                if (!$('#Fathermobileno').is(':disabled')) {
                    if ($('#Fathermobileno').val().trim() != '') {
                        mobile = $('#Fathermobileno').val().replace(/-/g, '').trim();
                        if ($rootScope.ValidateMobileNo(mobile))
                            $scope.studForm.Fathermobileno = mobile;
                        else
                            ErrorArrary.push('Fathermobileno');
                    } else
                        ErrorArrary.push('Fathermobileno');
                }

                if ($('#State option:selected').val() != '')
                    $scope.studForm.State = $('#State option:selected').val().trim();
                else
                    $scope.studForm.State = '';

                if ($('#City option:selected').val() != '')
                    $scope.studForm.City = $('#City option:selected').val().trim();
                else
                    $scope.studForm.City = '';

                if (!$('#Mothermobileno').is(':disabled')) {
                    if ($('#Mothermobileno').val().trim() != '') {
                        mobile = '';
                        mobile = $('#Mothermobileno').val().replace(/-/g, '').trim()
                        if ($rootScope.ValidateMobileNo(mobile))
                            $scope.studForm.Mothermobileno = mobile;
                        else
                            ErrorArrary.push('Mothermobileno');
                    }
                }

                if ($('#Motherfullname').val().trim() != '') {
                    var Names = $('#Motherfullname').val().split(' ');
                    if (Names.length == 1) {
                        $scope.studForm.MotherFirstname = Names[0];
                        $scope.studForm.MotherLastname = '';
                    } else {
                        $scope.studForm.MotherFirstname = Names[0];
                        $scope.studForm.MotherLastname = $('#Motherfullname').val().slice($('#Motherfullname').val().indexOf(' ')).trim();
                    }
                }
                else
                    ErrorArrary.push('Motherfullname');

                if (!$('#Motheremailid').is(':disabled')) {
                    if ($('#Motheremailid').val().trim() != '') {
                        email = '';
                        email = $('#Motheremailid').val().trim();
                        if ($rootScope.maskEmailId(email))
                            $scope.studForm.Motheremailid = email;
                        else
                            ErrorArrary.push('Motheremailid');
                    }
                }

                if ($('#Fatheroccupation').val().trim() != '')
                    $scope.studForm.Fatheroccupation = $('#Fatheroccupation').val().trim();

                if ($('#Fatherqualification').val().trim() != '')
                    $scope.studForm.Fatherqualification = $('#Fatherqualification').val().trim();

                if ($('#Motheroccupation').val().trim() != '')
                    $scope.studForm.Motheroccupation = $('#Motheroccupation').val().trim();

                if ($('#Motherqualification').val().trim() != '')
                    $scope.studForm.Motherqualification = $('#Motherqualification').val().trim();

                $scope.studForm.ParentRecordExist = false;
            } else if ($('#perient-existing-dv').css('display') != 'none') {
                if ($('#existingNumber').val().trim() != '')
                    $scope.studForm.ExistingNumber = $('#existingmobileno').val().replace(/-/g, '').trim();
                else
                    ErrorArrary.push('existingNumber');

                $scope.studForm.ParentRecordExist = true;
            }

            if ($scope.gurdain) {
                if ($('#Guradinfullname').val().trim() != '')
                    $scope.studForm.LocalGuardianFullName = $('#Guradinfullname').val().trim();
                else
                    ErrorArrary.push('Guradinfullname');

                if (!$('#Gurdainemailid').is(':disabled')) {
                    if ($('#Gurdainemailid').val().trim() != '') {
                        email = '';
                        email = $('#Gurdainemailid').val().trim();
                        if ($rootScope.maskEmailId(email))
                            $scope.studForm.LocalGuardianemailid = email;
                        else
                            ErrorArrary.push('Gurdainemailid');
                    } else
                        ErrorArrary.push('Gurdainemailid');
                }

                if (!$('#Gurdainnumber').is(':disabled')) {
                    if ($('#Gurdainnumber').val().trim() != '') {
                        mobile = '';
                        mobile = $('#Gurdainnumber').val().replace(/-/g, '').trim();
                        if ($rootScope.ValidateMobileNo(mobile))
                            $scope.studForm.LocalGuardianMobileno = mobile;
                    } else
                        ErrorArrary.push('Gurdainnumber');
                }
            }

            if ($('#Category option:selected').val().trim() != '')
                $scope.studForm.Category = $('#Category option:selected').val().trim();
            else
                $scope.studForm.Category = '';

            if ($('#Religion option:selected').val().trim() != '')
                $scope.studForm.Religion = $('#Religion option:selected').val().trim();
            else
                $scope.studForm.Religion = '';

            if ($('#mothertongue').val().trim() != '')
                $scope.studForm.MotherTongue = $('#mothertongue').val().trim();
            else
                $scope.studForm.MotherTongue = '';

            if ($('#FirstName').val().trim() != '')
                $scope.studForm.FirstName = $('#FirstName').val().trim();
            else
                ErrorArrary.push('FirstName');

            if ($('#LastName').val().trim() != '')
                $scope.studForm.LastName = $('#LastName').val().trim();
            else
                ErrorArrary.push('LastName');

            if (!$('#EmailId').is(':disabled')) {
                if ($('#EmailId').val().trim() != '') {
                    email = '';
                    email = $('#EmailId').val().trim();
                    if ($rootScope.maskEmailId(email))
                        $scope.studForm.EmailId = email;
                    else
                        ErrorArrary.push('EmailId');
                } else
                    $scope.studForm.EmailId = null;
            }

            if (!$('#Mobilenumber').is(':disabled')) {
                if ($('#Mobilenumber').val().trim() != '') {
                    mobile = '';
                    mobile = $('#Mobilenumber').val().replace(/-/g, '').trim();
                    if ($rootScope.ValidateMobileNo(mobile))
                        $scope.studForm.Mobilenumber = mobile;
                    else
                        ErrorArrary.push('Mobilenumber');
                }
                else
                    $scope.studForm.Mobilenumber = null;
            }

            if ($('#Dob').val().trim() != '')
                $scope.studForm.Dob = $('#Dob').val().trim();
            else
                $scope.studForm.Dob = $rootScope.FormateToDateTime(new Date(-1));

            if ($('#Address').val().trim() != '')
                $scope.studForm.Address = $('#Address').val().trim();
            else
                $scope.studForm.Address = '';

            if ($('#Age').val().trim() != '')
                $scope.studForm.Age = $('#Age').val().trim();
            else
                $scope.studForm.Age = 0;

            if ($('#Class option:selected').val() != '') {
                if ($('#section option:selected').val() != '')
                    $scope.studForm.ClassDetailId = $('#section option:selected').val();
                else
                    ErrorArrary.push('section');
            }

            if ($('#lastschoolName').val() != '')
                $scope.studForm.LastSchoolName = $('#lastschoolName').val();
            else
                $scope.studForm.LastSchoolName = null;

            if ($('#schooladdress').val() != '')
                $scope.studForm.PSAddress = $('#schooladdress').val();
            else
                $scope.studForm.PSAddress = null;

            if ($('#psmedium').val() != '')
                $scope.studForm.PSMedium = $('#psmedium').val();
            else
                $scope.studForm.PSMedium = null;

            if ($('#classstuding option:selected').val() != '')
                $scope.studForm.LastClass = $('#classstuding option:selected').val().trim();
            else
                $scope.studForm.LastClass = null;

            $scope.studForm.Pincode = null;

            var registrationNumbers = '';
            $.each($('#siblingdv').find('input[name="existingStudentRegno"]'), function (index, value) {
                if (index == 0)
                    registrationNumbers += $(value).val();
                else
                    registrationNumbers += ',' + $(value).val();
            });

            $scope.studForm.SiblingRegistrationNo = registrationNumbers;

            if (ErrorArrary.length > 0) {
                for (var i = 0; i < ErrorArrary.length; i++) {
                    $('#' + ErrorArrary[i]).css({ 'border': '1px solid red' });
                }
                $('html, body').animate({ scrollTop: $("#studentRegistration").offset().top }, 300);
                $('#existingNumber').val($scope.studForm.ExistingNumber);
                $('#existingmobileno').val($scope.studForm.ExistingNumber);
            } else {
                $scope.register();
            }
        } else {
            $('html, body').animate({ scrollTop: $("#studentRegistration").offset().top }, 300);
            $('#errorgurdianmsg').show();
            $('#errorgurdianmsg').fadeOut(10000);
        }
    }

    $scope.changeGender = function () {
        if ($(event.currentTarget).attr('name') == 'genderM') {
            $scope.studForm.Sex = true;
            $('#genderM').prop('checked', true).attr('checked', 'checked');
            $('#genderF').prop('checked', false).removeAttr('checked');
        } else {
            $scope.studForm.Sex = false;
            $('#genderF').prop('checked', true).attr('checked', 'checked');
            $('#genderM').prop('checked', false).removeAttr('checked');
        }
    }

    $scope.maskmobile = function () {
        if ($(event.currentTarget).val().length < 12) {
            if ($(event.currentTarget).val().length == 3 || $(event.currentTarget).val().length == 7)
                $(event.currentTarget).val($(event.currentTarget).val() + '-');

            if (event.keyCode < 48 || event.keyCode > 57) {
                event.preventDefault();
            } else if (event.keyCode == 8) {
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            } else {
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            }


        } else {
            event.preventDefault();
        }
    }

    $scope.validateField = function () {
        if ($(event.currentTarget).attr('type') == 'select') {
            if ($(event.currentTarget).val() != '-1')
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        } else if ($(event.currentTarget).attr('type') == 'text' || $(event.currentTarget).attr('type') == 'email') {
            if ($(event.currentTarget).val().trim() != '')
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        } else if ($(event.currentTarget).attr('type') == 'number') {
            if ($(event.currentTarget).val().trim() != '')
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $scope.DDlvalidateField = function () {
        if ($(event.currentTarget).val().trim().length > 0)
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
    }

    $scope.EnableDob = function () {
        if (new Date($('#Dob').val()) != 'Invalid Date') {
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            var Year = new Date($('#Dob').val()).getFullYear();
            var CurrentYear = new Date().getFullYear();
            var TotalAge = CurrentYear - Year;
            $scope.studForm.Age = TotalAge;
            $('#Age').val(TotalAge);
        }
    }

    $scope.getStudent = function () {
        if ($(event.currentTarget).val().trim().length >= 3) {
            var $rootDiv = $(event.currentTarget).closest('div[name="siblingContainer"]');
            $rootDiv.find('div[name="showStudentList"]').show();
            $rootDiv.find('div[name="loaderdv"]').show();
            var userEvent = event.currentTarget;

            var handler = $ajax.get('Registration/GetStudentList?RegistrationNo=' + $(event.currentTarget).val().trim() +
                '&CompleteReg=' + false, 'json');
            handler.done(function (result) {
                if (result != null && result != '') {
                    $scope.SiblingDetail = JSON.parse(result);
                    $rootDiv.find('div[name="loaderdv"]').hide();
                    $rootDiv.find('table[name="showStudenttable"]').fadeIn(500);
                    $(userEvent).removeAttr('disabled');
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                    $rootDiv.find('input[type="text"][name="existingStudentRegno"]').hover();
                }
            });

            handler.fail(function (e, x) {
                console.log('fail');
            });
        }
    }

    $scope.hideReference = function () {
        $('div[name="loaderdv"]').show();
        $('table[name="showStudenttable"]').hide();
        $('div[name="showStudentList"]').hide();
    }

    $scope.selectStudent = function () {
        var currentContainer = $(event.currentTarget).closest('div[name="siblingContainer"]');
        $(currentContainer).find('input[name="existingStudentRegno"]').val($(event.currentTarget).find('a[name="regno"]').text().trim());
        $(currentContainer).find('input[name="sblingname"]').val($(event.currentTarget).find('a[name="uname"]').text().trim());
    }

    $scope.BindAllEmailAndMobileNo = function () {
        var numbers = '';
        var emails = '';
        if (!$('#Mobilenumber').is(':disabled')) {
            if ($rootScope.CheckValid($scope.studForm.Mobilenumber))
                numbers = $scope.studForm.Mobilenumber;
        }

        if (!$('#Fathermobileno').is(':disabled')) {
            if ($rootScope.CheckValid($scope.studForm.Fathermobileno))
                if (numbers != '')
                    numbers += "," + $scope.studForm.Fathermobileno;
                else
                    numbers = $scope.studForm.Fathermobileno;
        }

        if (!$('#Mothermobileno').is(':disabled')) {
            if ($rootScope.CheckValid($scope.studForm.Mothermobileno))
                if (numbers != '')
                    numbers += "," + $scope.studForm.Mothermobileno;
                else
                    numbers = $scope.studForm.Mothermobileno;
        }

        $scope.studForm.MobileNumbers = numbers;

        // --------------------  Collecting email  ------------------------

        if (!$('#EmailId').is(':disabled')) {
            if ($rootScope.CheckValid($scope.studForm.EmailId))
                emails = $scope.studForm.EmailId;
        }

        if (!$('#Fatheremailid').is(':disabled')) {
            if ($rootScope.CheckValid($scope.studForm.Fatheremailid))
                if (emails != '')
                    emails += "," + $scope.studForm.Fatheremailid;
                else
                    emails = $scope.studForm.Fatheremailid;
        }

        if (!$('#Motheremailid').is(':disabled')) {
            if ($rootScope.CheckValid($scope.studForm.Motheremailid))
                if (emails != '')
                    emails += "," + $scope.studForm.Motheremailid;
                else
                    emails = $scope.studForm.Motheremailid;
        }

        $scope.studForm.EmailIds = emails;
    }

    $scope.register = function () {

        $('#ppconfirm').modal('hide');
        var message = 'Please wait registration is going on ...';
        waitingDialog.show(message)
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

        if ($scope.IsUpdating) {
            $scope.studForm.ImageUrl = $scope.PageData.ImageUrl
            $scope.studForm.StudentUid = $scope.PageData.studentUid;
        }

        if ($('#genderM').prop('checked'))
            $scope.studForm.Sex = true;
        else
            $scope.studForm.Sex = false;

        $scope.studForm.RegistrationNo = 'ED' + (new Date()).getTime().toString();
        $scope.studForm.AdmissionDatetime = new Date();
        if ($scope.studForm.ExistingNumber == undefined || $scope.studForm.ExistingNumber == null || $scope.studForm.ExistingNumber == '')
            $scope.UserExistingParentDetail();

        $scope.BindAllEmailAndMobileNo();

        fileData.append('studentFormObject', JSON.stringify($scope.studForm));

        $.ajax({
            url: '../Registration/SubmitStudentForm',
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: fileData,
            success: function (result) {
                waitingDialog.hide()
                if (result != '' && result != null) {
                    $('#regmsg').text(result);
                    $('textarea').val('');
                    $('input').val('');
                    $('select').val(-1);
                    $('#profileImgUrl').attr('src', '~/images/picture.png');
                    $('#btnClose').hide();
                    $('#btnOk').show();
                    $scope.IsRedirected = true;
                    $scope.RedirectionUrl = '../Reports/Student';
                } else if ($rootScope.CheckValid(result.EmailMobileExists)) {
                    var ObjResult = JSON.parse(result.EmailMobileExists);
                    var MobileNos = '';
                    var Emails = '';
                    if ($rootScope.CheckValid(ObjResult)) {
                        if ($rootScope.CheckValid(ObjResult.mobile)) {
                            MobileNos = ObjResult.mobile.join(',')
                        }
                    }

                    if ($rootScope.CheckValid(ObjResult)) {
                        if ($rootScope.CheckValid(ObjResult.email)) {
                            Emails = ObjResult.email.join(',')
                        }
                    }

                    $('#btnOk').hide();
                    $('#btnClose').show();
                    $('#regmsg').text("Following Email and Mobile no's already exists.");
                    $('#extra-mobile-error').text("Mobile no's: [" + MobileNos + "] ");
                    $('#extra-email-error').text("Email id's: [" + Emails + "]");
                    $scope.IsRedirected = false;
                } else {
                    $('#btnOk').show();
                    $('#btnClose').hide();
                    $('#regmsg').text(result);
                }
                $('#studregpp').modal('show');
            },
            error: function (err) {
                $scope.IsRedirected = false;
                $scope.RedirectionUrl != '';
                $scope.regmsg = err.statusText;
                $('#btnOk').hide();
                $('#btnClose').show();
                waitingDialog.hide(message);
                $('#studregpp').modal('show');
            }
        });
    }

    $scope.gotoStudentViewPage = function () {
        if ($scope.IsRedirected) {
            if ($scope.RedirectionUrl != '')
                location.href = '../Reports/Student';
        }
    }

    $scope.change = function () {
        if ($('#g-dv').css('display') == 'none') {
            $('#g-dv').fadeIn(500);
            $scope.gurdain = true;
        } else {
            $('#g-dv').css({ 'display': 'none' });
            $scope.gurdain = false;
        }
    }

    $scope.enableexistingDefault = function () {
        $scope.isGurdianEnabled = true;
        $('#perient-sel-dv').css({ 'display': 'none' });
        $('#parent-dv').fadeIn(500);
    }

    $scope.enableexisting = function () {
        $scope.isGurdianEnabled = true;
        $('#perient-sel-dv').css({ 'display': 'none' });
        $('#parent-dv').css({ 'display': 'none' });
        if ($('#perient-existing-dv').css('display') == 'none')
            $('#perient-existing-dv').fadeIn(500);
        else
            $('#perient-existing-dv').css({ 'display': 'none' });
    }

    $scope.enablenew = function () {
        $scope.isGurdianEnabled = true;
        $('#perient-sel-dv').css({ 'display': 'none' });
        $('#perient-existing-dv').css({ 'display': 'none' });
        if ($('#parent-dv').css('display') == 'none')
            $('#parent-dv').fadeIn(500);
        else
            $('#parent-dv').css({ 'display': 'none' });
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

    $scope.selectNumber = function () {
        var mobile = $(event.currentTarget).find('span[name="mobile"]').text().trim();
        var fullname = $(event.currentTarget).find('span[name="fullname"]').text().trim();
        var userId = $(event.currentTarget).find('input[type="hidden"]').val().trim();
        $scope.studForm.ExistingNumber = mobile;
        $scope.studForm.ParentDetailId = userId;
        $('#existingNumber').val(fullname + "  [" + mobile + "]");
        $('#existingmobileno').val(mobile);
        $('#ddlfilter').hide();
    }

    $scope.addsibling = function () {
        var siblingTemplate = '<div class="form-group new-group" id="{{groupid}}" name="siblingContainer">\
                            <div class="col-sm-6 col-md-6 col-xs-12">\
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" style="padding-top: 8px;">Reg. No.</label>\
                                <div class="col-md-9 col-sm-9 col-xs-12" name="existingdv">\
                                    <input type="hidden" name="existingStudentUid" />\
                                    <input type="text" name="existingStudentRegno" ng-keyup="getStudent()" class="form-control col-md-10" />\
                                    <div class="selection-dd" style="display: none;" name="showStudentList">\
                                        <div ng-click="selectStudent()" ng-repeat="stud in SiblingDetail">\
                                            <a href="javascript:void(0)" name="regno">{{stud.registrationNo}}</a>\
                                            <a href="javascript:void(0)" name="uname">{{stud.FullName}}</a>\
                                        </div>\
                                        <div name="loaderdv" class="loaderdv">\
                                            <img src="../images/loader.gif" />\
                                            <span>&ensp;Getting studnet detail.</span>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-sm-6 col-md-6 col-xs-12">\
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" style="padding-top: 8px;">Full Name </label>\
                                <div class="col-md-9 col-sm-9 col-xs-12">\
                                    <input type="text" name="sblingname" placeholder="Sibling Name" disabled class="form-control col-md-10" />\
                                </div>\
                            </div>\
                        </div>';

        var newId = (new Date()).getTime();
        var template = siblingTemplate.replace('{{groupid}}', newId);
        $('#siblingdv').append($compile(template)($scope));
        $('#' + newId).fadeIn(500);
        return newId;
    }

    $scope.EditParent = function () {
        $scope.enablenew();
        var StudentUid = null;
        var UrlParameter = location.href.substr(location.href.indexOf('?') + 1).split('&')
        var len = UrlParameter.length;
        for (var i = 0; i < len; i++) {
            if (UrlParameter[i].indexOf('StudentUid') != -1) {
                StudentUid = UrlParameter[i].split('=')[1];
                break;
            }
        }

        if ($rootScope.CheckValid($scope.studForm.LocalGuardianFullName)) {
            $('#g-dv').fadeIn(500);
            $scope.confirmed = true;
        }
    }

    $scope.UserExistingParentDetail = function () {
        $scope.ParentDetail.FatherFirstName = null;
        $scope.ParentDetail.FatherLastName = null;
        $scope.ParentDetail.MotherFirstName = null;
        $scope.ParentDetail.MotherLastName = null;
        $scope.ParentDetail.Fatheroccupation = null;
        $scope.ParentDetail.FatherMobileno = null;
        $scope.ParentDetail.Fatherqualification = null;
        $scope.ParentDetail.Fatheremailid = null;
        $scope.ParentDetail.LocalGuardianFullName = null;
        $scope.ParentDetail.LocalGuardianMobileno = null;
        $scope.ParentDetail.LocalGuardianemailid = null;
        $scope.ParentDetail.MotherMobileno = null;
        $scope.ParentDetail.MotherOccupation = null;
        $scope.ParentDetail.MotherQualification = null;
        $scope.ParentDetail.Motheremailid = null;
    }

    $scope.ShowDynamicDDOptions = function () {
        $(event.currentTarget).next().removeClass('dn');
        event.stopPropagation();
    }

    $scope.SelectCurrentLanguage = function () {
        $scope.studForm.MotherTongue = $(event.currentTarget).find('a').text().trim()
        $('#mothertongue').val($scope.studForm.MotherTongue);
        $(event.currentTarget).closest('div[name="selection-dd"]').addClass('dn');
    }

    $scope.SelectCurrentFatherOccupation = function () {
        $scope.studForm.Fatheroccupation = $(event.currentTarget).text().trim()
        $('#Fatheroccupation').val($scope.studForm.Fatheroccupation);
        $(event.currentTarget).closest('div[name="selection-dd"]').addClass('dn');
    }

    $scope.SelectCurrentFatherQualificatoin = function () {
        $scope.studForm.Fatherqualification = $(event.currentTarget).text().trim()
        $('#Fatherqualification').val($scope.studForm.Fatherqualification);
        $(event.currentTarget).closest('div[name="selection-dd"]').addClass('dn');
    }

    $scope.SelectCurrentMotherOccupation = function () {
        $scope.studForm.Motheroccupation = $(event.currentTarget).text().trim()
        $('#Motheroccupation').val($scope.studForm.Motheroccupation);
        $(event.currentTarget).closest('div[name="selection-dd"]').addClass('dn');
    }

    $scope.SelectCurrentMotherQualificatoin = function () {
        $scope.studForm.Motherqualification = $(event.currentTarget).text().trim()
        $('#Motherqualification').val($scope.studForm.Motherqualification);
        $(event.currentTarget).closest('div[name="selection-dd"]').addClass('dn');
    }
})