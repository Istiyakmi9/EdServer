/// <reference path="angular.js" />
/// <reference path="layout.js" />
/// <reference path="ajaxcall.js" />
/// <reference path="jquery-3.3.1.min.js" />

app.controller('addGoodsItemCtrl', function ($scope, $rootScope, $ajax) {

    $scope.goods = {};
    angular.element(document).ready(function () {

    });

    $scope.SubmitForm = function () {
        console.log(JSON.stringify($scope.goods));
    }
})