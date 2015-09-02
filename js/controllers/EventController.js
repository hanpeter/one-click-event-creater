App.controller('EventController', ['$scope', 'CalendarService', function ($scope, CalendarService) {
    _.extend($scope, {
        title: '',
        description: '',
        startTime: null,
        endTime: null,
        guests: '',
        createEvent: function () {
            CalendarService.createCalendarEvent({
                attendees: $scope.attendees,
                start: {
                    dateTime: $scope.start
                },
                end: {
                    dateTime: $scope.end
                },
                summary: $scope.title,
                description: $scope.description
            }, $scope.primaryCalendar.id)
            .then(function (data) {
                console.log(data);
            });
        }
    });

    Object.defineProperties($scope, {
        start: {
            enumerable: true,
            get: function () {
                return moment($scope.startTime).toDate();
            }
        },
        end: {
            enumerable: true,
            get: function () {
                return moment($scope.endTime).toDate();
            }
        },
        attendees: {
            enumerable: true,
            get: function () {
                return _.map($scope.guests.split(','), function (guest) {
                    return {
                        email: _.trim(guest)
                    };
                });
            }
        }
    });
}]);