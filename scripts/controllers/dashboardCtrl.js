'use strict';

/**
 * @ngdoc function
 * @name qbPassTrends.controller:dashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of qbPassTrends
 */

angular.module('qbPassTrends')
    .controller('dashboardCtrl', ['$scope', 'qbService',
        function ($scope, qbService) {
            
            var defaultQBId = 1870523;
            
            //used for the Quarterback menu
            $scope.qbMenuList = [
               { playerName: 'Tom Brady', playerId:defaultQBId },
               { playerName: 'Tony Romo', playerId:1949528 },
               { playerName: 'Andy Dalton', playerId:2223207 }
            ];
            
            //load the view with initial info
            $scope.init = function () {
               $scope.loadQBStats(defaultQBId);
            };
            
            //retrieve the qb stats from the json files
            $scope.loadQBStats = function (qbId) {
                 qbService.getQBData(qbId)
                    .success(function (d) {
                        $scope.qbData = d;
                        var qbStats = qbService.mergeData($scope.qbData);
                        // use the returned promise to display qb stats
                        $scope.populateProfileInfo(qbStats);
                        $scope.populateTopTileStats(qbStats);
                        $scope.setLineChartDataPoints(qbStats);
                        $scope.populateMaxGameStats(qbStats);
                    })
                    .error (function() {
                       console.log("Error retrieving quarterback data");
                    });
            };
            
            $scope.populateProfileInfo = function (qbStats) {
                if(!qbService.isEmpty(qbStats)) {
                  
                    $scope.profileInfo = {
                        "playerId" : qbStats[0].playerId,
                        "playerName" : qbStats[0].fullName,
                        "profileImgUrl" : qbStats[0].playerImage,
                        "playerTeam" : qbStats[0].team,
                        "playerTeamImgUrl" : qbStats[0].teamImage
                    };
                    
                } else {
                    console.log("dashboardCtrl.populateProfileInfo unable to find qbStats");
                }
            };
            
            //top tiles show the most recent qb stats from the data
            $scope.populateTopTileStats = function (qbStats) {
               if(!qbService.isEmpty($scope.qbData) && !qbService.isEmpty(qbStats)) { 
                   $scope.recentWeekStats = qbStats[qbStats.length -1];
               } else {
                    console.log("dashboardCtrl.populateTopTileStats unable to find qbStats");
                }
            };
             
            $scope.populateMaxGameStats = function (qbStats) {
                if(!qbService.isEmpty(qbStats)) {
                    var maxStats = {
                        "passingYards" : 'PsYds',
                        "passingTds"  :  'PsTD'
                    };
                                        
                    $scope.maxPassYdsGame = qbService.findMaxValueByStat(qbStats, maxStats.passingYards);
                    $scope.maxPassTdsGame = qbService.findMaxValueByStat(qbStats, maxStats.passingTds);
                    $scope.totalCmpPct = qbService.getTotalCmpPct(qbStats);
                    $scope.totalCompletions = qbService.getTotalCompletions(qbStats);
                    $scope.totalAttempts = qbService.getTotalAttempts(qbStats);
                    $scope.totalPassingYards = qbService.getTotalPassingYards(qbStats);
                    $scope.totalRushYds = qbService.getTotalRushingYards(qbStats);
                    $scope.totalRushTds = qbService.getTotalRushingTds(qbStats);
                    
                    $scope.allTimeTotals = {
                        'totalCmpPct': $scope.totalCmpPct,
                        'totalCompletions' : $scope.totalCompletions,
                        'totalAttempts' : $scope.totalAttempts,
                        'totalPassYds' : $scope.totalPassingYards,
                        'totalRushingYds': $scope.totalRushYds,
                        'totalRushingTds' : $scope.totalRushTds
                    };                    
                } else {
                    console.log("dashboardCtrl.populateMaxGameStats unable to find qbStats");
                }
            },
            
            $scope.setLineChartDataPoints = function (qbStats) {
                if(!qbService.isEmpty(qbStats)) {
                   $scope.data = qbService.mapAllTimeStats(qbStats);
                  
                   $scope.options = {
                      lineMode: "bundle",
                      axes: {
                           x: {
                               type:"date"
                           }
                      },
                      series: [
                        {
                          y: "val_0",
                          label: "Yd/Att",
                          color: "#e377c2"
                        },
                        {
                          y: "val_1",
                          label: "Cmp%",
                          axis: "y2",
                          color: "#7f7f7f"
                        }
                      ],
                       tooltip: {
                          mode: "scrubber",
                           formatter: function(x, y, series) {
                               return moment(x).format("l") + ' : ' + y;
                           }
                       }
                    };
                    $scope.data.forEach(function(row) {
                        row.x = new Date(row.x);
                    });
                   
                } else {
                    console.log("dashboardCtrl.setLineChartDataPoints unable to find qbStats");
                }
                
            };
            
            $scope.init();
            

        }]);