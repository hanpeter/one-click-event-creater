App.controller('AppController', ['$scope', '$timeout', 'CalendarService', 'StorageService', function ($scope, $timeout, CalendarService, StorageService) {
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
                    console.log(data);
                });
        }
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
    });
}]);