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
                _.extend(origTempl, currentTemplate);
                StorageService.saveTemplates($scope.templates);
            }
            else {
                $scope.templates.push($scope.currentTemplate);
                StorageService.addTemplate($scope.currentTemplate);
            }
        }
    });

    StorageService.getTemplates()
        .then(function (data) {
            $scope.templates = data.templates;
        });

    $timeout(function () {
        $(document).foundation();
        console.log($scope.templates);
    });
}]);