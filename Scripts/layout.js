/// <reference path="angular.js" />
/// <reference path="localstorage.js" />

var paginul = '<ul class="pagination page-ul">\
                    <li class="paginate_button previous {{prev-flag}}" id="datatable_previous">\
                        <a href="javascript:void(0)" style="width: 70px !important;" pageindex="{{previous}}" ng-click="getPreviousPage({{previous}})" tabindex="{{previous}}">Previous</a>\
                    </li>\
                    {{pages}}\
                    <li class="paginate_button {{nextflag}}" id="datatable_next">\
                        <a href="javascript:void(0)" style="width: 48px !important;" pageindex="{{next}}" ng-click="getNewPage({{next}})" tabindex="{{next}}">Next</a>\
                    </li>\
                </ul>';


//if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
//    $scope.$digest();

//========================= Call Paging like below ===========================

//$rootScope.pagination({
//    total: $scope.total,
//    pageno: 1
//}, true);

var app = angular.module('eds', ['service', 'localstorageservice']);
app.controller('layoutController', function ($scope, $rootScope, $compile, $ajax, $local) {
    $rootScope.UserObj = null;
    $rootScope.alertRedirectUrl = null;
    $rootScope.formpatentId = '';
    $rootScope.ServerId = 'EdServer';
    $rootScope.GlobalSectionDetail = []
    $scope.GlobalClassDetail = []
    $scope.TimerInterval = null;
    $scope.ElapsedTime = 0;
    $rootScope.NameOfMonths = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    $scope.UserBO = {
        FirstName: 'Anonymous',
        LastName: 'User',
        EmailId: 'example@gmail.com',
        Mobile: '+91-0000000000',
        AccedemicStartYear: 0,
        AffilationNo: "",
        City: "",
        FullAddress: "",
        LicenseNo: "",
        Occupation: "",
        SchoolName: "",
        State: "",
        UserId: "",
        UserPassword: "",
        schooltenentId: "",
    }

    $rootScope.NameOfDays = ["Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday", "Sunday"];

    angular.element(document).ready(function () {
        var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
            $BODY = $('body'),
            $MENU_TOGGLE = $('#menu_toggle'),
            $SIDEBAR_MENU = $('#sidebar-menu'),
            $SIDEBAR_FOOTER = $('.sidebar-footer'),
            $LEFT_COL = $('.left_col'),
            $RIGHT_COL = $('.right_col'),
            $NAV_MENU = $('.nav_menu'),
            $FOOTER = $('footer');

        $('#fadeloadscreen').hide();
        $scope.HandleSideMenuBar();
        $scope.BindPageLoadAction();
        $scope.BindLayoutData();
        //$rootScope.BindClassDetail();
    });

    $scope.BindLayoutData = function () {
        $scope.UserBO = $rootScope.GetValue('userobj');
        if ($scope.UserBO != null && $scope.UserBO != "") {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
                $scope.$digest();
        }
    }

    $rootScope.HideDynamicContent = function () {
        $('.dynamic').hide();
    }

    $rootScope.CloseDynamic = function () {
        $('div[name="selection-dd"]').addClass('dn')
    }

    $scope.BindPageLoadAction = function () {
        var $Action = $('#sidebar-menu').find('a[title="action"]');
        $Action.on('click', function () {
            $rootScope.GotoNewUrl();
        })
    }

    $rootScope.GotoNewUrl = function () {
        $('#fadeloadscreen').show();
        setTimeout(function () {
            return true;
        }, 500)
    }

    $scope.HandleSideMenuBar = function () {

        $SIDEBAR_MENU.find('a').on('click', function (ev) {
            console.log('clicked - sidebar_menu');
            var $li = $(this).parent();

            if ($li.attr('name') != 'menu_section') {
                if ($li.is('.active')) {
                    $li.removeClass('active active-sm');
                    $('ul:first', $li).slideUp(function () {
                        $scope.setContentHeight();
                    });
                } else {
                    // prevent closing menu if we are on child menu
                    if (!$li.parent().is('.child_menu')) {
                        $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                        $SIDEBAR_MENU.find('li ul').slideUp();
                    } else {
                        if ($BODY.is(".nav-sm")) {
                            $SIDEBAR_MENU.find("li").removeClass("active active-sm");
                            $SIDEBAR_MENU.find("li ul").slideUp();
                        }
                    }
                    $li.addClass('active');

                    $('ul:first', $li).slideDown(function () {
                        $scope.setContentHeight();
                    });
                }
            }
        });

        // toggle small or large menu 
        $MENU_TOGGLE.on('click', function () {
            console.log('clicked - menu toggle');

            if ($BODY.hasClass('nav-md')) {
                $SIDEBAR_MENU.find('li.active ul').hide();
                $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
                $('#menu-scroller').addClass('menu-small');
            } else {
                $SIDEBAR_MENU.find('li.active-sm ul').show();
                $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
                $('#menu-scroller').removeClass('menu-small');
            }

            $BODY.toggleClass('nav-md nav-sm');

            $scope.setContentHeight();

            $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
        });

        $('#sidebar-menu').find('div[name="menu-child"]').hide();
        var URL = '..' + (window.location.pathname.split('?')[0]);
        $SIDEBAR_MENU.find('a[href="' + URL + '"]').closest('div[name="menu-child"]').show();
        $SIDEBAR_MENU.find('a[href="' + URL + '"]').parent('li').addClass('current-page');

        $SIDEBAR_MENU.find('a').filter(function () {
            return this.href == CURRENT_URL;
        }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
            $scope.setContentHeight();
        }).parent().addClass('active');
    }

    $scope.setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $rootScope.pagination = function (pagingData, isForword) {
        $scope.recordDetail = pagingData;
        var previous = 0;
        var next = 0;
        var prevflag = '';
        var flag = '';
        var pageCounter = 0;
        var activeindex = 0;
        // When total record is less then or equals to 50 items
        if ($scope.recordDetail.total <= 50) {
            pageCounter = 1;
            activeindex = $scope.recordDetail.pageno;
            previous = 0;
            next = 6;
            prevflag = 'disabled';
            flag = 'disabled';
            if ($scope.recordDetail.total > 50)
                flag = 'enabled';
        } else {    // Else total item is more then 50
            if (isForword) {
                pageCounter = $scope.recordDetail.pageno;
                activeindex = pageCounter;
                previous = parseInt(($scope.recordDetail.pageno - 1) / 5) * 5;
                if ($scope.recordDetail.pageno > 5)
                    prevflag = 'enabled';
                else
                    prevflag = 'disabled';

                if ((previous * 10 + 50) <= $scope.recordDetail.total) {
                    next = previous + 6;
                    flag = 'enabled';
                } else {
                    next = previous + 1;
                    flag = 'disabled';
                }
            } else {
                if ($scope.recordDetail.pageno > 5) {
                    previous = $scope.recordDetail.pageno - 5;
                    prevflag = 'enabled';
                } else {
                    previous = 0;
                    prevflag = 'disabled';
                }
                if (((previous) * 10 + 50) <= $scope.recordDetail.total) {
                    next = previous + 6;
                    flag = 'enabled';
                } else {
                    next = previous + 0;
                    flag = 'disabled';
                }
                pageCounter = previous + 1;
                activeindex = pageCounter;
            }
        }

        var total = $scope.recordDetail.total;
        var indextag = '<li class="paginate_button" id="datatable_page">\
                            <a href="javascript:void(0)" ng-click="getNewPage({{pagenumber}})" class="{{pageclass}}" pageindex="{{pagenumber}}" tabindex="0">{{pagenumber}}</a>\
                        </li>';
        var indextagTemplate = '';

        if (total <= 10) {
            indextagTemplate += indextag.replace(/{{pagenumber}}/g, '1');
        } else {

            var j = pageCounter;
            var indexPosition = parseInt(pageCounter / 5);
            var modular = pageCounter % 5;

            if (modular > 0) {
                j = (5 * indexPosition) + 1;
            } else {
                j = (5 * (indexPosition - 1) + 1);
            }

            var tag = '';
            var i = (j - 1) * 10;
            for (; i <= total; j++) {
                tag = indextag;
                if (j == activeindex)
                    tag = tag.replace('{{pageclass}}', 'active-page');
                else
                    tag = tag.replace('{{pageclass}}', 'inactive-page');

                if (j % 5 != 0) {
                    tag = tag.replace(/{{pagenumber}}/g, j);
                    indextagTemplate += tag;
                    i = i + 10;
                } else {
                    tag = tag.replace(/{{pagenumber}}/g, j);
                    indextagTemplate += tag;
                    break;
                }
            }
        }

        var template = paginul.replace('{{pages}}', indextagTemplate)
            .replace('{{prev-flag}}', prevflag)
            .replace(/{{previous}}/g, previous)
            .replace('{{nextflag}}', flag)
            .replace(/{{next}}/g, next);

        $('#paging-dv').empty();
        $('#paging-dv').append($compile(template)($scope))

        if (prevflag == 'disabled')
            $('#datatable_previous').find('a').attr('disabled', 'disabled').prop('disabled', true);
        else
            $('#datatable_previous').find('a').removeAttr('disabled').prop('disabled', false);

        if (flag == 'disabled')
            $('#datatable_next').find('a').attr('disabled', 'disabled').prop('disabled', true);
        else
            $('#datatable_next').find('a').removeAttr('disabled').prop('disabled', false);

        $scope.fromCount = 0;
        $scope.toCount = 0;
        $scope.fromCount = (activeindex * 10) - 9;
        $scope.toCount = activeindex * 10;
        if ($scope.toCount > $scope.recordDetail.total)
            $scope.toCount = $scope.recordDetail.total;
        if ($scope.toCount == 0)
            $scope.fromCount = 0;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();

        waitingDialog.hide();
    }

    $rootScope.BindClassDetail = function () {
        var $deffer = $.Deferred();
        $scope.GlobalClassDetail = [];
        var handler = $ajax.get('Registration/ListClasses', 'json');
        handler.done(function (result) {
            if (result != null && result != "") {
                var classRecord = JSON.parse(result);
                for (var i = 0; i < classRecord.length; i++) {
                    if ($scope.GlobalClassDetail.length > 0) {
                        for (var j = 0; j < $scope.GlobalClassDetail.length; j++) {
                            if ($scope.GlobalClassDetail[j].Class == classRecord[i].Class) {
                                var SectionArray = $scope.GlobalClassDetail[j].Sections;
                                SectionArray.push({
                                    section: classRecord[i].Section,
                                    ClassDetailId: classRecord[i].ClassDetailId
                                });
                                $scope.GlobalClassDetail[j].Sections = SectionArray;
                            } else {
                                $scope.GlobalClassDetail.push({
                                    Class: classRecord[i].Class,
                                    Sections: new Array({
                                        section: classRecord[i].Section,
                                        ClassDetailId: classRecord[i].ClassDetailId
                                    })
                                });
                                break;
                            }
                        }
                    } else {
                        $scope.GlobalClassDetail.push({
                            Class: classRecord[i].Class,
                            Sections: new Array({
                                section: classRecord[i].Section,
                                ClassDetailId: classRecord[i].ClassDetailId
                            })
                        });
                    }
                }
            }

            var UniqueClasses = [];
            $.each($scope.GlobalClassDetail, function (i, el) {
                if ($.inArray(el.Class, UniqueClasses) === -1) UniqueClasses.push(el.Class);
            });

            $scope.GlobalClassSectionResult = {
                uniqueClass: UniqueClasses,
                classDetail: $scope.GlobalClassDetail
            };

            $deffer.resolve($scope.GlobalClassSectionResult);
        });

        handler.fail(function (e, x) {
            console.log('fail');
            $deffer.reject(e);
        });

        return $deffer.promise();
    }

    $rootScope.BindSelectedSection = function () {
        $('#section').removeAttr('disabled');
        var selectedClass = $('#Class option:selected').val();
        $rootScope.GlobalSectionDetail = [];
        for (var i = 0; i < $scope.GlobalClassSectionResult.classDetail.length; i++) {
            if ($scope.GlobalClassSectionResult.classDetail[i].Class == selectedClass) {
                $rootScope.GlobalSectionDetail = $scope.GlobalClassSectionResult.classDetail[i].Sections;
                break;
            }
        }

        $('#Class').removeAttr('style');
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$digest();
    }

    $rootScope.maskmobile = function () {
        if ($(event.currentTarget).val().length < 12) {
            if ($(event.currentTarget).val().length == 3 || $(event.currentTarget).val().length == 7)
                $(event.currentTarget).val($(event.currentTarget).val() + '-');

            if (event.keyCode < 48 || event.keyCode > 57) {
                $(event.currentTarget).closest('div').next().css({ 'display': 'block' });
                event.preventDefault();
            } else if (event.keyCode == 8) {
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            } else {
                //$(event.currentTarget).closest('div').next().css({ 'display': 'none' });
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            }

        } else {
            event.preventDefault();
        }
    }

    $rootScope.validateDropDown = function () {
        if ($(event.currentTarget).val().trim() != '') {
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $rootScope.validateInput = function (e) {
        if (e == null || e == '') {
            if ($(event.currentTarget).val().length > 0) {
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            }
        } else {
            if ($(e).val().length > 0) {
                $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
            }
        }
    }

    $rootScope.maskEmailId = function (mobile) {
        var status = false;
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mobile))
            status = true;
        return status;
    }

    $rootScope.maskPincode = function () {
        if ($(event.currentTarget).val().length > 5) {
            event.preventDefault();
        } else if ($(event.currentTarget).val().length == 5) {
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $rootScope.maskDropDown = function () {
        var elementId = $(event.currentTarget).attr('id');
        if ($('#' + elementId + ' option:selected').val() != '') {
            $('#' + elementId).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $rootScope.maskDateTime = function () {
        if (new Date($('#Dob').val()) != 'Invalid Date') {
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $rootScope.maskTextBox = function () {
        if ($(event.currentTarget).val().trim() != '') {
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)', 'background-color': '#fff' });
        }
    }

    $rootScope.OnlyFloat = function () {
        if ($(event.currentTarget).val().trim().length < 10) {
            if (event.keyCode == 46) {
                if ($(event.currentTarget).val().trim().indexOf('.') != -1) {
                    event.preventDefault();
                }
            } else if (event.keyCode < 48 || event.keyCode > 57) {
                event.preventDefault();
            }
        } else {
            event.preventDefault();
        }
    }

    $rootScope.OnlyNumber = function () {
        if (event.keyCode < 48 || event.keyCode > 57) {
            event.preventDefault();
        }
    }

    $rootScope.Money = function () {
        if ($(event.currentTarget).val().indexOf('.') == -1) {
            if (event.keyCode < 48 || event.keyCode > 57) {
                if (event.keyCode != 46) {
                    event.preventDefault();
                }
            }
        }
    }

    $rootScope.confirmAndRedirect = function () {

        if ($rootScope.alertRedirectUrl != null && $rootScope.alertRedirectUrl != '') {
            $('#ppalert').modal('hide');
            location.href = $rootScope.alertRedirectUrl;
        } else if ($rootScope.formpatentId != '') {
            $rootScope.resetall($rootScope.formpatentId);
        }
    }

    $rootScope.ValidateFields = function (UserObject) {
        var index = 0;
        var tagId = '';
        var Error = 0;
        while (index < Object.keys(UserObject).length) {
            tagId = Object.keys(UserObject)[index];
            if ($('#' + tagId).attr('validate') != undefined && $('#' + tagId).attr('validate') == '1') {
                if ($('#' + tagId).val() == null || $('#' + tagId).val().trim() == '') {
                    $('#' + tagId).css({ 'border': '1px solid red' });
                    Error++;
                }
            }
            index++;
        }
        return Error;
    }

    $rootScope.resetall = function (ParentId) {
        var InputFields = $('#' + ParentId).find('input[type="text"]');
        if (InputFields.length > 0) {
            InputFields.each(function (index, elem) {
                $(elem).val('');
            })
        }

        InputFields = $('#' + ParentId).find('input[type="number"]');
        if (InputFields.length > 0) {
            InputFields.each(function (index, elem) {
                $(elem).val('');
            })
        }

        InputFields = $('#' + ParentId).find('input[type="password"]');
        if (InputFields.length > 0) {
            InputFields.each(function (index, elem) {
                $(elem).val('');
            })
        }

        InputFields = $('#' + ParentId).find('select');
        if (InputFields.length > 0) {
            InputFields.each(function (index, elem) {
                var ElemId = $(elem).attr('id');
                $('#' + ElemId + ' option[value="-1"]').attr('selected', 'selected').prop('selected', true)
            })
        }
    }

    $scope.toggeldv = function () {
        $(event.currentTarget).removeClass('active');
        var elem = $(event.currentTarget).closest('div[name="menu_section"]').find('div[name="menu-child"]')
        if (elem.css('display') == 'none') {
            elem.slideDown(500);
            elem.find('ul').css({ 'display': 'block !important' })
            elem.addClass('active');
        } else {
            elem.slideUp(500);
        }
    }

    $rootScope.BlurIn = function (Name, Type) {
        if (Type == 'class') {
            $('.' + Name).removeClass('blurout');
            $('.' + Name).addClass('blurin');
        } else if (Type == 'id') {
            $('.' + Name).removeClass('blurout');
            $('#' + Name).addClass('blurin');
        } else {
            $('.' + Name).removeClass('blurout');
            $(Name).addClass('blurin');
        }
    }

    $rootScope.ToggleMultiDropdown = function () {
        if ($(event.currentTarget).next().hasClass('dn')) {
            $(event.currentTarget).next().removeClass('dn');
        } else {
            $(event.currentTarget).next().addClass('dn');
        }
        $('#custom-multiselect-option').css({ 'border': '1px solid #d9d9d9' });
    }

    $scope.closeMdd = function () {
        $('#custom-multiselect-option').find('div[name="body-dv"]').addClass('dn');
    }

    $rootScope.ConvertToMultiSelect = function (Id) {
        var template = `<div id="custom-multiselect-option" ng-mouseleave="closeMdd()" class="col-md-3 col-sm-6 col-xs-12 multi-parent-dv" name="multi" style="width: 92%;z-index: 1000;">
                            <div class="select-filter" ng-click="ToggleMultiDropdown()">
                                <span name="default-value">Selected values</span>
                            </div>
                            <div name="body-dv" class="multi-table-content dn">
                                <table>
                                    <tbody>
                                        {{TD}}
                                    </tbody>
                                </table>
                            </div>
                        </div>`;

        var row = `<tr>
                    <td>
                      <div ng-click="SelectMultiOptions()">
                          <input type="hidden" value="{{Value}}" />
                          <p>{{Text}}</p>
                          <i class="fa fa-check dn"></i>
                      </div>
                    </td>
                   </tr>`;

        var BindingRow = [];
        var BindingTemplate = template;
        $('#' + Id + ' option').each(function () {
            BindingRow += row.replace('{{Value}}', $(this).val()).replace('{{Text}}', $(this).text().trim());
        })

        BindingTemplate = BindingTemplate.replace('{{TD}}', BindingRow);
        $('#' + Id).after($compile(BindingTemplate)($scope));
        $('#' + Id).addClass('dn');
    }

    $rootScope.SelectMultiOptions = function () {
        if ($(event.currentTarget).find('i').hasClass('dn')) {
            $(event.currentTarget).find('i').removeClass('dn');
            var Data = $(event.currentTarget).find('p').text().trim();
            var value = $(event.currentTarget).find('input[type="hidden"]').val();
            var $field = $(event.currentTarget).closest('div[name="multi"]').find('div[class="select-filter"]');
            $field.find('span[name="default-value"]').addClass('dn');
            $field.append($compile('<span active="1" name="' + value + '">' + Data + '<i class="fa fa-times" ng-click="RemoveMe()"></i></span>')($scope))
        } else {
            $(event.currentTarget).find('i').addClass('dn')
            var value = $(event.currentTarget).find('input[type="hidden"]').val();
            var $filter = $(event.currentTarget).closest('div[name="multi"]').find('div[class="select-filter"]');
            $filter.find('span[name="' + value + '"]').remove();
            if ($filter.find('span').length == 1) {
                $filter.find('span[name="default-value"]').removeClass('dn');
            }
        }
    }

    $rootScope.RemoveMe = function () {
        var $filter = $(event.currentTarget).closest('div');
        var Value = $(event.currentTarget).closest('span').attr('name');
        $(event.currentTarget).closest('span').remove();
        $('#custom-multiselect-option').find('input[type="hidden"][value="' + Value + '"]').closest('div').find('i').addClass('dn');
        if ($filter.find('span').length == 1) {
            $filter.find('span[name="default-value"]').removeClass('dn');
        }
    }

    $rootScope.BlurOut = function (Name, Type) {
        if (Type == 'class') {
            $('.' + Name).removeClass('blurin');
            $('.' + Name).addClass('blurout');
        } else if (Type == 'id') {
            $('.' + Name).removeClass('blurin');
            $('#' + Name).addClass('blurout');
        } else {
            $('.' + Name).removeClass('blurin');
            $(Name).addClass('blurout');
        }
    }

    $rootScope.ValidateMobileNo = function (MobileNumber) {
        var Flag = false;
        if (MobileNumber != undefined && MobileNumber != null && MobileNumber != '') {
            var mobile = MobileNumber.replace(/-/g, '').trim();
            if (mobile.length > 10) {
                if (mobile.indexOf('+91') == 0) {
                    Flag = /^([0|\+[0-9]{1,5})?([1-9][0-9]{9})$/.test(mobile)
                } else {
                    Flag = false;
                }
            } else {
                Flag = /^([0|\+[0-9]{1,5})?([1-9][0-9]{9})$/.test(mobile)
            }
        }
        return Flag;
    }

    $rootScope.FormateToDateTime = function (NewDate) {
        var FormatedDate = null;
        if (NewDate != undefined && NewDate != null && NewDate != '') {
            if (typeof NewDate != "object") {
                if (NewDate.indexOf('/') != -1 && false) {
                    // Date formate is in mm/dd/YYYY or dd/mm/YYYY or any other but --/--/----

                    //new Date($('#Dob').val()).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })
                } else if (NewDate.indexOf('-') != -1 && false) {
                    // Date formate is in mm-dd-YYYY or dd-mm-YYYY or any other but xx-xx-xxxx
                } else {
                    FormatedDate = new Date(NewDate).toLocaleDateString('en-US');
                }
            } else {
                FormatedDate = new Date(NewDate).toLocaleDateString('en-US');
            }
        } else {
            FormatedDate = NewDate;
        }
        return FormatedDate;
    }

    $rootScope.validateField = function () {
        if ($(event.currentTarget).length > 0) {
            $(event.currentTarget).css({ 'border': '1px solid rgb(204, 204, 204)' });
        }
    }

    $rootScope.OnlyChar = function () {
        var tonghValue = $('#mothertongue').val();
        $rootScope.validateField(tonghValue, event);
        var filter = /^[a-zA-Z]*$/;
        if (!filter.test(event.key)) {
            event.returnValue = false;
            event.preventDefault();
        }
    }

    $rootScope.CheckValid = function (variable) {
        var Flag = false;
        if (variable != undefined && variable != null && variable != "")
            Flag = true;
        return Flag;
    }

    $rootScope.GetDefault = function (Data) {
        if (!$rootScope.CheckValid(Data))
            Data = "";
        return Data;
    }

    $rootScope.RemovePageInit = function () {
        $('body, document').find('.page-init').removeClass('page-init');
    }

    $rootScope.GetKeys = function (NewObject) {
        var Keys = [];
        if (typeof NewObject == "object") {
            Keys = Object.keys(NewObject);
        }
        return Keys;
    }

    $rootScope.Disable = function (Id, $FilteredObject) {
        if ($rootScope.CheckValid($FilteredObject)) {
            $FilteredObject.attr('disabled').prop('disabled', true);
            $FilteredObject.css({ 'pointer-events': 'none' });
        } else {
            $('#' + Id).attr('disabled', true).prop('disabled', true);
            $('#' + Id).css({ 'pointer-events': 'none' });
        }
    }

    $rootScope.Enable = function (Id, $FilteredObject) {
        if ($rootScope.CheckValid($FilteredObject)) {
            $FilteredObject.removeAttr('disabled').prop('disabled', false);
            $FilteredObject.css({ 'pointer-events': 'auto' });
        } else {
            $('#' + Id).removeAttr('disabled').prop('disabled', false);
            $('#' + Id).css({ 'pointer-events': 'auto' });
        }
    }

    $rootScope.GetSections = function (Class) {
        var SectionDetail = [];
        var ClassDetail = $local.get('masterdata');
        if (typeof ClassDetail != "undefined" && ClassDetail != null) {
            ClassDetail = ClassDetail.ClassDescription
            if (typeof ClassDetail != "undefined" && ClassDetail != null) {
                var len = ClassDetail.length;
                var index = 0;
                while (index < len) {
                    if (ClassDetail[index].Class == Class) {
                        SectionDetail.push({
                            Section: ClassDetail[index].Section,
                            ClassDetailId: ClassDetail[index].ClassDetailId
                        });
                    }
                    index++;
                }
            }
        }
        return SectionDetail;
    }

    $rootScope.GetValue = function (key) {
        var CurrentObject = null;
        var Data = $local.get('masterdata');
        if (typeof Data != 'undefined' && Data != null) {
            var Fields = Object.keys(Data);
            var index = 0;
            while (index < Fields.length) {
                if (Fields[index].toLocaleLowerCase() == key.toLocaleLowerCase()) {
                    CurrentObject = Data[Fields[index]];
                    break;
                }
                index++;
            }
        }
        return CurrentObject;
    }

    $scope.LogoutUser = function () {
        location.href = location.origin;
    }

    /*---------------------------------------------------------------------------  Common methods ----------------------------------------------------------------- */

    $rootScope.RemoveErrorBorder = function () {
        $(event.currentTarget).removeClass('error-field');
    }

    $rootScope.ShowMessage = function (Message, RedirectUrl) {
        $('#ppmsg').text(Message);
        $('#ppalert').modal('show');
        if (typeof RedirectUrl != "undefined" && RedirectUrl != null && RedirectUrl != "") {
            location.href = RedirectUrl;
        }
    }

    $rootScope.HideMessage = function () {
        $('#ppalert').modal('hide');
    }

    $rootScope.IsValid = function (Data) {
        var Flag = false;
        if (Data != null) {
            var Type = typeof Data;
            if (Type == 'string') {
                if (Data.trim() != '')
                    Flag = true;
            } else if (Type == 'object') {
                if (Data instanceof Array) {
                    if (Data.length > 0)
                        Flag = true;
                } else {
                    if (Object.keys(Data).length > 0)
                        Flag = true;
                }
            }
        }
        return Flag;
    }

    $rootScope.ShowLoader = function () {
        $scope.ElapsedTime = 0;
        var Hrs = 0;
        var Mins = 0
        var Secs = 0;
        var Value = '';

        $scope.TimerInterval = setInterval(function () {
            $('#timer').removeAttr('style');
            $scope.ElapsedTime = $scope.ElapsedTime + 1;
            Secs = $scope.ElapsedTime < 10 ? '0' + $scope.ElapsedTime : $scope.ElapsedTime;
            if ($scope.ElapsedTime > 59) {
                $scope.ElapsedTime = 0;
                Mins = Mins + 1;
                if (Mins > 59) {
                    Mins = 0;
                    Hrs = Hrs + 1;
                }
            }

            Value = (Hrs < 10 ? '0' + Hrs : Hrs) + ':' + (Mins < 10 ? '0' + Mins : Mins) + ':' + Secs;
            $('#timer').text(Value);
            if (Mins >= 3) {
                $rootScope.HideLoader(true);
            }
        }, 998);
        $('#loader').modal('show');
    }

    $rootScope.HideLoader = function (Flag) {
        if (Flag) {
            $('#timer').text('More than 3 mins over.').css({ 'color': 'red', 'font-weight': 'bold' });
            clearInterval($scope.TimerInterval);
            setTimeout(function () {
                $('#timer').text('00:00:00');
                $('#loader').modal('hide');
            });
        } else {
            if ($scope.TimerInterval != undefined && $scope.TimerInterval != null)
                clearInterval($scope.TimerInterval);
            $('#timer').text('00:00:00');
            $('#loader').modal('hide');
        }
    }

    $rootScope.IsValidResponse = function (Data) {
        var IsValidResult = false;
        if (Data != null && Data != "") {
            var Result = Data;
            if (Result instanceof Array) {
                if (Result.length > 0) {
                    if (Result[0] != "EMPTY") {
                        IsValidResult = true;
                    }
                }
            } else {
                IsValidResult = $rootScope.IsValid(Data);
            }
        }
        return IsValidResult;
    }

    $rootScope.ShowToast = function (Message, ElapsedTime) {
        var ElapsedTimeRemaining = 2000;
        if (typeof ElapsedTime != 'undefined' && ElapsedTime != null && ElapsedTime != '') {
            if (ElapsedTime == -1)
                ElapsedTimeRemaining = 100000000000000000000;
            else
                ElapsedTimeRemaining = ElapsedTime;
        }

        if ($('#toast-dv').length > 0) {
            $('#toast-text').text(Message);
            $('#toast-dv').fadeIn();
        } else {
            var ToastTemplate = `<div id="toast-dv" class="toast">
                                <div id="toast-text">${Message}</div>
                             </div>`;

            $('body').append(ToastTemplate);
        }
        setTimeout(function () {
            $('#toast-dv').fadeOut();
        }, ElapsedTimeRemaining);
    }

    /*---------------------------------------------------------------------------  Common methods ends ------------------------------------------------------------- */
})