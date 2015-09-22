App.controller('OptionsController', ['$scope', 'StorageService', function ($scope, StorageService) {
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
}]);