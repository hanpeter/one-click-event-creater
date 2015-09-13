window.App = angular.module('App', [])
    .config(['$compileProvider', function ($compileProvider) {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }]);