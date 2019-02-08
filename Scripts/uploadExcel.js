/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

var fileDetail = {};
var uploadingDatetime = null;

(function (window) {
    function triggerCallback(e, callback) {
        if (!callback || typeof callback !== 'function') {
            return;
        }
        var files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        callback.call(null, files);
    }
    function makeDroppable(ele, callback) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('multiple', true);
        input.style.display = 'none';
        input.addEventListener('change', function (e) {
            triggerCallback(e, callback);
        });
        ele.appendChild(input);

        ele.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            ele.classList.add('dragover');
        });

        ele.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            ele.classList.remove('dragover');
        });

        ele.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            ele.classList.remove('dragover');
            triggerCallback(e, callback);
        });

        ele.addEventListener('click', function () {
            input.value = null;
            input.click();
        });
    }
    window.makeDroppable = makeDroppable;
})(this);
(function (window) {
    var dvFiles = $('.ifilezone');
    for (var i = 0; i < dvFiles.length; i++) {
        makeDroppable(dvFiles[i], function (files) {
            var fileData = new FormData();
            for (var i = 0; i < files.length; i++) {

                ExportToJson(files[i]);
            }
        });
    }
})(this);


function ExportToJson(file) {

    if (file.type.indexOf("image") != 0) {
        var size = (file.size / 1024).toString();
        fileDetail.size = size.substr(0, 5);
        fileDetail.name = file.name;
        uploadingDatetime = new Date().toLocaleString('en-us');

        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            workbook.SheetNames.forEach(function (sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                fileDetail.jsonObject = XL_row_object;
                BindExcelData();
            })
        }

        reader.readAsBinaryString(file);
    }
}

function BindExcelData() {
    var tagId = $('#uploadTabs').find('li[class="active"]').attr('name');
    $('#' + tagId).find('div[name="imgdv"]').css({ 'visibility': 'hidden' });
    $('#' + tagId).find('div[name="imgdv"]').hide(500);
    $('#' + tagId).find('div[name="ifilezone"]').css({ 'margin-top': '20px' });
    $('#' + tagId).find('div[name="ifilezone"]').find('span').hide(400);
    $('div[name="ifilezone"]').css({ 'background-image': 'none' });
    $('#' + tagId).find('div[name="uploading"]').find('div[name="filesize"]').text(fileDetail.size);
    $('#' + tagId).find('div[name="uploading"]').find('div[name="filename"]').text(fileDetail.name);
    $('#' + tagId).find('div[name="uploading"]').find('div[name="uploadingdatetime"]').text(uploadingDatetime);
    $('#' + tagId).find('div[name="uploading"]').find('div[name="noofrecords"]').text(fileDetail.jsonObject.length);
    $('#' + tagId).find('div[name="uploading"]').show(500);
    $('#' + tagId).find('div[name="imgdv"]').css({ 'visibility': 'visible' });
}

app.controller('uploadexcel', function ($scope, $rootScope, $ajax, $local) {
    $scope.AttendenceArray = {};
    angular.element(document).ready(function () { });
    $scope.ClassDetail = $local.get('masterdata');

    $scope.DoPreProcessing = function () {
        var TabValidationMessage = '';
        var activeTab = $('#uploadTabs').find('li[class="active"]').attr('name');
        if (activeTab == 'studentattendencedata') {
            if ($('#Class option:selected').val() == '') {
                TabValidationMessage = ' Class';
                $('#Class').css({ 'border': '2px solid red' });
                $('#section').css({ 'border': '2px solid red' });
                event.stopPropagation();
                event.preventDefault();
            }
            if ($('#section option:selected').val() == '') {
                TabValidationMessage = ' Section';
                $('#Class').css({ 'border': '2px solid red' });
                $('#section').css({ 'border': '2px solid red' });
                event.stopPropagation();
                event.preventDefault();
            }

            $('#errorSpanMsg').show().fadeOut(10000);
        }
    }

    $scope.BackToNormal = function () {
        $('#section').removeAttr('style');
    }

    $scope.ConvertToXml = function () {
        var xmlData = fileDetail.jsonObject;
        var xmlFields = '<field id="{{name}}">{{data}}</field>';
        var xmlContent = '';
        var xmlContentRow = '';
        var columnName = '';
        var columnCount = Object.keys(xmlData[0]).length;
        for (var i = 0; i < xmlData.length; i++) {
            for (var j = 0; j < columnCount; j++) {
                columnName = Object.keys(xmlData[i])[j];
                xmlContent += xmlFields.replace('{{name}}', columnName)
                    .replace('{{data}}', xmlData[i][columnName]);
            }

            xmlContent += xmlFields.replace('{{name}}', 'CreatedBy')
                .replace('{{data}}', $scope.ClassDetail.UserObj.UserId);
            xmlContentRow += '<row>' + xmlContent + '</row>';
            xmlContent = '';
        }

        return '<?xml version="1.0"?>' + xmlContentRow;
    }

    $scope.ConvertToStudentRegistrationXml = function () {
        var xmlData = fileDetail.jsonObject;
        var xmlFields = '<field id="{{name}}">{{data}}</field>';
        var xmlContent = '';
        var xmlContentRow = '';
        var columnName = '';
        var columnCount = Object.keys(xmlData[0]).length;
        var firstName = '';
        var lastName = '';
        var data = '';
        for (var i = 0; i < xmlData.length; i++) {
            for (var j = 0; j < columnCount; j++) {
                columnName = Object.keys(xmlData[i])[j];
                data = '';
                if (columnName == 'Student name') {
                    data = xmlData[i][columnName];
                    if (data.split(' ').length > 1) {
                        firstName = data.split(' ')[0].trim();
                        lastName = data.slice(data.indexOf(' ')).trim();
                        xmlContent += xmlFields.replace('{{name}}', 'StudentFirstName')
                            .replace('{{data}}', firstName);
                        xmlContent += xmlFields.replace('{{name}}', 'StudentLastName')
                            .replace('{{data}}', lastName);
                    }
                } else if (columnName == 'Father name') {
                    data = xmlData[i][columnName];
                    if (data.split(' ').length > 1) {
                        firstName = data.split(' ')[0].trim();
                        lastName = data.slice(data.indexOf(' ')).trim();
                    } else if (data.split(' ').length > 1) {
                        firstName = data;
                        lastName = null;
                    }

                    xmlContent += xmlFields.replace('{{name}}', 'FatherFirstName')
                        .replace('{{data}}', firstName);
                    xmlContent += xmlFields.replace('{{name}}', 'FatherLastName')
                        .replace('{{data}}', lastName);
                } else if (columnName == 'Mother name') {
                    data = xmlData[i][columnName];
                    if (data.split(' ').length > 1) {
                        firstName = data.split(' ')[0].trim();
                        lastName = data.slice(data.indexOf(' ')).trim();
                    } else if (data.split(' ').length == 1) {
                        firstName = data;
                        lastName = null;
                    } else {
                        firstName = null;
                        lastName = null;
                    }

                    xmlContent += xmlFields.replace('{{name}}', 'MotherFirstName')
                        .replace('{{data}}', firstName);
                    xmlContent += xmlFields.replace('{{name}}', 'MotherLastName')
                        .replace('{{data}}', lastName);
                } else {
                    xmlContent += xmlFields.replace('{{name}}', columnName)
                        .replace('{{data}}', xmlData[i][columnName]);
                }
            }

            xmlContentRow += '<row>' + xmlContent + '</row>';
            xmlContent = '';
        }

        return '<?xml version="1.0"?>' + xmlContentRow;
    }

    $scope.uploadFacultyDetail = function () {
        event.stopPropagation();
        var xml = $scope.ConvertToXml();
        var Parameter = {
            xmlData: xml,
            schoolTenentId: $scope.ClassDetail.UserObj.schooltenentId,
            AdminId: $scope.ClassDetail.UserObj.UserId
        };
        $scope.PostData('UploadExcel/UploadFacultyDetail', Parameter);
    }

    $scope.uploadStudentDetail = function () {
        event.stopPropagation();
        var xml = $scope.ConvertToStudentRegistrationXml();
        var Parameter = {
            xmlData: xml,
            schoolTenentId: $scope.ClassDetail.UserObj.schooltenentId,
            AdminId: $scope.ClassDetail.UserObj.UserId
        };
        $scope.PostData('UploadExcel/UploadStudentDetail', Parameter);
    }

    $scope.ConvertToAttendence = function () {
        var data = fileDetail.jsonObject;
        var NewObject = {};
        var DataArray = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = 1; j <= 31; j++) {
                if (fileDetail.jsonObject[i]['Day' + j] != undefined) {
                    if (fileDetail.jsonObject[i]['Day' + j].toLowerCase() == 'p')
                        NewObject['Day' + j] = '1';
                    else
                        NewObject['Day' + j] = '0';
                } else {
                    NewObject['Day' + j] = '-1';
                }
            }
            NewObject['RollNo'] = fileDetail.jsonObject[i]['RollNo'];
            NewObject['Class'] = fileDetail.jsonObject[i]['Class'];
            NewObject['Section'] = fileDetail.jsonObject[i]['Section'];
            var AttedenceDate = fileDetail.jsonObject[i]['Year-Month'];
            if (AttedenceDate == undefined || AttedenceDate == null)
                AttedenceDate = fileDetail.jsonObject[i]['AttdenceMonthYear'];
            if (AttedenceDate.split('-').length == 2) {
                NewObject['AttdenceMonthYear'] = AttedenceDate.split('-')[0] + '-' + AttedenceDate.split('-')[1] + '-' + '1';
            } else {
                return false;
            }
            DataArray.push(NewObject);
            NewObject = {};
        }
        fileDetail.jsonObject = DataArray;
        DataArray = [];
        return true;
    }

    $scope.uploadStudentAttendenceDetail = function () {
        event.stopPropagation();
        if (Object.keys(fileDetail.jsonObject[0]).length >= 30) {
            if ($scope.ConvertToAttendence()) {
                var xml = $scope.ConvertToXml();
                var Parameter = {
                    xmlData: xml,
                    schoolTenentId: $scope.ClassDetail.UserObj.schooltenentId,
                    ClassDetailId: $('#section option:selected').val()
                };
                $scope.PostData('UploadExcel/UploadStudentAttendenceDetail', Parameter);
            } else {
                alert('Excel sheet is not in correct format.');
            }
        } else {
            alert('Column length: ' + Object.keys(fileDetail.jsonObject[0]).length);
        }
    }

    $scope.uploadClassDetail = function () {
        event.stopPropagation();
        var xml = $scope.ConvertToXml();
        var Parameter = {
            xmlData: xml,
            schoolTenentId: $scope.ClassDetail.UserObj.schooltenentId
        };
        $scope.PostData('UploadExcel/UploadClassDetail', Parameter);
    }

    $scope.PostData = function (controllerLocation, Parameter) {
        var message = 'Uploading excel sheet wait ...';
        waitingDialog.show(message)

        var $handler = $ajax.post(controllerLocation, JSON.stringify(Parameter));
        $handler.done(function (result) {
            waitingDialog.hide();
            if (result.indexOf('ERROR:') == -1) {
                if (result != 'Fail') {
                    $('#ppmsg').text('Record uploaded successfully. ' + result);
                    $('#ppalert').modal('show');
                    $scope.BackInitState();
                } else {
                    $('#Class').val('');
                    $('#section').val('');
                    $('#ppmsg').text('Fail to upload record. Please contact your adminstrator.');
                    $('#ppalert').modal('show');
                }
            } else {
                $('#Class').val('');
                $('#section').val('');
                $('#ppmsg').text(result);
                $('#ppalert').modal('show');
            }
        });

        $handler.fail(function (e, ex) {
            waitingDialog.hide();
            $('#ppmsg').text('Fail to upload record. Please contact your adminstrator.');
            $('#ppalert').modal('show');
        });
    }

    $scope.InitTabs = function () {
        fileDetail = {};
        $scope.BackInitState();
        var excelPath = $(event.currentTarget).attr('file');
        $('#andDownloadxlsx').attr('href', '../Excel/' + excelPath + '.xlsx');
    }

    $scope.BackInitState = function () {
        var tagId = $('#uploadTabs').find('li[class="active"]').attr('name');
        $('#' + tagId).find('div[name="imgdv"]').css({ 'visibility': 'visible' });
        $('#' + tagId).find('div[name="imgdv"]').show(500);
        $('#' + tagId).find('div[name="ifilezone"]').css({ 'margin-top': 'initial' });
        $('#' + tagId).find('div[name="ifilezone"]').find('span').show(400);
        $('#' + tagId).find('div[name="uploading"]').hide(500);
        $('#' + tagId).find('div[name="uploading"]').find('div[name="filesize"]').text('');
        $('#' + tagId).find('div[name="uploading"]').find('div[name="filename"]').text('');
        $('#' + tagId).find('div[name="uploading"]').find('div[name="uploadingdatetime"]').text('');
        $('#' + tagId).find('div[name="uploading"]').find('div[name="noofrecords"]').text('');
        $('div[name="ifilezone"]').css({ 'background-image': 'url(../images/drop-back.png)' });
    }
});