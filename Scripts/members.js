/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('registration', function ($scope, $rootScope, $compile, $ajax, $MenuActivator, $filter, $local) {

    $scope.userData = {};
    $scope.selecteFile = '';
    $scope.ppmsg = '';
    $scope.IsForModification = false;
    $scope.DocumentPath = '';
    $scope.ImageUrl = ' ../images/user.png';
    $scope.ViewDocuments = false;
    $scope.UserData = {
        FirstName: '',
        LastName: '',
        Gender: true,
        Dob: '',
        MobileNumber: '',
        StaffMemberUid: '',
        AlternetNumber: '',
        Email: '',
        Address: '',
        State: '',
        City: '',
        Pincode: 0,
        SchoolUniversityName: '',
        DegreeName: '',
        Grade: '',
        MarksObtain: 0,
        ExprienceInYear: 0,
        ExperienceInMonth: 0,
        AdminId: false,
        SchoolTenentId: '',
        IsAdmin: '',
        ClassDetailId: '',
        ImageUrl: '',
        DesignationId: 1,
        Subjects: '',
        Type: '',
        ProfileImageName: ''
    };
    $scope.AllSubjects = null;
    $scope.DocFileDesc = 'Click here to attach your documents';
    $scope.DocFiles = '';
    $scope.DocumentFileNames = [];
    $scope.BaseUrl = 'http://' + window.location.hostname + '/EdServer/';

    angular.element(document).ready(function () {
        console.log('Registration started');
        $("#imageUrl").change(function () {
            $scope.readURL(this);
        });

        $scope.GetSubjectInfo();
        if (typeof Data != 'undefined' && Data != null && Data != '' && typeof Data.Table != "undefined") {
            $scope.UserData = Data.Table[0];
            $scope.DocumentFileNames = FacultyUploadedFileNames;
            $scope.middleName = '';
            $scope.LastName = '';
            if ($scope.UserData != null && $scope.UserData != '') {

                if ($scope.UserData.LastName != null) {
                    if ($scope.UserData.LastName.trim().split(' ').length > 1) {
                        var FullName = $scope.UserData.LastName.trim().split(' ');
                        if (FullName.length > 0)
                            $scope.middleName = FullName[0];
                        var LastName = null;
                        if (FullName.length > 1)
                            LastName = FullName.splice(1, 1);
                        $scope.UserData.LastName = LastName;
                    } else {
                        $scope.UserData.LastName = $scope.UserData.LastName.trim();
                    }
                }

                if ($scope.UserData.ClassTeacherForClass != undefined && $scope.UserData.ClassTeacherForClass != null)
                    $scope.UserData.ClassDetailId = $scope.UserData.ClassTeacherForClass;

                $scope.StaffDob = new Date($scope.UserData.Dob).toLocaleString('en-US').replace(',', '');
                if ($scope.UserData.IsAdmin == 1) {
                    $('#isadminY').prop('checked', true).attr('checked', 'checked');
                    $('#isadminN').prop('checked', false).removeAttr('checked');
                } else {
                    $('#isadminY').prop('checked', false).removeAttr('checked');
                    $('#isadminN').prop('checked', true).attr('checked', 'checked');
                }

                if ($scope.UserData.pincode != undefined && $scope.UserData.pincode != null)
                    $scope.UserData.Pincode = $scope.UserData.pincode;

                if ($scope.UserData.Gender == 1) {
                    $('#genderM').prop('checked', true).attr('checked', 'checked');
                    $('#genderF').prop('checked', false).removeAttr('checked');
                } else {
                    $('#genderM').prop('checked', false).removeAttr('checked');
                    $('#genderF').prop('checked', true).attr('checked', 'checked');
                }

                if ($scope.UserData.Section != null && $scope.UserData.Section != '') {
                    $('#section').prop('disabled', false).removeAttr('disabled');
                    $scope.BindClass();
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                    $('#Class option:selected').val($scope.userData.Class);
                    $scope.BindSection(null);
                } else {
                    $scope.BindClass();
                }

                if ($scope.UserData.ExprienceInYear == 0)
                    $scope.UserData.ExprienceInYear = '';
                if ($scope.UserData.ExperienceInMonth == 0)
                    $scope.UserData.ExperienceInMonth = '';

                $('#MobileNumber').prop('disabled', true).attr('disabled', 'disabled');
                $('#Email').prop('disabled', true).attr('disabled', 'disabled');
                if ($rootScope.CheckValid($scope.UserData.ProofOfDocumentationPath))
                    $scope.ImageUrl = '../Uploads/' + $scope.UserData.ProofOfDocumentationPath + "/" + $scope.UserData.ImageUrl;
                $scope.IsForModification = true;
                if ($rootScope.CheckValid($scope.UserData.ProofOfDocumentationPath)) {
                    var SplittedFiles = $scope.UserData.ProofOfDocumentationPath.split('_');
                    var TotalDocFiles = 0;
                    if (SplittedFiles.length == 2) {
                        TotalDocFiles = SplittedFiles[1];
                        $scope.ViewDocuments = true;
                        $scope.DocFileDesc = 'Click here to see your uploaded documents.';
                    }
                }
            }
        } else {
            $scope.BindClass();
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();


        $('#ExprienceInYear option').prop('selected', false).removeAttr('selected');
        $('#ExperienceInMonth option').prop('selected', false).removeAttr('selected');
        $('#ExprienceInYear option[value="' + $scope.UserData.ExprienceInYear + '"]').prop('selected', true).attr('selected', 'selected');
        $('#ExperienceInMonth option[value="' + $scope.UserData.ExperienceInMonth + '"]').prop('selected', true).attr('selected', 'selected');
    })

    $scope.GetSubjectInfo = function () {
        var $handler = $ajax.get('Events/GetSubjects', 'json');
        $handler.done(function (result) {
            if (result != null) {
                $scope.AllSubjects = result.Table;

                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                    $scope.$digest();
                $rootScope.ConvertToMultiSelect('subjects');
            }
        })
    }

    $scope.EnableState = function () {
        if ($('#State option:selected').val() != '') {
            $('#State').css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $scope.previousStep = function () {
        var step = $('#steps-reminder').val();
        var stepNo = step.replace('step-', '');
        if (parseInt(stepNo) >= 0) {
            $('#nextbtn').prop('disabled', false).removeAttr('disabled');
            $('#submitbtn').prop('disabled', true).attr('disabled', 'disabled');
            $('div[name="form-steps"]').removeClass('sn').addClass('dn');
            $('a[title="asteps"]').removeClass('selected').addClass('done');
            if (step == 'step-4') {
                $('#step-3').removeClass('dn').addClass('sn');
                $('#steps-reminder').val('step-3');
                $('a[name="astep-3"]').removeClass('done').addClass('selected');
            } else if (step == 'step-3') {
                $('#step-2').removeClass('dn').addClass('sn');
                $('#steps-reminder').val('step-2');
                $('a[name="astep-2"]').removeClass('done').addClass('selected');
            } else if (step == 'step-2') {
                $('#step-1').removeClass('dn').addClass('sn');
                $('#steps-reminder').val('step-1');
                $('a[name="astep-1"]').removeClass('done').addClass('selected');
                $(event.currentTarget).prop('disabled', true).attr('disabled', 'disabled');
            }
        }
    }

    $scope.GotoCurrentStep = function () {
        var tagName = $(event.currentTarget).attr('name')
        var stepNum = tagName.replace('astep-', '');
        if ($rootScope.CheckValid(stepNum) && stepNum <= 4 && stepNum >= 0) {
            --stepNum;
            if (stepNum == 3) {
                if (location.href.indexOf('StaffUid') != -1) {
                    if ($scope.UserData.Subjects != null && $scope.UserData.Subjects != '') {
                        var $field = $('#custom-multiselect-option').find('div[class="select-filter"]');
                        $field.find('span[active="1"]').remove();
                        var Subjects = $scope.UserData.Subjects.split(',');
                        $field.find('span[name="default-value"]').addClass('dn');
                        for (var i = 0; i < Subjects.length; i++) {
                            var $tag = $('#custom-multiselect-option').find('input[type="hidden"][value="' + Subjects[i].trim() + '"]');
                            if ($tag != undefined) {
                                $tag.closest('div').find('i').removeClass('dn');
                                var data = $tag.closest('div').find('p').text().trim()
                                $field.append($compile('<span active="1" name="' + Subjects[i].trim() + '">' + data + '<i class="fa fa-times" ng-click="RemoveMe()"></i></span>')($scope))
                            }
                        }
                    }

                    $scope.userData.Type = $scope.UserData.Type;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                }
            }
            $('#steps-reminder').val('step-' + stepNum);
            $scope.nextStep();
        }
    }

    $scope.nextStep = function () {
        var step = $('#steps-reminder').val();
        var stepNo = step.replace('step-', '');
        if (parseInt(stepNo) <= 3) {
            var isvalid = $scope.GetFormData(step);
            if (isvalid) {
                $('#prevbtn').prop('disabled', false).removeAttr('disabled');
                if (step != 'step-2') {
                    $('div[name="form-steps"]').removeClass('sn').addClass('dn');
                    $('a[title="asteps"]').removeClass('selected').addClass('done');
                }
            }

            if (step == 'step-3') {
                if ($('#custom-multiselect-option').find('div[class="select-filter"]').find('span').length <= 1) {
                    $('#custom-multiselect-option').css({ 'border': '1px solid red' });
                    isvalid = false;
                }
            }

            if (step == 'step-0') {
                $('#step-1').removeClass('dn').addClass('sn');
                $('#steps-reminder').val('step-1');
                $('a[name="astep-2"]').removeClass('done').addClass('selected');
            } if (step == 'step-1') {
                if (isvalid) {
                    $('#step-2').removeClass('dn').addClass('sn');
                    $('#steps-reminder').val('step-2');
                    $('a[name="astep-2"]').removeClass('done').addClass('selected');
                }
            } else if (step == 'step-2') {
                if (isvalid) {
                    if (!$scope.IsForModification) {
                        $scope.ValidateMobileInDb($('#MobileNumber').val().trim(), $('#Email').val().trim());
                    } else {
                        $('div[name="form-steps"]').removeClass('sn').addClass('dn');
                        $('a[title="asteps"]').removeClass('selected').addClass('done');
                        $('#step-3').removeClass('dn').addClass('sn');
                        $('#steps-reminder').val('step-3');
                        $('a[name="astep-3"]').removeClass('done').addClass('selected');
                    }
                }

                if (location.href.indexOf('StaffUid') != -1) {
                    if ($scope.UserData.Subjects != null && $scope.UserData.Subjects != '') {
                        var $field = $('#custom-multiselect-option').find('div[class="select-filter"]');
                        $field.find('span[active="1"]').remove();
                        var Subjects = $scope.UserData.Subjects.split(',');
                        $field.find('span[name="default-value"]').addClass('dn');
                        for (var i = 0; i < Subjects.length; i++) {
                            var $tag = $('#custom-multiselect-option').find('input[type="hidden"][value="' + Subjects[i].trim() + '"]');
                            if ($tag != undefined) {
                                $tag.closest('div').find('i').removeClass('dn');
                                var data = $tag.closest('div').find('p').text().trim()
                                $field.append($compile('<span active="1" name="' + Subjects[i].trim() + '">' + data + '<i class="fa fa-times" ng-click="RemoveMe()"></i></span>')($scope))
                            }
                        }
                    }

                    $scope.userData.Type = $scope.UserData.Type;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                }
            } else if (step == 'step-3') {
                if (isvalid) {
                    $('#step-4').removeClass('dn').addClass('sn');
                    $('#steps-reminder').val('step-4');
                    $('a[name="astep-4"]').removeClass('done').addClass('selected');
                    $(event.currentTarget).prop('disabled', true).attr('disabled', 'disabled');
                    $('#submitbtn').prop('disabled', false).removeAttr('disabled');
                    var SubjectNames = '';
                    $('#custom-multiselect-option').find('span[active="1"]').each(function (index, item) {
                        if (index == 0)
                            SubjectNames = $(item).text();
                        else
                            SubjectNames += ", " + $(item).text();
                    })

                    $('#bindSubject').text(SubjectNames);
                }
            }
        }
    }

    $scope.ValidateMobile = function (PassedNumber) {
        var Number = '';
        var Flag = false;
        if (PassedNumber != undefined && PassedNumber != null && PassedNumber != "")
            Number = PassedNumber;
        else
            Number = $(event.currentTarget).val();
        Number = Number.replace(/-/g, '');
        if (Number.length > 10) {
            if (Number.indexOf('+91') == 0) {
                Number = Number.replace('+91', '');
                if (Number.length > 10) {
                    $('#MobileNumber').css({ 'border': '1px solid red' });
                    Flag = false;
                } else {
                    $('#MobileNumber').val(Number);
                    Flag = true;
                }
            }
        } else if (Number.length < 10) {
            $('#MobileNumber').css({ 'border': '1px solid red' });
            Flag = false;
        } else {
            Flag = true;
        }
        return Flag;
    }

    $scope.ValidateMobileInDb = function (mobileno, email) {
        $('#fadeloadscreen').show();
        var number = mobileno.replace(/-/g, '');
        var NewUrl = 'Registration/VerifyMobibleExist?Mobile=' + number + '&EmailId=' + email;
        var handler = $ajax.get(NewUrl, 'json');
        handler.done(function (result) {
            var data = JSON.parse(result);
            if (data != null && data.length > 0) {
                var Message = '';
                for (var i = 0; i < data.length; i++) {
                    if (data[i] == 'Mobile') {
                        $('#MobileNumber').css({ 'border': '1px solid red' });
                        Message = 'Mobile number';
                    } else if (data[i] == 'Email') {
                        $('#Email').css({ 'border': '1px solid red' });
                        Message = 'Email Id';
                    } else {
                        $('#MobileNumber').css({ 'border': '1px solid red' });
                        $('#Email').css({ 'border': '1px solid red' });
                        Message = 'Mobile number and Email Id';
                    }
                }

                Message += ' already exist.';
                $('#fadeloadscreen').hide();
                $('#ppmsg').text(Message);
                $('#ppalert').modal('show');
            } else {
                $('div[name="form-steps"]').removeClass('sn').addClass('dn');
                $('a[title="asteps"]').removeClass('selected').addClass('done');
                $('#step-3').removeClass('dn').addClass('sn');
                $('#steps-reminder').val('step-3');
                $('a[name="astep-3"]').removeClass('done').addClass('selected');
                $('#fadeloadscreen').hide();
            }
        });

        handler.fail(function (error) {
            Message = 'Server internal error. Contact to your admin.';
            $('#fadeloadscreen').hide();
            $('#ppmsg').text(Message);
            $('#ppalert').modal('show');
        });
    }

    $scope.GetFormData = function (step) {
        var ErrorNames = [];
        if (step != '') {
            if (step == 'step-1') {
                if ($('#genderM').prop('checked'))
                    $scope.UserData.Gender = true;
                else
                    $scope.UserData.Gender = false;

                if ($('#isadminY').prop('checked'))
                    $scope.UserData.IsAdmin = true;
                else
                    $scope.UserData.IsAdmin = false;

                if ($scope.UserData.Dob != undefined || $scope.UserData.Dob == null || $scope.UserData.Dob == '')
                    if ($('#Dob').val().trim() != '')
                        $scope.UserData.Dob = $('#Dob').val().trim();
                    else
                        ErrorNames.push('Dob');

                if ($scope.UserData.FirstName == undefined || $scope.UserData.FirstName == null || $scope.UserData.FirstName.trim() == '')
                    ErrorNames.push('FirstName')
            } else if (step == 'step-2') {
                if ($scope.UserData.MobileNumber != undefined && $scope.UserData.MobileNumber != null && $scope.UserData.MobileNumber != '') {
                    if (!$scope.ValidateMobile($scope.UserData.MobileNumber)) {
                        ErrorNames.push('MobileNumber');
                    }
                } else
                    ErrorNames.push('MobileNumber');

                if ($scope.UserData.AlternetNumber != undefined && $scope.UserData.AlternetNumber != null && $scope.UserData.AlternetNumber.trim() != '')
                    $scope.UserData.AlternetNumber = $scope.UserData.AlternetNumber.replace(/-/g, '');

                if ($scope.UserData.Pincode != undefined && $scope.UserData.Pincode != null && $scope.UserData.Pincode != '')
                    $scope.UserData.Pincode = parseInt($scope.UserData.Pincode)
                else {
                    $scope.UserData.Pincode = 0;
                }

                if ($scope.UserData.Email != undefined && $scope.UserData.Email != null && $scope.UserData.Email != '') {
                    if ($rootScope.maskEmailId($scope.UserData.Email.trim()))
                        $scope.UserData.Email = $scope.UserData.Email.trim();
                    else
                        ErrorNames.push('Email');
                }
            } else if (step == 'step-3') {
                $('#Address').val($('#Address').val().trim());

                if ($scope.UserData.MarksObtain == undefined || $scope.UserData.MarksObtain == null || $scope.UserData.MarksObtain == '')
                    $scope.UserData.MarksObtain = 0.0;

                if ($scope.UserData.ExprienceInYear != undefined && $scope.UserData.ExprienceInYear != null && $scope.UserData.ExprienceInYear != '')
                    $scope.UserData.ExprienceInYear = parseInt($scope.UserData.ExprienceInYear);
                else
                    $scope.UserData.ExprienceInYear = 0;

                if ($scope.UserData.ExperienceInMonth != undefined && $scope.UserData.ExperienceInMonth != null && $scope.UserData.ExperienceInMonth != '')
                    $scope.UserData.ExperienceInMonth = parseInt($scope.UserData.ExperienceInMonth);
                else
                    $scope.UserData.ExperienceInMonth = 0;

                var Result = '';
                $('#custom-multiselect-option').find('div[class="select-filter"]').find('span').each(function (index, item) {
                    if ($(item).attr('name') != 'default-value') {
                        if (Result == '')
                            Result = $(item).attr('name');
                        else
                            Result += ',' + $(item).attr('name');
                    }
                })

                if (Result.trim() == '')
                    ErrorNames.push('subjects');
                else
                    $scope.UserData.Subjects = Result;
            }

            if (ErrorNames.length > 0) {
                for (var i = 0; i < ErrorNames.length; i++) {
                    $('#' + ErrorNames[i]).css({ 'border': '1px solid red' });
                }
                return false;
            } else {
                return true;
            }
        }
    }

    $scope.maskmobile = function () {
        if ($(event.currentTarget).val().length < 12) {
            if ($(event.currentTarget).val().length == 3 || $(event.currentTarget).val().length == 7)
                $(event.currentTarget).val($(event.currentTarget).val() + '-');

            if (event.keyCode < 48 || event.keyCode > 57) {
                $(event.currentTarget).closest('div').next().css({ 'display': 'block' });
                event.preventDefault();
            } else if (event.keyCode == 8) {
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            } else {
                $(event.currentTarget).closest('div').next().css({ 'display': 'none' });
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            }
        } else {
            event.preventDefault();
        }
    }

    $scope.makeValideField = function () {
        var tagId = $(event.currentTarget).attr('id');
        if ($('#' + tagId).attr('type') == 'select') {
            if ($('#' + tagId + ' option:selected').val() != '')
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        } else if ($(event.currentTarget).attr('type') == 'text') {
            if ($(event.currentTarget).val().trim() != '')
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $scope.IsNumeric = function () {
        if (!IsNumeric(event.keyCode))
            event.preventDefault();
    }

    $scope.redirectOperation = function () {

        if ($scope.returnStatus == '100' || $scope.returnStatus == '101') {
            location.href = '../Reports/Faculty';
        } else {
            console.log('No insert or update');
        }
    }

    $scope.showFiles = function () {
        $('#imageUrl').click();
    }

    $scope.readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#selectedImageUrl').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $scope.maskpincode = function () {
        if ($(event.currentTarget).val().length > 5)
            event.preventDefault();
        else
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
    }

    $scope.bindAdmin = function (val) {
        $(event.currentTarget).closest('div').find('input[type="radio"]').prop('checked', false).attr('checked', '');
        $('#spnadmin').hide();
        if (val == 1) {
            $('#spnadmin').text('This option grant user full access.');
            $(event.currentTarget).prop('checked', true).attr('checked', 'checked');
            $scope.userData.IsAdmin = 1;
        } else {
            $('#spnadmin').text('This option grant user limited access only.');
            $(event.currentTarget).prop('checked', true).attr('checked', 'checked');
            $scope.userData.IsAdmin = 0;
        }

        $('#spnadmin').fadeIn(500);
        //if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
        //    $scope.$digest();
    }

    $scope.dobEvent = function () {
        if (new Date($('#Dob').val()) != 'Invalid Date') {
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $scope.BindClass = function () {
        $scope.ClassDetail = $local.get('masterdata');
        if ($scope.ClassDetail != null && $scope.ClassDetail != "") {
            $scope.ClassDetail = $scope.ClassDetail.Classes;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    }

    $scope.BindSection = function (ExistingClass) {
        var SelectedClass = null;
        if (ExistingClass != null && ExistingClass != '')
            SelectedClass = ExistingClass;
        else SelectedClass = $('#Class option:selected').val();
        $scope.SectionDetail = $rootScope.GetSections(SelectedClass)
        $('#section').prop('disabled', false).removeAttr('disabled');
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    }

    $scope.BindSectionValue = function () {
        if ($('#section option:selected').val() != '') {
            $('#section').css({ 'border': '1px solid rgb(204, 204, 204)' });
        }

        $scope.userData.ClassDetailId = $('#section option:selected').val();
    }

    $scope.AttachDocuments = function () {
        if ($scope.ViewDocuments)
            $scope.ShowDocumentPopup()
        else
            $('#documentUrl').click();
    }

    $scope.BindAttachForProfileImage = function () {
        if ($('#imageUrl')[0].files != undefined && $('#imageUrl')[0].files != null)
            $scope.UserData.ProfileImageName = $('#imageUrl')[0].files[0].name;
    }

    $scope.finishApplication = function () {

        if ($scope.IsForModification) {
            $scope.register();
        } else {
            if ($('#imageUrl').val().trim() == '') {
                $('#registerppMsg').text('Profile image is not selected. Press Save to register without image.');
                $('#registerpp').modal('show');
            } else {
                $scope.register();
            }
        }
    }

    $scope.ShowDocumentPopup = function () {
        if ($scope.ViewDocuments) {
            if ($rootScope.CheckValid($scope.DocumentFileNames)) {
                if ($scope.DocumentFileNames.indexOf($scope.UserData.ImageUrl) != -1) {
                    $scope.DocumentFileNames.splice($scope.DocumentFileNames.indexOf($scope.UserData.ImageUrl), 1);
                }
                $scope.docimages = $scope.DocumentFileNames;
                if ($scope.docimages.length > 0) {
                    $('#imageview-pagination').find('a').removeClass('active-page');
                    $('#imageview-pagination').find('a[name="' + $scope.docimages[0] + '"]').addClass('active-page');
                }
            }

            if ($rootScope.CheckValid($scope.docimages) && $scope.docimages.length) {
                $scope.FilePath = '../Uploads/' + $scope.UserData.ProofOfDocumentationPath + "/" + $scope.docimages[0];
                $scope.NewImageName = $scope.docimages[0]
                $('#imageviewer').modal('show');
            } else {
                // no action show document not found
            }

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    }

    $scope.CheckFileType = function () {
        // Put any filter code for document upload in this section.
        // var reader = new FileReader();
        var SelectedFile = $('#documentUrl')[0].files;
        if ($rootScope.CheckValid(SelectedFile)) {
            var TotalFiles = SelectedFile.length;
            if (TotalFiles > 1) {
                $scope.DocFiles = TotalFiles + " File selected."
                $scope.DocFileDesc = 'Click here to change';
                $('#docfiles').removeClass('dn');
            } else if (TotalFiles == 1) {
                $scope.DocFiles = SelectedFile[0].name;
                $scope.DocFileDesc = 'Click here to change';
                $('#docfiles').removeClass('dn');
            } else {
                $scope.DocFileDesc = 'Unable to find file. Please click here to reselect your documents.';
                $('#docfiles').addClass('dn');
            }

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    }

    $scope.register = function () {

        $('#registerpp').modal('hide');
        var message = 'Please wait registration is going on ...';
        waitingDialog.show(message);
        var fileUpload = $('#imageUrl').get(0);
        var files = fileUpload.files;

        // Create FormData object  
        var fileData = new FormData();
        $scope.UserData.MobileNumber = $scope.UserData.MobileNumber.replace(/-/g, '').trim();

        var DocumentFileUpload = $('#documentUrl').get(0);
        var DocFiles = DocumentFileUpload.files;

        // Looping over all files and add it to FormData object  
        if (DocFiles != undefined) {
            for (var i = 0; i < DocFiles.length; i++) {
                fileData.append(DocFiles[i].name, DocFiles[i]);
            }
        }

        // Looping over all files and add it to FormData object  
        if (files != undefined) {
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            }
        }

        // Adding one more key to FormData object  
        if ($('#MiddleName').val().trim() != '') {
            $scope.UserData.LastName = $('#MiddleName').val().trim() + ' ' + $scope.UserData.LastName;
        }
        fileData.append('formObject', JSON.stringify($scope.UserData));
        $scope.returnStatus = 0;
        $.ajax({
            url: '../Registration/RegisterFaculty',
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: fileData,
            success: function (result) {
                waitingDialog.hide();
                $scope.returnStatus = result;
                if (result == '100') {
                    $('#facultyModalMsg').text('Registration done successfully');
                    $('#step-1').removeClass('dn').addClass('sn');
                    $('#step-2').removeClass('sn').addClass('dn');
                    $('#step-3').removeClass('sn').addClass('dn');
                    $('#step-4').removeClass('sn').addClass('dn');
                    $('#steps-reminder').val('step-1');
                    $('a[title="asteps"]').removeClass('selected').addClass('done');
                    $('a[name="astep-1"]').removeClass('done').addClass('selected');
                    $('#nextbtn').prop('disabled', false).removeAttr('disabled');
                    $('#submitbtn').prop('disabled', true).attr('disabled', 'disabled');
                    $('#prevbtn').prop('disabled', true).attr('disabled', 'disabled');
                    $('textarea').val('');
                    $('input').val('');
                    $('select').val('');
                    $('#facultyModalMsg').text('Registration done successfully');
                } else if (result == '101') {
                    $('#facultyModalMsg').text('Update successfully');
                } else if (result == '500') {
                    $('#facultyModalMsg').text('Mobile number already registered');
                } else {
                    $('#facultyModalMsg').text('Unable to perform operation. Please contact admin.');
                }

                $('#facultyModal').modal('show');
            },
            error: function (err) {
                $('#facultyModalMsg').text(err.statusText);
                $('#facultyModal').modal('show');
                waitingDialog.hide(message)
            }
        });
    }

    $scope.SubmitChanges = function () {
        if ($scope.NewDocumentSelected) {
            waitingDialog.show(ProcessingMessae);
            var UploadData = {};
            var type = $('#operationtype').val();
            var Url = $scope.BaseUrl + 'Registration/AddUpdateDeleteDocument';
            var ProcessingMessae = '';
            var SuccessMessage = '';
            if (type == 'add') {
                ProcessingMessae = 'Uploading ...';
                SuccessMessage = 'Document added successfully';
                UploadData.ExistingDocumentFileName = '';
            } else {
                ProcessingMessae = 'Changing...';
                SuccessMessage = 'Document updated successfully';
                UploadData.ExistingDocumentFileName = $scope.NewImageName;
            }
            UploadData.StaffMemberUid = $scope.UserData.StaffMemberUid;
            UploadData.ProofOfDocumentationPath = $scope.UserData.ProofOfDocumentationPath;
            var NewFileData = new FormData();
            var DocumentFileUpload = $('#singlefile').get(0);
            var DocFiles = DocumentFileUpload.files;
            if (DocFiles != undefined) {
                for (var i = 0; i < DocFiles.length; i++) {
                    NewFileData.append(DocFiles[i].name, DocFiles[i]);
                }
            }

            NewFileData.append('formObject', JSON.stringify(UploadData));
            $.ajax({
                url: Url,
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: NewFileData,
                success: function (result) {
                    if ($rootScope.CheckValid(result) && result.response == "100") {
                        if ($rootScope.CheckValid(result.NewList)) {
                            if (result.NewList.indexOf($scope.UserData.ImageUrl) != -1) {
                                result.NewList.splice(result.NewList.indexOf($scope.UserData.ImageUrl), 1);
                            }
                            UploadedFileNames = result.NewList;
                            $scope.DocumentFileNames = result.NewList;
                            $scope.docimages = UploadedFileNames;
                        }
                    }

                    $rootScope.Disable('btnChangeImage', null);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                    waitingDialog.hide();
                    $('#btnlayoutOk').hide();
                    $('#ppmsg').text(SuccessMessage);
                    $('#ppalert').modal('show');
                },
                error: function (err) {
                    waitingDialog.hide()
                }
            });
        } else {

        }
    }

    $scope.ViewNextImage = function () {
        $scope.NewImageName = $(event.currentTarget).attr('name');
        if ($rootScope.CheckValid($scope.NewImageName)) {
            $('#imageview-pagination').find('li a').removeClass('active-page');
            $scope.FilePath = '../Uploads/' + $scope.UserData.ProofOfDocumentationPath + "/" + $scope.NewImageName;
            $('#imageview-pagination').find('li a[name="' + $scope.NewImageName + '"]').addClass('active-page');
        }
    }

    $scope.AddUpdateDocument = function () {
        $('#operationtype').val($(event.currentTarget).attr('name'));
        $('#singlefile').click();
    }

    $scope.DeleteCurrentDocument = function () {
        $('#imageviewer').modal('hide');
        waitingDialog.show('Changing...');
        var UploadData = {};
        UploadData.ProofOfDocumentationPath = $scope.UserData.ProofOfDocumentationPath;
        UploadData.ExistingDocumentFileName = $scope.NewImageName;
        var NewFileData = new FormData();
        NewFileData.append('formObject', JSON.stringify(UploadData));
        var Url = $scope.BaseUrl + 'Registration/AddUpdateDeleteDocument';
        $.ajax({
            url: Url,
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: NewFileData,
            success: function (result) {
                if ($rootScope.CheckValid(result) && result.response == "100" || $rootScope.CheckValid(result) && result.response == "101") {
                    if ($rootScope.CheckValid(result.NewList)) {
                        if (result.NewList.indexOf($scope.UserData.ImageUrl) != -1) {
                            result.NewList.splice(result.NewList.indexOf($scope.UserData.ImageUrl), 1);
                        }
                        $scope.DocumentFileNames = result.NewList;
                        $scope.docimages = $scope.DocumentFileNames;
                    }
                }

                $rootScope.Disable('btnChangeImage', null);
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                    $scope.$digest();
                waitingDialog.hide();
                $('#btnlayoutOk').hide();
                $('#ppmsg').text('Document deleted successfully');
                $('#ppalert').modal('show');
            },
            error: function (err) {
                waitingDialog.hide()
                $('#ppalert').modal('hide');
            }
        });
    }

    $scope.SingleFileChange = function () {
        var files = $('#singlefile')[0].files;
        if ($rootScope.CheckValid(files)) {
            if (files && files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $scope.FilePath = e.target.result;
                    $scope.NewDocumentSelected = true;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                }

                reader.readAsDataURL(files[0]);
                $rootScope.Enable('btnChangeImage', null)
            }
        }
    }

    $scope.AddUpdateDocument = function () {
        $('#operationtype').val($(event.currentTarget).attr('name'));
        $('#singlefile').click();
    }
})