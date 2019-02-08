/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="layout.js" />
/// <reference path="angular.min.js" />


angular.module('service', [])
    .constant('server', { baseurl: 'http://' + window.location.hostname + '/', expiredafter: 60000 })
    .service('$ajax', ['server', '$MenuActivator', function (server, $MenuActivator) {

        this.post = function (url, param, resultType) {

            var responseType = 'json';
            var cookie = $MenuActivator.GetSessionToken();
            if (resultType != undefined && resultType != "")
                responseType = resultType;
            var defer = $.Deferred();
            var xhr = $.ajax({

                url: server.baseurl + url,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("x-request-token", cookie)
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: 'post',
                dataType: responseType,
                data: param,
                async: true,
                cache: false,
                timeout: server.expiredafter,
                success: function (result, e, x) {
                    console.log('[Server call] url : ' + url);
                    var Headers = x.getAllResponseHeaders().split('\n');
                    if (Headers.length > 0) {
                        var i = 0;
                        var cookie = null;
                        while (i < Headers.length) {
                            cookie = Headers[i].split(': ');
                            if (cookie.length > 0) {
                                if (cookie[0].trim() == 'x-request-token') {
                                    $('#token-txt').val(cookie[1].trim());
                                    break;
                                }
                            }
                            i++;
                        }
                    }
                    defer.resolve(result);
                },
                error: function (e, x) {

                    console.log('[Server call] url : ' + url + ', Error : ' + e.statusText + ' , ' + x);
                    if (e.statusText == 'timeout') {
                        xhr.abort();
                    }
                    defer.reject(e);
                }
            });

            return defer.promise();
        }

        this.get = function (url, dataType) {
            var cookie = $MenuActivator.GetSessionToken();
            var defer = $.Deferred();
            var xhr = $.ajax({
                url: server.baseurl + url,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("x-request-token", cookie)
                },
                type: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: dataType,
                contentType: 'application/json; charset=utf-8;',
                timeout: server.expiredafter,
                success: function (result, e, x) {
                    console.log('[Server call] url : ' + url + ', Result : success');
                    var Headers = x.getAllResponseHeaders().split('\n');
                    if (Headers.length > 0) {
                        var i = 0;
                        var cookie = null;
                        while (i < Headers.length) {
                            cookie = Headers[i].split(': ');
                            if (cookie.length > 0) {
                                if (cookie[0].trim() == 'x-request-token') {
                                    $('#token-txt').val(cookie[1].trim());
                                    break;
                                }
                            }
                            i++;
                        }
                    }
                    defer.resolve(result);
                },
                error: function (e, x) {

                    console.log('[Server call] url : ' + url + ', Error : ' + e.statusText + ' , ' + x);
                    if (e.statusText == 'timeout') {
                        xhr.abort();
                    }
                    defer.reject(e);
                }
            });

            return defer.promise();
        }
    }])

    .service('$MenuActivator', function () {

        this.ActivateMenu = function (menuName) {
            $('a[tag-title="menu"]').removeClass('active');
            if (menuName != undefined)
                $('a[name="' + menuName + '"]').addClass('active');
            else
                $('a[name="home"]').addClass('active');
        }
        this.GetSessionToken = function () {
            var currentcookie = "";
            currentcookie = $('#token-txt').val();
            if (currentcookie == undefined || currentcookie == null || currentcookie == "") {
                var CookieList = document.cookie.split(';');
                var i = 0;
                while (i < CookieList.length) {
                    if (CookieList[i] != null && CookieList[i] != '') {
                        var cookie = CookieList[i].split('=');
                        if (cookie.length > 0) {
                            if (cookie[0] == 'x-request-token') {
                                currentcookie = cookie[1];
                                $('#token-txt').val(cookie[1]);
                            }
                        }
                    }
                    i++;
                }
            }
            return currentcookie;
        }
    })

    .filter('$defaultValue', function () {
        return function (input) {
            var Default = 'NA';
            if (input != undefined && input != null && input != "")
                Default = input;
            return Default;
        }
    })