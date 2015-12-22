'use strict';

/**
 * @ngdoc function
 * @name qbPassTrends.directive:topTiles
 * @description
 * # Includes the topTiles template
 * Directive of qbPassTrends
 */
angular.module('qbPassTrends')
  .directive('topTiles', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/partials/topTiles.html'
    };
  });