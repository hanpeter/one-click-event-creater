App.controller('AppController', ['$scope', '$timeout', '$q', 'CalendarService', 'StorageService', function ($scope, $timeout, $q, CalendarService, StorageService) {
    _.extend($scope, {
        calendars: [],
        primaryCalendar: null,
        templates: [],
        selectedTemplate: null,
        date: new Date(),
        createEvent: function () {
            var template = $scope.selectedTemplate;
            var attendees = template.guests
                ? _.map(template.guests.split(','), function (guest) {
                    return {
                        email: _.trim(guest)
                    };
                })
                : null;
            var startTime = moment(template.startTime);
            var endTime = moment(template.endTime);
            var start = moment($scope.date).set({ hour: startTime.hour(), minute: startTime.minute(), second: startTime.second() });
            var end = moment($scope.date).set({ hour: endTime.hour(), minute: endTime.minute(), second: endTime.second() });
            CalendarService.createCalendarEvent({
                    attendees: attendees,
                    start: {
                        dateTime: start
                    },
                    end: {
                        dateTime: end
                    },
                    summary: template.summary,
                    description: template.description
                }, $scope.primaryCalendar.id)
                .then(function (data) {
                    $scope.isCreateSuccess = true;
                    console.log(data);
                })
                .catch(function (data) {
                    $scope.isCreateSuccess = false;
                    console.log(data);
                    throw new Error(JSON.stringify(arguments));
                });
        },
        isCreateSuccess: null
    });

    CalendarService.getCalendarLists()
        .then(function (calendarList) {
            $scope.calendars = calendarList;

            $scope.primaryCalendar = _.find($scope.calendars, { isPrimary: true });

            return $scope.calendars;
        })
        .then(function (calendarList) {
            return $q.all(_.map(calendarList, function (calendar) {
                CalendarService.getCalendarEvents(calendar.id)
                    .then(function (events) {
                        calendar.events = events;
                    });
            }));
        })
        .then(function () {
            console.log($scope.calendars);
        });

    StorageService.getTemplates()
        .then(function (templates) {
            $scope.templates = templates;
            $scope.selectedTemplate = templates[0];
        })
        .then(function () {
            console.log($scope.templates);
        });

    $scope.$watch('isCreateSuccess', function (value) {
        if (value !== null) {
            $timeout(function () {
                $scope.isCreateSuccess = null;
            }, 8000);
        }
    });
}]);