App.service('CalendarService', ['$http', function ($http) {
    var me = this;
    var getCalendarEventsTemplate = _.template('https://www.googleapis.com/calendar/v3/calendars/<% print(encodeURIComponent(id)); %>/events');
    var addCalendarEventsTemplate = _.template('https://www.googleapis.com/calendar/v3/calendars/<% print(encodeURIComponent(id)); %>/events');

    _.extend(me, {
        getCalendarLists: function () {
            return $http({
                url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
            }).then(function (data) {
                return _.filter(data.data.items, function (calendar) {
                    return calendar.id.indexOf('@group.v.calendar.google.com') < 0;
                });
            });
        },
        getCalendarEvents: function (id) {
            return $http({
                url: getCalendarEventsTemplate({ id: id }),
            }).then(function (data) {
                return data.data.items;
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
            }).then(function (data) {
                return data.data;
            });
        }
    });
}]);