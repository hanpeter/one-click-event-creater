App.controller('AppController', ['$scope', '$timeout', 'CalendarService', function ($scope, $timeout, CalendarService) {
    _.extend($scope, {
        calendars: []
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

                        CalendarService.createCalendarEvent({
                            attendees: [{
                                email: 'han.peter.621@gmail.com'
                            }, {
                                email: 'phan@clicktime.com'
                            }],
                            start: {
                                dateTime: moment()
                            },
                            end: {
                                dateTime: moment().add(1, 'h')
                            },
                            summary: 'Test Event',
                            description: 'Description'
                        }, $scope.calendars[0].id);
                    });
            });
        });

    $timeout(function () {
        $(document).foundation();
        console.log($scope.calendars);
    });
}]);