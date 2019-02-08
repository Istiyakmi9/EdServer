/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="angular.min.js" />
/// <reference path="layout.js" />


app.controller('timeTableCtrl', function ($scope, $ajax, $rootScope, $local) {

    $scope.TimetableDetail = [];
    $scope.SelectedSubject = '';
    $scope.SubjectList = [];
    $scope.FilteredFacultyDetail = [];
    $scope.FilteredSubjectNFaculty = null;
    $scope.SubjectName = null;
    $scope.RecordAvailable = 0;
    $scope.SearchResult = true;
    $scope.EnableNames = false;
    $scope.AllocatedFaculty = '';
    $scope.SelecedSection = '';
    $scope.VarifyAllocation = {
        TimetableUid: '',
        Period: -1,
        FacultyName: '',
        FacultyUid: '',
        SubjectName: '',
        SubjectUid: '',
        DayName: '',
        AdminId: ''
    };
    $scope.DefaultMessage = 'Please select class and section to get filtered result.';
    angular.element(document).ready(function () {
        if (Subject != undefined) {
            $scope.SubjectList = Subject.Table;
        }
        $scope.BindClass();
    });

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

    $scope.InitVerificationObject = function () {
        $scope.InitVerificationObject.TimetableUid = '';
        $scope.VarifyAllocation.Period = -1;
        $scope.VarifyAllocation.FacultyName = '';
        $scope.VarifyAllocation.FacultyUid = '';
        $scope.VarifyAllocation.SubjectName = '';
        $scope.VarifyAllocation.SubjectUid = '';
        $scope.VarifyAllocation.DayName = '';
    }

    $scope.ResetFilterResult = function () {
        $scope.TimetableDetail = [];
        $scope.RecordAvailable = 0;
        $scope.SearchResult = true;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    }

    $scope.FilterTimetable = function () {
        $scope.TimetableDetail = [];
        $('#loader').show();
        $('#timetable-body').addClass('blurin');
        var ClassDetailUid = $('#section').val();
        if (ClassDetailUid != null && ClassDetailUid != "") {
            var url = 'Events/TimetableByFilter?ClassDetailUid=' + ClassDetailUid;
            var $handler = $ajax.get(url, 'json');
            $handler.done(function (result) {
                if (result != null) {
                    var i = 0;
                    var Timetable = [];
                    var j = 0;
                    while (i < $rootScope.NameOfDays.length) {
                        if ($rootScope.NameOfDays[i] !== 'Sunday') {
                            if (result.length > i) {
                                Timetable = [];
                                if ($rootScope.NameOfDays.indexOf(result[i].DayName) != -1) {
                                    if (result[i].Data.length > 0) {
                                        Timetable = [];
                                        Timetable = $scope.FillWidthDefault(i);
                                        for (var index = 0; index < result[i].Data.length; index++) {
                                            var item = result[i].Data[index].ItemArray;
                                            var FacultyUid = '';
                                            if (item[2] != undefined || item[2] != null)
                                                FacultyUid = item[2];
                                            else
                                                FacultyUid = item[3];
                                            var ServerDataTimetable = {};
                                            ServerDataTimetable = {
                                                index: index + 1,
                                                alpahbet: '',
                                                DayName: $rootScope.NameOfDays[i],
                                                Period: index + 1,
                                                SubjectName: item[7],
                                                TeachName: (item[6] === 0 ? 'Mrs. ' : 'Mr. ') + item[5],
                                                TeachUid: FacultyUid,
                                                Date: new Date(),
                                                Duration: item.Duration != null ? item[11].toString() : '0' + ' Min',
                                                StartTime: item[9].substr(0, 5),
                                                EndTime: item[10].substr(0, 5),
                                                Substitutio: false,
                                                SubstitutedTeachName: '',
                                                SubstitutedTeachUid: '',
                                                TimetableUid: item[0],
                                                ClassDetailUid: item[1]
                                            };

                                            Timetable[index] = ServerDataTimetable;
                                        }
                                    } else {
                                        Timetable = $scope.FillWidthDefault(i);
                                    }
                                } else {
                                    Timetable = $scope.FillWidthDefault(i);
                                }

                                $scope.TimetableDetail.push(Timetable);
                            } else {
                                $scope.TimetableDetail.push($scope.FillWidthDefault(i));
                            }
                        }
                        i++;
                    }

                    $scope.RecordAvailable = 1;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                        $scope.$digest();

                    $('#timetable-body').removeClass('blurin');
                    $('#loader').hide();
                    $('#timetable-dv').fadeIn(500);
                }
            })

            $handler.fail(function (e, x) {
                $('#timetable-body').removeClass('blurin');
                $scope.SearchResult = false;
                $scope.DefaultMessage = 'Getting server error. Please retry again after sometime or contact to your provider.';
                $('#loader').hide();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                    $scope.$digest();
            })
        }
    }

    $scope.ShowOnlyLimitedDetail = function () {
        $('#time-table').find('div[name="full-info"]').fadeOut(500);
        $(event.currentTarget).closest('div').find('li').removeClass('anc-selected');
        $(event.currentTarget).closest('li').addClass('anc-selected');
    }

    $scope.ShowFullDetail = function () {
        $('#time-table').find('div[name="full-info"]').fadeIn(500);
        $(event.currentTarget).closest('div').find('li').removeClass('anc-selected');
        $(event.currentTarget).closest('li').addClass('anc-selected');
    }

    $scope.FillWidthDefault = function (index) {
        var Timetable = [];
        j = 0;
        while (j < 8) {
            Timetable.push({
                index: j + 1,
                alpahbet: '',
                DayName: $rootScope.NameOfDays[index],
                Period: j + 1,
                SubjectName: 'No Sub.',
                TeachName: 'Not Assigned',
                TeachUid: '',
                Date: '00/00/0001',
                Duration: '0 Min',
                StartTime: '00:00',
                EndTime: '00:00',
                Substitutio: false,
                SubstitutedTeachName: '',
                SubstitutedTeachUid: ''
            });
            j++;
        }

        return Timetable;
    }

    $scope.SelectFaculty = function () {
        if ($scope.SelectedSubject != '') {
            $('#faculty-sel-dv').find('select').removeAttr('disabled');
            if ($scope.FilteredSubjectNFaculty.Table1 != undefined && $scope.FilteredSubjectNFaculty.Table1.length > 0) {
                var i = 0;
                $scope.FilteredFacultyDetail = [];
                while (i < $scope.FilteredSubjectNFaculty.Table1.length) {
                    if (!$scope.EnableNames) {
                        if ($scope.FilteredSubjectNFaculty.Table1[i].subjects != null && $scope.FilteredSubjectNFaculty.Table1[i].subjects != '') {
                            if ($scope.FilteredSubjectNFaculty.Table1[i].subjects.indexOf($scope.SelectedSubject) != -1) {
                                var IsAvailable = false;
                                for (var j = 0; j < $scope.FilteredFacultyDetail.length; j++) {
                                    if ($scope.FilteredFacultyDetail[j].FacultyUid == $scope.FilteredSubjectNFaculty.Table1[i].StaffMemberUid) {
                                        IsAvailable = true;
                                        break;
                                    }

                                }

                                if (!IsAvailable) {
                                    $scope.FilteredFacultyDetail.push({
                                        FacultyUid: $scope.FilteredSubjectNFaculty.Table1[i].StaffMemberUid,
                                        FacultyName: $scope.FilteredSubjectNFaculty.Table1[i].FullName
                                    });
                                }
                            }
                        }
                    } else {
                        $scope.FilteredFacultyDetail.push({
                            FacultyUid: $scope.FilteredSubjectNFaculty.Table1[i].StaffMemberUid,
                            FacultyName: $scope.FilteredSubjectNFaculty.Table1[i].FullName
                        });
                    }
                    i++;
                }
            }
        }
    }

    $scope.Enableall = function () {
        $scope.SelectedSubject = '';
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    }

    $scope.ShowConfirmation = function () {
        $scope.VarifyAllocation.FacultyUid = $scope.AllocatedFaculty;
        $scope.VarifyAllocation.SubjectName = $('#subjectName option:selected').text().trim();
        $scope.VarifyAllocation.SubjectUid = $scope.SelectedSubject;
        $scope.VarifyAllocation.FacultyName = $('#facultName option:selected').text().trim();
        $scope.VarifyAllocation.ClassDetailUid = $scope.SelecedSection;

        $('#btnTimetableOk').addClass('dn');
        $('#btnTimetableAssign').removeClass('dn');
        $('#timetableMsg-selection').hide();
        $('#message-dv').fadeIn(500);
    }

    $scope.ConfirmChanges = function () {
        var message = 'Please wait we are working on it ...';
        waitingDialog.show(message);
        var Url = 'Events/AssignTeachNow';
        var $Ajax = $ajax.post(Url, JSON.stringify({ ObjAssignTeacher: $scope.VarifyAllocation }));
        $Ajax.done(function (result) {
            if (result != null) {
                var resultedData = parseInt(result);
                var Message = '';
                if (resultedData == 100 || resultedData == 101) {
                    Message = 'Timetable record updated successfully.';
                    $scope.FilterTimetable();
                } else {
                    Message = 'Fail to update Timetable. Please contact your admin.';
                }

                $('#ppmsg').text(Message);
                $('#ppalert').modal('show');
                waitingDialog.hide();
            }
        });

        $Ajax.fail(function (result) {
            waitingDialog.hide();
        });
    }

    $scope.ShowAddEditTimetable = function () {
        $scope.AllocatedFaculty = '';
        $scope.SelectedSubject = '';
        $('#btnTimetableOk').removeClass('dn');
        $('#btnTimetableAssign').addClass('dn');
        $('#timetableMsg-selection').show();
        $('#message-dv').hide();
        $scope.InitVerificationObject();
        $scope.VarifyAllocation.Period = $(event.currentTarget).closest('div').find('input[name="Period"]').val();
        $scope.VarifyAllocation.DayName = $(event.currentTarget).closest('div').find('input[name="DayName"]').val();
        $scope.VarifyAllocation.TimetableUid = $(event.currentTarget).closest('div').find('input[name="TimetableUid"]').val();

        var url = 'Events/GetFacultyWidthSubject?SubjectUid=';
        var $handler = $ajax.get(url, 'json');
        $handler.done(function (result) {
            if (result != null && result != "") {
                $scope.FilteredSubjectNFaculty = JSON.parse(result);
                $scope.SubjectName = $scope.FilteredSubjectNFaculty.Table;
            }

            $scope.VarifyAllocation
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
            $('#addTimetable').modal('show');
        })

        $handler.fail(function (error) {

        });
    }
});