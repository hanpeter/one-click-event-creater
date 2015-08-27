App.service('AuthorizationService', ['$q', function ($q) {
    var me = this;
    var token = null;

    function getToken() {
        var deferred = $q.defer();

        if (!!token) {
            deferred.resolve(token);
        }
        else {
            chrome.identity.getAuthToken({ 'interactive': true }, deferred.resolve);
        }

        return deferred.promise;
    }

    // function removeToken() {
    //     return $http({
    //             url: 'https://accounts.google.com/o/oauth2/revoke',
    //             params: {
    //                 token: token
    //             }
    //         })
    //         .then(function () {
    //             var deferred = $q.defer();

    //             chrome.identity.removeCachedAuthToken({ token: token }, deferred.resolve);

    //             return deferred.promise;
    //         });
    // }

    _.extend(me, {
        request: function (config) {
            return getToken()
                .then(function (token) {
                    config.headers.Authorization = 'Bearer ' + token;

                    return config;
                });
        }
    });
}])
.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthorizationService');
}]);