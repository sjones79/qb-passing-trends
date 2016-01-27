'use strict';

/**
 * @ngdoc function
 * @name qbPassTrends.service:qbService
 * @description
 * # qbService
 * Service of qbPassTrends
 */

angular.module('qbPassTrends').factory('qbService', ['$http', '$filter',
        function ($http, $filter) {
            
            return {
                isEmpty: function (input) {
                    return (input === undefined || input === null || input === '');
                },
                
                mergeData: function (data) {
                    // construct a JSON object list of the data
                    var mergedDataList = [];
                    
                    if(!this.isEmpty(data)) {
                      var dataHeaders = data.header;
                      var dataRows = data.rows;
                     
                      for(var i = 0; i < dataRows.length; i++){
                            var objStorage = {};
                            for(var k = 0; k < dataHeaders.length; k++ ){
                                objStorage[dataHeaders[k]['label']] = dataRows[i][k];
                            }
        
                            mergedDataList.push(objStorage);
                        } 
                    } else {
                         console.log("qbService.mergeData unable to find data");
                      }
                    
                    return mergedDataList;
                },
                
                sum: function (qbStats, statType){
                    if(!this.isEmpty(qbStats) && !this.isEmpty(statType)){
                        return qbStats.reduce( function (a, b) {
                            return b[statType] == null ? a : a + b[statType];
                        }, 0);       
                    } else {
                         console.log("qbService.sum unable to find qbStats or statType");
                      } 
                },
                
                getQBData: function (qbId) {
                    var qbData = null;
                    
                    if (!this.isEmpty(qbId)) {
                        var qbFile = 'nfl-'+qbId+'.json';
                        var fullDataPath = 'data/'+qbFile;
                        
                         return $http.get(fullDataPath)
                             .success(function(data) {
                                qbData = data; 
                         });
                    } else {
                         console.log("qbService.getQBData unable to find qbId");
                      }                              
                },
                
                mapAllTimeStats: function (qbStats) {
                    var plotPoints = [];
                    
                    if(!this.isEmpty(qbStats)) {
                        
                        for (var i = 0; i < qbStats.length; i++){
                            var statObj = {};
                            var start = 0;
                            var end = 19;
                            var formattedGameDate = null;
                            //remove the timezone section of the date because the plotting tool cannot interpret it
                            formattedGameDate = moment.utc(qbStats[i].gameDate).format().substring(start, end);
                            statObj['x'] = formattedGameDate;
                            statObj['val_0'] = this.getYdsPerAtt(qbStats[i].PsYds, qbStats[i].Att);
                            statObj['val_1'] = this.getCmpPct(qbStats[i].Cmp, qbStats[i].Att);
                            plotPoints.push(statObj);
                        }
                        
                    } else {
                         console.log("qbService.mapAllTimeStats unable to find qbStats");
                      }
                    return plotPoints;
                },
                
                findMaxValueByStat: function (qbStats, statType) {
                    var maxValue = null;
                    var gameObj = null;
                    
                    if(!this.isEmpty(qbStats)) {
                        maxValue = Math.max.apply(Math,qbStats.map(function(o){return o[statType];}));
                        gameObj= qbStats.find(function(o){ return o[statType] == maxValue; });
                    } else {
                         console.log("qbService.findMaxValueByStat unable to find qbStats");
                      }
                    return gameObj;
                },
                
                getTotalCmpPct: function (qbStats) {
                    var totalCompletions = null;
                    var totalAttempts = null;
                    var totalCmpPct = null;
                    
                    if(!this.isEmpty(qbStats)) {
                        totalCompletions = this.getTotalCompletions(qbStats);
                        totalAttempts = this.getTotalAttempts(qbStats);
                        
                        if(!this.isEmpty(totalCompletions) && !this.isEmpty(totalAttempts)){
                            totalCmpPct = this.getCmpPct(totalCompletions, totalAttempts);
                        }
                        
                        totalCmpPct = this.getCmpPct(totalCompletions, totalAttempts);                       
                    } else {
                         console.log("qbService.getTotalCmpPct unable to find qbStats");
                      }
                    return totalCmpPct;
                },
                
                getTotalCompletions: function (qbStats) {
                    var totalCompletions;
                    
                    if(!this.isEmpty(qbStats)) {
                        var totalCompletions = this.sum(qbStats, 'Cmp');
                    } else {
                         console.log("qbService.getTotalCompletions unable to find qbStats");
                      }
                    return totalCompletions;
                },
                
                getTotalAttempts: function (qbStats) {
                    var totalAttempts;
                    
                    if(!this.isEmpty(qbStats)) {
                        var totalAttempts = this.sum(qbStats, 'Att');
                    } else {
                         console.log("qbService.getTotalAttempts unable to find qbStats");
                      }
                    return totalAttempts;
                },
                
                getTotalPassingYards: function (qbStats) {
                    var totalPassingYds;
                    
                    if(!this.isEmpty(qbStats)) {
                        var totalPassingYds = this.sum(qbStats, 'PsYds');
                    } else {
                         console.log("qbService.getTotalPassingYards unable to find qbStats");
                      }
                    return totalPassingYds;
                },
                
                getTotalRushingYards: function (qbStats) {
                    var totalRushYds;
                    
                    if(!this.isEmpty(qbStats)) {
                        var totalRushYds = this.sum(qbStats, 'RshYds');
                    } else {
                         console.log("qbService.getTotalRushingYards unable to find qbStats");
                      }
                    return totalRushYds;
                },
                
                getTotalRushingTds: function (qbStats) {
                    var totalRushTds;
                    
                    if(!this.isEmpty(qbStats)) {
                        var totalRushTds = this.sum(qbStats, 'RshTD');
                    } else {
                         console.log("qbService.getTotalRushingTds unable to find qbStats");
                      }
                    return totalRushTds;
                },
                
                getYdsPerAtt: function (yards, attempts) {
                    var ydsPerAtt = null;
                    
                    if(!this.isEmpty(yards) && !this.isEmpty(attempts)) {
                        var calculation = (yards/attempts);
                        ydsPerAtt = $filter('number')(calculation, 2);
                    } else {
                         console.log("qbService.getYdsPerAtt unable to find passing yards or attempts data");
                      }
                    return ydsPerAtt;    
                    
                },
                
                getCmpPct: function(completions, attempts) {
                    var cmpPercentage = null;
                    
                    if(!this.isEmpty(completions) && !this.isEmpty(attempts)) {
                        var calculation = (completions/attempts) *100 ;
                        cmpPercentage = $filter('number')(calculation, 1);
                    } else {
                         console.log("qbService.getCmpPct unable to find passing yards or attempts data");
                      }
                    return cmpPercentage;
                }
            }
                                   
        }]);

