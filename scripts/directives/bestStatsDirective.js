'use strict';

/**
 * @ngdoc function
 * @name qbPassTrends.directive:bestStats
 * @description
 * # Includes the bestStats template
 * Directive of qbPassTrends
 */
angular.module('qbPassTrends')
  .directive('bestStats', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/bestStats.html'
    };
  });