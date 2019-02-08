/// <reference path="angular.js" />
/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="layout.js" />

app.controller('invoiceCtrl', function ($scope, $ajax) {

    $scope.printInvoice = function () {
        $('#invoice-sec').printThis();
    }
});