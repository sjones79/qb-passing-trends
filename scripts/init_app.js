'use strict';

var appInit = function () {
    
    var receivedEvent = function () {
        var body = angular.element(document).find('body');
        angular.bootstrap(body, ['qbPassTrends']);    
    };
   
    receivedEvent();
};

var init = function () {
    new appInit();
};

init();