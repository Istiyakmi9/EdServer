/// <reference path="angular.js" />

var ajax = angular.module('ajaxservice', [])
.service('$ajax', function () {
    this.doGet = function (url) {

        var defer = $.Deferred();
        $.ajax({

            url: url,
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'get',
            dataType: 'json',
            async: true,
            cache: false,
            timeout: 30000,
            success: function (result) {

                defer.resolve(result);
            },
            error: function (e, x) {

                defer.reject(e);
            }
        });

        return defer.promise();
    };

    this.doPost = function (url, param) {

        var defer = $.Deferred();
        $.ajax({

            url: url,
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(param),
            async: true,
            cache: false,
            timeout: 30000,
            success: function (result) {

                defer.resolve(result);
            },
            error: function (e, x) {

                defer.reject(e);
            }
        });

        return defer.promise();
    }
})