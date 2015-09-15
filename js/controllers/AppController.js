App.controller('AppController', ['$scope', '$timeout', 'CalendarService', 'StorageService', function ($scope, $timeout, CalendarService, StorageService) {
    _.extend($scope, {
        calendars: [],
        primaryCalendar: null,
        templates: [],
        selectedTemplate: null
    });

    CalendarService.getCalendarLists()
        .then(function (calendarList) {
            _.forEach(calendarList, function (cal, index) {
                var calendar = {
                    id: cal.id,
                    name: cal.summary,
                    description: cal.description,
                    events: {}
                };
                $scope.calendars[index] = calendar;

                if (cal.primary) {
                    $scope.primaryCalendar = calendar;
                }

                CalendarService.getCalendarEvents(calendar.id)
                    .then(function (events) {
                        _.forEach(events, function (e) {
                            var event = {
                                id: e.id,
                                name: e.summary,
                                start: moment(e.start.dateTime || e.start.date),
                                end: moment(e.end.dateTime || e.end.date),
                                attendees: []
                            };
                            var day = event.start.format('YYYY-MM-DD');

                            if (!calendar.events[day]) {
                                calendar.events[day] = [];
                            }
                            calendar.events[day].push(event);

                            _.forEach(e.attendees, function (attendee) {
                                event.attendees.push({
                                    email: attendee.email,
                                    name: attendee.displayName,
                                    status: attendee.responseStatus
                                });
                            });
                        });
                    });
            });
        });

    StorageService.getTemplates()
        .then(function (templates) {
            $scope.templates = templates;
            $scope.selectedTemplate = templates[0];
        });

    $timeout(function () {
        $(document).foundation();
        console.log($scope.calendars);
    });
}]);