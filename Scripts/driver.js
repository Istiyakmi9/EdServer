/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('registerStaff', function ($scope, $rootScope, $ajax) {

    $scope.ddl = false;
    $scope.selecteFile = '';
    $scope.ppmsg = '';
    $scope.VehicleType = {};
    $scope.UserData = {};
    $scope.IsForModification = false;
    $scope.ImageUrl = '../images/user.png';
    $scope.DocFileDesc = 'Click here to upload your proof of documents.';
    $scope.ViewDocuments = false;
    $scope.FilePath = '../images/user.png';
    $scope.docimages = [];
    $scope.NewDocumentSelected = false;
    $scope.NewImageName = 1;
    $scope.DocumentFileNames = [];
    $scope.BaseUrl = 'http://' + window.location.hostname + '/EdServer/';

    angular.element(document).ready(function () {
        console.log('Registration started');
        $scope.BindVehicleType();
        $("#imageUrl").change(function () {
            $scope.readURL(this);
        });

        if (Data != undefined && Data != null && Data != '') {
            $scope.UserData = Data.Table[0];
            $scope.DocumentFileNames = UploadedFileNames;
            $scope.middleName = '';
            $scope.LastName = '';
            if ($scope.UserData != null && $scope.UserData != '') {

                if ($scope.UserData.LastName != null) {
                    if ($scope.UserData.LastName.trim().split(' ').length > 1) {
                        $scope.middleName = $scope.UserData.LastName.trim().split(' ')[0];
                        $scope.LastName = $scope.UserData.LastName.trim().substr($scope.UserData.LastName.trim().indexOf(' ')).trim();
                    } else {
                        $scope.LastName = $scope.UserData.LastName.trim();
                    }
                }

                $scope.StaffDob = new Date($scope.UserData.Dob).toLocaleString('en-US').replace(',', '');
                if ($scope.UserData.Gender == 1) {
                    $('#genderM').prop('checked', true).attr('checked', 'checked');
                    $('#genderF').prop('checked', false).removeAttr('checked');
                } else {
                    $('#genderM').prop('checked', false).removeAttr('checked');
                    $('#genderF').prop('checked', true).attr('checked', 'checked');
                }

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
            $rootScope.BindClassDetail();
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    })

    $scope.nextStep = function () {
        var step = $('#steps-reminder').val();
        var isvalid = $scope.GetFormData(step);
        if (isvalid) {
            $('#prevbtn').prop('disabled', false).removeAttr('disabled');
            if (step != 'step-2') {
                $('div[name="form-steps"]').removeClass('sn').addClass('dn');
                $('a[title="asteps"]').removeClass('selected').addClass('done');
            }
        }
        if (step == 'step-1') {
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

            if ($rootScope.CheckValid($scope.UserData.VehicleDetailId)) {
                $('#myTab').find('li').removeClass('active');
                $('#anc-driver-tab').closest('li').addClass('active');
                $('#myTabContent').find('div[role="tabpanel"]').removeClass('active in');
                $scope.ActiveDriver();
            } else {
                $('#myTab').find('li').removeClass('active');
                $('#anc-other-tab').closest('li').addClass('active');
                $('#myTabContent').find('div[role="tabpanel"]').removeClass('active in');
                $scope.ActiveOther();
            }
        } else if (step == 'step-3') {
            if (isvalid) {
                $('#step-4').removeClass('dn').addClass('sn');
                $('#steps-reminder').val('step-4');
                $('a[name="astep-4"]').removeClass('done').addClass('selected');
                $(event.currentTarget).prop('disabled', true).attr('disabled', 'disabled');
                $('#submitbtn').prop('disabled', false).removeAttr('disabled');
            }
        }
    }

    $scope.ValidateMobileInDb = function (mobileno, email) {
        var number = mobileno.replace(/-/g, '');
        var NewUrl = 'Registration/VerifyMobibleExist?Mobile=' + number + '&EmailId=' + email;
        var handler = $ajax.get(NewUrl, 'json');
        handler.done(function (result) {
            var data = JSON.parse(result);
            if (data == null || data.length == 0) {
                $('div[name="form-steps"]').removeClass('sn').addClass('dn');
                $('a[title="asteps"]').removeClass('selected').addClass('done');
                $('#step-3').removeClass('dn').addClass('sn');
                $('#steps-reminder').val('step-3');
                $('a[name="astep-3"]').removeClass('done').addClass('selected');
            } else {
                var Message = '';
                for (var i = 0; i < data.length; i++) {
                    if (data[i] == 'Mobile') {
                        $('#MobileNumber').css({ 'border': '1px solid red' });
                        Message = 'Mobile number';
                    } else if (data[i] == 'Email') {
                        $('#Email').css({ 'border': '1px solid red' });
                        Message = 'Email Id';
                    } else if (data[i] == 'Both') {
                        $('#MobileNumber').css({ 'border': '1px solid red' });
                        $('#Email').css({ 'border': '1px solid red' });
                        Message = 'Mobile number and Email Id';
                    }
                }

                Message += ' already exist.';
                alert(Message);
            }
        });

        handler.fail(function (error) {

        });
    }

    $scope.previousStep = function () {
        $('#nextbtn').prop('disabled', false).removeAttr('disabled');
        $('#submitbtn').prop('disabled', true).attr('disabled', 'disabled');
        $('div[name="form-steps"]').removeClass('sn').addClass('dn');
        $('a[title="asteps"]').removeClass('selected').addClass('done');
        var step = $('#steps-reminder').val();
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

    $scope.GetFormData = function (step) {

        var ErrorNames = [];
        if (step != '') {
            if (step == 'step-1') {
                if ($('#genderM').prop('checked'))
                    $scope.UserData.Gender = 'Male';
                else
                    $scope.UserData.Gender = 'Female';

                if ($('#FirstName').val().trim() != '')
                    $scope.UserData.FirstName = $('#FirstName').val();
                else
                    ErrorNames.push('FirstName');
                if ($('#LastName').val().trim() != '')
                    $scope.UserData.LastName = $('#MiddleName').val() + ' ' + $('#LastName').val();
                else
                    $scope.UserData.LastName = null;
                if ($('#Dob').val().trim() != '')
                    $scope.UserData.Dob = $('#Dob').val();
                else
                    ErrorNames.push('Dob');
            } else if (step == 'step-2') {
                if ($('#MobileNumber').val().trim() != '') {
                    var mobile = $('#MobileNumber').val().replace(/-/g, '');
                    if (mobile.length == 10)
                        $scope.UserData.MobileNumber = mobile;
                    else
                        ErrorNames.push('MobileNumber');
                } else
                    ErrorNames.push('MobileNumber');

                if ($('#AlternetNumber').val().trim() != '')
                    $scope.UserData.AlternetNumber = $('#AlternetNumber').val().replace(/-/g, '');

                if ($('#Email').val().trim() != '') {
                    var status = $rootScope.maskEmailId($('#Email').val());
                    if (status) {
                        $scope.UserData.Email = $('#Email').val();
                    }
                    else
                        ErrorNames.push('Email');
                } else
                    $scope.UserData.Email = null;

                if ($('#Address').val().trim() != '')
                    $scope.UserData.Address = $('#Address').val().trim();
                else
                    ErrorNames.push('Address');

                if ($('#State option:selected').val() != '')
                    $scope.UserData.State = $('#State option:selected').val();
                else
                    ErrorNames.push('State');

                if ($('#City option:selected').val() != '')
                    $scope.UserData.City = $('#City option:selected').val();
                else
                    ErrorNames.push('City');

                if ($('#Pincode').val().trim() != '')
                    $scope.UserData.Pincode = $('#Pincode').val();
                else
                    ErrorNames.push('Pincode');
            } else if (step == 'step-3') {
                if ($('#SchoolUniversityName').val().trim() != '')
                    $scope.UserData.SchoolUniversityName = $('#SchoolUniversityName').val();
                else
                    $scope.UserData.SchoolUniversityName = '';

                if ($('#togglable-designation').find('li.active').length > 0) {
                    var tabName = $('#togglable-designation').find('li.active > a').text();
                    if (tabName == 'Driver') {
                        if ($('#vehicletype').val().trim() != '')
                            $scope.UserData.VehicleTypeId = $('#vehicletype').val();
                        else
                            ErrorNames.push('vehicletype');

                        if ($('#vehicleno').val().trim() != '')
                            $scope.UserData.VehicleNumber = $('#vehicleno').val();
                        else
                            ErrorNames.push('vehicleno');

                        if ($('#VehicleRegistrationNo').val().trim() != '')
                            $scope.UserData.VehicleRegistrationNo = $('#VehicleRegistrationNo').val();
                        else
                            ErrorNames.push('VehicleRegistrationNo');
                    } else {
                        console.log('No check required in step 3');
                    }
                }

                if ($('#DegreeName').val().trim() != '')
                    $scope.UserData.DegreeName = $('#DegreeName').val();
                else
                    $scope.UserData.DegreeName = '';

                if ($('#Grade').val().trim() != '')
                    $scope.UserData.Grade = $('#Grade').val();
                else
                    $scope.UserData.Grade = '';

                if ($('#MarksObtain').val().trim() != '')
                    $scope.UserData.MarksObtain = $('#MarksObtain').val();
                else
                    $scope.UserData.MarksObtain = 0;

                $scope.UserData.ExprienceInYear = '0';
                $scope.UserData.ExperienceInMonth = '0';

                $('#Address').val($('#Address').val().trim());
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

    $scope.validateDD = function () {
        var attrId = $(event.currentTarget).attr('id');
        if ($('#' + attrId + ' option:selected').val() != '') {
            $('#' + attrId).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $scope.makeValideField = function () {
        if ($(event.currentTarget).attr('type') == 'select') {
            if ($(event.currentTarget).val() != '')
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

    $scope.finishApplication = function () {

        if ($('#selectedImageUrl').attr('src') == '../images/user.png') {
            $('#otherreg-text').text('Profile image is not selected. Press Save to register without image.');
            $scope.UserData.ImageUrl = '';
            $('#otherreg-pp').modal('show');
        } else {
            if ($scope.ImageUrl != null)
                $scope.UserData.ImageUrl = $scope.ImageUrl.replace('../Uploads/', '').trim();
            $scope.register();
        }
    }

    $scope.register = function () {

        $('#otherreg-pp').modal('hide');
        var message = 'Please wait registration is going on ...';
        waitingDialog.show(message);
        var fileUpload = $('#imageUrl').get(0);
        var files = fileUpload.files;

        // Create FormData object  
        var fileData = new FormData();

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
        if ($scope.UserData.Gender == 'Female')
            $scope.UserData.Gender = false;
        else
            $scope.UserData.Gender = true;

        fileData.append('formObject', JSON.stringify($scope.UserData));
        $scope.returnStatus = 0;
        $.ajax({
            url: '../Registration/DriverRegister',
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: fileData,
            success: function (result) {
                waitingDialog.hide();
                $scope.returnStatus = result;
                if (result == '100') {
                    $('#otherreg-text').text('Registration done successfully');
                    $('textarea').val('');
                    $('input').val('');
                    $('select').val(-1);
                    $('#step-1').removeClass('dn').addClass('sn');
                    $('#step-2').removeClass('sn').addClass('dn');
                    $('#step-3').removeClass('sn').addClass('dn');
                    $('#step-4').removeClass('sn').addClass('dn');
                    $('#steps-reminder').val('step-1');
                    $('a[title="asteps"]').removeClass('selected').addClass('done');
                    $('a[name="astep-1"]').removeClass('done').addClass('selected');
                    $('#submitbtn').prop('disabled', true).attr('disabled', 'disabled');
                    $('#nextbtn').prop('disabled', false).removeAttr('disabled');
                    $('#prevbtn').prop('disabled', true).attr('disabled', 'disabled');
                    location.href = '../Reports/Stuff';
                    $('#staffModalMsg').text('Registration done successfully');
                } else if (result == '101') {
                    $('#staffModalMsg').text('Update successfully');
                } else if (result == '500') {
                    $('#staffModalMsg').text('Mobile number already registered');
                } else {
                    $('#staffModalMsg').text('Unable to perform operation. Please contact admin.');
                }

                $('#facultyModal').modal('show');
            },
            error: function (err) {
                $('#staffModalMsg').text(err.statusText);
                $('#facultyModal').modal('show');
                waitingDialog.hide(message)
            }
        });
    }

    $scope.redirectOperation = function () {

        if ($scope.returnStatus == '100' || $scope.returnStatus == '101') {
            location.href = '../Reports/Stuff';
        } else {
            console.log('No insert or update');
        }
    }

    $scope.BindVehicleType = function () {
        $scope.VehicleType = {};
        var $handler = $ajax.get('AdminMaster/GetVehicleType', 'json');
        $handler.done((result) => {
            if (result != null) {
                $scope.VehicleType = JSON.parse(result).Table;
            } else {
                $('#otherreg-text').text('Not able to load VehicleTypes. Please contact admin.');
                $('#otherreg-pp').modal('show');
            }
        });

        $handler.fail((e, x) => {
            console.log(JSON.parse(e));
        })
    }

    $scope.showFiles = function () {
        alert($scope.selecteFile);
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
    }

    $scope.showFiles = function () {
        $('#imageUrl').click();
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

    $scope.AttachDocuments = function () {
        if ($scope.ViewDocuments)
            $scope.ShowDocumentPopup()
        else
            $('#documentUrl').click();
    }

    $scope.AddUpdateDocument = function () {
        $('#operationtype').val($(event.currentTarget).attr('name'));
        $('#singlefile').click();
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

    $scope.BindAttachForProfileImage = function () {
        if ($rootScope.CheckValid($('#imageUrl')[0].files))
            $scope.UserData.ProfileImageName = $('#imageUrl')[0].files[0].name;
    }

    $scope.ViewNextImage = function () {
        $scope.NewImageName = $(event.currentTarget).attr('name');
        if ($rootScope.CheckValid($scope.NewImageName)) {
            $('#imageview-pagination').find('li a').removeClass('active-page');
            $scope.FilePath = '../Uploads/' + $scope.UserData.ProofOfDocumentationPath + "/" + $scope.NewImageName;
            $('#imageview-pagination').find('li a[name="' + $scope.NewImageName + '"]').addClass('active-page');
        }
    }

    $scope.ActiveOther = function () {
        $('#vehicle-tab').removeClass('active in');
        $('#other-tab').addClass('active in');
    }

    $scope.ActiveDriver = function () {
        $('#other-tab').removeClass('active in');
        $('#vehicle-tab').addClass('active in');
    }
})