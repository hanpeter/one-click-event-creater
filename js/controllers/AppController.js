App.controller('AppController', ['$scope', '$timeout', 'CalendarService', function ($scope, $timeout, CalendarService) {
    _.extend($scope, {
        selectedCalendarIndex: 0,
        calendars: []
    });

    CalendarService.getCalendarLists()
        .then(function (data) {
            _.forEach(data.items, function (cal, index) {
                var calendar = {
                    id: cal.id,
                    name: cal.summary,
                    description: cal.description,
                    events: []
                };
                $scope.calendars[index] = calendar;
                CalendarService.getCalendarEvents(calendar.id)
                    .then(function (data) {
                        _.forEach(data.items, function (e) {
                            var event = {
                                id: e.id,
                                name: e.summary,
                                start: new Date(e.start.dateTime),
                                end: new Date(e.end.dateTime),
                                attendees: []
                            };
                            calendar.events.push(event);

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

    $timeout(function () {
        $(document).foundation();
        console.log($scope.calendars);
    });
}]);