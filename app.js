window.App = angular.module('App', []);

chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    $.ajax({
        url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }).success(function (data) {
        console.log(data);
    });
    $.ajax({
        url: 'https://www.googleapis.com/calendar/v3/calendars/han.peter.621@gmail.com/events',
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }).success(function (data) {
        console.log(data);
    });
});