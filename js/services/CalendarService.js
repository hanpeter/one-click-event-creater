App.service('CalendarService', ['$http', function ($http) {
    var me = this;
    var getCalendarEventsTemplate = _.template('https://www.googleapis.com/calendar/v3/calendars/<% print(encodeURIComponent(id)); %>/events');
    var addCalendarEventsTemplate = _.template('https://www.googleapis.com/calendar/v3/calendars/<% print(encodeURIComponent(id)); %>/events');

    _.extend(me, {
        getCalendarLists: function () {
            return $http({
                    url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
                })
                .then(function (data) {
                    return _.filter(data.data.items, function (calendar) {
                        return calendar.id.indexOf('@group.v.calendar.google.com') < 0;
                    });
                })
                .then(function (calendarList) {
                    return _.map(calendarList, function (cal) {
                        return {
                            id: cal.id,
                            name: cal.summary,
                            description: cal.description,
                            events: {},
                            isPrimary: cal.primary,
                            isOwner: cal.accessRole === 'owner'
                        };
                    });
                });
        },
        getCalendarEvents: function (id) {
            return $http({
                    url: getCalendarEventsTemplate({ id: id }),
                })
                .then(function (data) {
                    return data.data.items;
                })
                .then(function (events) {
                    return _.map(events, function (e) {
                        var attendees = _.map(e.attendees, function (attendee) {
                            return {
                                email: attendee.email,
                                name: attendee.displayName,
                                status: attendee.responseStatus
                            };
                        });

                        return {
                            id: e.id,
                            name: e.summary,
                            start: moment(e.start.dateTime || e.start.date),
                            end: moment(e.end.dateTime || e.end.date),
                            attendees: attendees
                        };
                    });
                })
                .then(function (events) {
                    return _.reduce(events, function (result, event) {
                        var day = event.start.format('YYYY-MM-DD');

                        if (!result[day]) {
                            result[day] = [];
                        }
                        result[day].push(event);

                        return result;
                    }, {});
                });
        },
        createCalendarEvent: function (event, calendarID) {
            return $http({
                    url: addCalendarEventsTemplate({ id: calendarID }),
                    method: 'POST',
                    params: {
                        sendNotifications: true
                    },
                    data: event
                })
                .then(function (data) {
                    return data.data;
                });
        }
    });
}]);