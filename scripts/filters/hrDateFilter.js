'use strict';

/**
 * @ngdoc function
 * @name qbPassTrends.filter:hrDateFilter
 * @description
 * # human readable date
 * Filter of qbPassTrends
 */

angular.module('qbPassTrends')
    .filter('hrDate', function () {
            return function (input) {
                return moment(input).format('l');
            };
        });