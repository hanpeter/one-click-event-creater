window.App = angular.module('App', ['rollbar'])
    .config(['$compileProvider', function ($compileProvider) {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }])
    .config(['$rollbarProvider', function ($rollbarProvider) {
        $rollbarProvider.init({
            accessToken: '435b6b3b249841d4ba71d7c5fad60ea1',
            verbose: true,
            captureUncaught: true,
            payload: {
                environment: 'production'
            }
        });
    }])
    .run(function () {
        $(document).foundation();
    });