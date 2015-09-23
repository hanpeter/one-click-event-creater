App.controller('OptionsController', ['$scope', '$timeout', 'StorageService', function ($scope, $timeout, StorageService) {
    var today = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0}).toDate();

    _.extend($scope, {
        templates: [],
        currentTemplate: {
            startTime: today,
            endTime: today
        },
        setCurrentTemplate: function (templ) {
            templ.startTime = templ.startTime || today;
            templ.endTime = templ.endTime || today;

            $scope.currentTemplate = templ;
        },
        saveTemplate: function () {
            var origTempl = _.find($scope.templates, function (templ) {
                return templ.summary === $scope.currentTemplate.summary;
            });
            var promise = null;

            if (origTempl) {
                _.extend(origTempl, $scope.currentTemplate);
                promise = StorageService.saveTemplates($scope.templates);
            }
            else {
                $scope.templates.push($scope.currentTemplate);
                promise = StorageService.addTemplate($scope.currentTemplate);
            }

            promise
                .then(function () {
                    $scope.isSaveSuccess = true;
                })
                .catch(function () {
                    $scope.isSaveSuccess = false;
                    throw new Error(JSON.stringify(arguments));
                });
        },
        isSaveSuccess: null
    });

    StorageService.getTemplates()
        .then(function (templates) {
            $scope.templates = templates;
            console.log($scope.templates);
        });

    $scope.$watch('isSaveSuccess', function (value) {
        if (value !== null) {
            $timeout(function () {
                $scope.isSaveSuccess = null;
            }, 8000);
        }
    });
}]);