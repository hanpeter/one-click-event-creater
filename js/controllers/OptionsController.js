App.controller('OptionsController', ['$scope', '$timeout', 'StorageService', function ($scope, $timeout, StorageService) {
    _.extend($scope, {
        templates: [],
        currentTemplate: {},
        setCurrentTemplate: function (templ) {
            $scope.currentTemplate = templ;
        },
        saveTemplate: function () {
            var origTempl = _.find($scope.templates, function (templ) {
                return templ.summary === $scope.currentTemplate.summary;
            });

            if (origTempl) {
                _.extend(origTempl, $scope.currentTemplate);
                StorageService.saveTemplates($scope.templates);
            }
            else {
                $scope.templates.push($scope.currentTemplate);
                StorageService.addTemplate($scope.currentTemplate);
            }
        }
    });

    StorageService.getTemplates()
        .then(function (templates) {
            $scope.templates = templates;
            console.log($scope.templates);
        });

    $timeout(function () {
        $(document).foundation();
    });
}]);