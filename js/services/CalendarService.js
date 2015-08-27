App.service('CalendarService', ['$http', function ($http) {
    var me = this;
    var getCalendarEventsTemplate = _.template('https://www.googleapis.com/calendar/v3/calendars/<% print(encodeURIComponent(id)); %>/events');

    _.extend(me, {
        getCalendarLists: function () {
            return $http({
                url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
            }).then(function (data) {
                return data.data;
            });
        },
        getCalendarEvents: function (id) {
            return $http({
                url: getCalendarEventsTemplate({ id: id }),
            }).then(function (data) {
                return data.data;
            });
        }
    });
}]);