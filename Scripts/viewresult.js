/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />


app.controller('viewresult', function ($scope, $rootScope, $ajax) {

    $scope.ResultData = [];
    $scope.studentDetail = null;
    $scope.Paramter = {};
    $scope.ImagePath = null;

    angular.element(document).ready(function () {
        //$scope.BindClass().then((result) => {
        //    $scope.ResultSet = result;
        //    $scope.classDetail = $scope.ResultSet.classDetail;
        //    $scope.UniqueClass = $scope.ResultSet.uniqueClass;
        //});

        $scope.total = 11;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
        //if (Data != null && Data != "") {
        //$scope.record = Data.Table;
        //$scope.total = Data.Table1[0].Total;
        //$scope.BindTable($scope.record);
        $rootScope.pagination({
            total: $scope.total,
            pageno: 1
        }, true);
        //}
    });

    $scope.printResult = function () {
        $('#regview').printThis();
    }

    $scope.BackToNormal = function () {
        $('#section').removeAttr('style');
    }

    $scope.bindSection = function () {
        $('#section').removeAttr('disabled');
        var selectedClass = $('#Class option:selected').val();
        $scope.sectionDetail = [];
        for (var i = 0; i < $scope.classDetail.length; i++) {
            if ($scope.classDetail[i].Class == selectedClass) {
                $scope.sectionDetail = $scope.classDetail[i].Sections;
                break;
            }
        }

        $('#Class').removeAttr('style');
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    }

    $scope.getResult = function () {
        if ($scope.validateFields()) {
            $('#spn-msg').hide();
            $('#spinner').show();
            $scope.backToDefault();
            var $handler = $ajax.post('Result/GetResultByRegId', JSON.stringify($scope.Paramter));
            $handler.done(function (data) {
                var result = JSON.parse(data);

                if (result.Table.length > 0) {
                    $scope.StudentResult = result.Table;
                    var SingleRecord = result.Table[0];
                    $scope.PersonalDetail = {};
                    $scope.PersonalDetail.StudentName = SingleRecord.StudentName;
                    $scope.PersonalDetail.MotherName = SingleRecord.MotherName;
                    $scope.PersonalDetail.registrationNo = SingleRecord.registrationNo;
                    $scope.PersonalDetail.sex = SingleRecord.sex == 0 ? 'Female' : 'Male';
                    $scope.PersonalDetail.age = SingleRecord.age;
                    $scope.PersonalDetail.ImageUrl = SingleRecord.ImageUrl;
                    $scope.PersonalDetail.FatherName = SingleRecord.FatherName;
                    $scope.PersonalDetail.FatherMobileno = SingleRecord.FatherMobileno;
                    $scope.PersonalDetail.Dob = SingleRecord.Dob;
                    $scope.PersonalDetail.ClassSection = SingleRecord.ClassSection;
                    $scope.PersonalDetail.RollNo = 0;
                    $scope.PersonalDetail.BillNo = 'RK000989';

                    var Flag = false;
                    $scope.ExamResult = [];
                    if ($scope.ExamResult.length == 0)
                        Flag = true;
                    for (var i = 0; i < $scope.StudentResult.length; i++) {
                        for (var j = 0; j < $scope.ExamResult.length; j++) {
                            if ($scope.ExamResult[j].SubjectName == $scope.StudentResult[i].SubjectName) {
                                var ExistingItem = $scope.ExamResult[j];
                                if (ExistingItem.FirstTerm == 0)
                                    ExistingItem.FirstTerm = $scope.StudentResult[i].ExamId == 100 ? $scope.StudentResult[i].MarksObtained : 0;
                                if (ExistingItem.SecondTerm == 0)
                                    ExistingItem.SecondTerm = $scope.StudentResult[i].ExamId == 201 ? $scope.StudentResult[i].MarksObtained : 0;
                                if (ExistingItem.ThirdTerm == 0)
                                    ExistingItem.ThirdTerm = $scope.StudentResult[i].ExamId == 301 ? $scope.StudentResult[i].MarksObtained : 0;
                                if (ExistingItem.HalfYearly == 0)
                                    ExistingItem.HalfYearly = $scope.StudentResult[i].ExamId == 200 ? $scope.StudentResult[i].MarksObtained : 0;
                                if (ExistingItem.Final == 0)
                                    ExistingItem.Final = $scope.StudentResult[i].ExamId == 300 ? $scope.StudentResult[i].MarksObtained : 0;
                                $scope.ExamResult[j] = ExistingItem;
                                Flag = false;
                                break;
                            }
                        }
                        if (Flag) {
                            $scope.ExamResult.push({
                                SubjectName: $scope.StudentResult[i].SubjectName,
                                FirstTerm: $scope.StudentResult[i].ExamId == 100 ? $scope.StudentResult[i].MarksObtained : 0,
                                SecondTerm: $scope.StudentResult[i].ExamId == 201 ? $scope.StudentResult[i].MarksObtained : 0,
                                ThirdTerm: $scope.StudentResult[i].ExamId == 301 ? $scope.StudentResult[i].MarksObtained : 0,
                                HalfYearly: $scope.StudentResult[i].ExamId == 200 ? $scope.StudentResult[i].MarksObtained : 0,
                                Final: $scope.StudentResult[i].ExamId == 300 ? $scope.StudentResult[i].MarksObtained : 0
                            });
                        }
                    }

                    if ($scope.PersonalDetail.ImagePath == null)
                        $scope.ImagePath = '../images/picture.png';
                    else
                        $scope.ImagePath = '../Uploads/' + $scope.PersonalDetail.ImagePath;


                    $('#spinner').hide();
                    $('#default-dv').fadeOut();
                    $('#regview').fadeIn(500);
                    setTimeout(function () {
                        $('html, body').animate({
                            scrollTop: $('#regview').offset().top
                        }, 500, 'linear');
                    }, 600);
                } else {
                    $('#ppmsg').text('Unable to get result. Please check your detail or contact to adminstrator.');
                    $('#ppalert').modal('show');
                }


                //if (Object.keys(result).length == 2) {
                //    $scope.studentDetail = null;
                //    var isAvailable = false;
                //    $scope.examresult = {};
                //    $scope.ResultData = [];
                //    if (result[[Object.keys(result)[1]]].length > 0 && result[[Object.keys(result)[1]]].length > 0) {
                //        var resultData = result[[Object.keys(result)[1]]];
                //        $scope.studentDetail = result[[Object.keys(result)[0]]][0];
                //        var len = Object.keys(resultData[0]).length;
                //        var name = '';
                //        for (var i = 0; i < len; i++) {
                //            name = Object.keys(resultData[0])[i];
                //            if (resultData[0][name] != null) {
                //                isAvailable = true;
                //                $scope.examresult[Object.keys(resultData[0])[i]] = resultData[0][name];
                //                if (name.toLowerCase() != 'classdetailid' && name.toLowerCase() != 'examid' && name.toLowerCase() != 'examresultid' &&
                //                    name.toLowerCase() != 'acedimicyearfrom' && name.toLowerCase() != 'schooltenentid' &&
                //                    name.toLowerCase() != 'studentuid' && name.toLowerCase() != 'class') {
                //                    $scope.ResultData.push({
                //                        name: name,
                //                        value: resultData[0][name]
                //                    });
                //                }
                //            }
                //        }

                //        if (isAvailable) {
                //            $('#spinner').hide();
                //            $('#default-dv').fadeOut();
                //            $('#regview').fadeIn(500);
                //            setTimeout(function () {
                //                $('html, body').animate({
                //                    scrollTop: $('#regview').offset().top
                //                }, 500, 'linear');
                //            }, 600);
                //        }
                //    } else {
                //        $scope.backToDefault();
                //        $('#ppmsg').text('Not able to find result for Registration No.: ' + $scope.Paramter.RegistrationNo);
                //        $('#ppalert').modal('show');
                //    }
                //} else {
                //    $('#ppmsg').text('Unable to get result. Please check your detail or contact to adminstrator.');
                //    $('#ppalert').modal('show');
                //}

                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                    $scope.$digest();
            });

            $handler.fail(function (result) {
                $('#spinner').hide();
                $('#default-dv').fadeIn(500);
                $('#ppmsg').text('Unable to get result. Please check your detail or contact to adminstrator.');
                $('#ppalert').modal('show');
            });
        }
    }

    $scope.findStudent = function () {

        if ($(event.currentTarget).val().trim().length > 0)
            $(event.currentTarget).css({ 'border': '1px solid #ccc' });

        if ($(event.currentTarget).val().trim().length >= 3) {
            $(event.currentTarget).attr('disabled', 'disabled');
            var $rootDiv = $(event.currentTarget).closest('div[name="filter-dv"]');
            $rootDiv.find('div[name="showStudentList"]').show();
            $rootDiv.find('div[name="loaderdv"]').show();
            var userEvent = event.currentTarget;

            var url = 'Registration/GetStudentList?RegistrationNo=' + $(event.currentTarget).val().trim() + '&CompleteReg=' + false;
            var handler = $ajax.get(url, 'json');
            handler.done(function (result) {
                if (result != null && result != '') {
                    $scope.SiblingDetail = JSON.parse(result);
                    $rootDiv.find('div[name="loaderdv"]').hide();
                    $rootDiv.find('table[name="showStudenttable"]').fadeIn(500);
                    $(userEvent).removeAttr('disabled');
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();
                }
            });

            handler.fail(function (e, x) {
                console.log('fail');
            });
        }
    }

    $scope.BackAcademicYearToInit = function () {
        if ($('#acedimicyear option:selected').val() != '')
            $(event.currentTarget).css({ 'border': '1px solid #ccc' });
    }

    $scope.BackExamTypeToInit = function () {
        if ($('#examid option:selected').val() != '')
            $(event.currentTarget).css({ 'border': '1px solid #ccc' });
    }

    $scope.validateFields = function () {
        var ErrorIds = [];
        if ($('#regno').val().trim() == '')
            ErrorIds.push('regno');
        else
            $scope.Paramter.RegistrationNo = $('#regno').val().trim();

        if ($('#examid option:selected').val() == '')
            $scope.Paramter.ExamId = null;
        else
            $scope.Paramter.ExamId = $('#examid option:selected').val();

        if ($('#acedimicyear option:selected').val().trim() == '')
            ErrorIds.push('acedimicyear');
        else
            $scope.Paramter.AcedimicYearFrom = $('#acedimicyear option:selected').val().trim();

        if (ErrorIds.length > 0) {
            for (var i = 0; i < ErrorIds.length; i++) {
                $('#' + ErrorIds[i]).css({ 'border': '2px solid red' });
            }
            $('#errorMsgdv').show();
            $('#errorMsgdv').fadeOut(5000);
            return false;
        } else {
            return true;
        }
    }

    $scope.backToDefault = function () {
        event.preventDefault();
        event.stopPropagation();
        $scope.ResultData = [];
        $scope.studentDetail = null;
        $('#spinner').hide();
        $('#regview').fadeOut();
        $('#default-dv').fadeIn();
        $('#spn-msg').fadeIn(500);
        setTimeout(function () {
            $('html, body').animate({
                scrollTop: $('#dropcontainer').offset().top
            }, 500, 'linear');
        }, 600);

        $('#examid').val('');
        $('#acedimicyear').val('');
        $('#regno').val('');
    }

    $scope.selectStudent = function () {
        var RegDetail = $(event.currentTarget).find('td:nth-child(1)').text().split('-');
        if (RegDetail != null && RegDetail.length == 2) {
            var Name = RegDetail[0].trim()
            var RegNo = RegDetail[1].replace(/\[ /g, '').replace(/\ ]/g, '').trim()
            $('#regno').val(RegNo);
            $('div[name="showStudentList"]').fadeOut(500);
        }
    }
})