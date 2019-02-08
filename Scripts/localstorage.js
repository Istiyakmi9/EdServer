/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="layout.js" />
/// <reference path="angular.min.js" />


angular.module('localstorageservice', [])
    .service('$local', function () {
        this.put = function (key, value) {
            if (key != null && key != '' && value != null && value != '') {
                localStorage.setItem(key, JSON.stringify(value));
            }
        }

        this.get = function (key) {
            if (key != null && key != '') {
                var Data = localStorage.getItem(key);
                Data = JSON.parse(Data);
                if (Data != null && Data != '') {
                    return Data;
                } else {
                    return null;
                }
            }
        }

        this.clearall = function () {
            localStorage.clear();
        }
    });