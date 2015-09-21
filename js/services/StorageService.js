App.service('StorageService', ['$q', function ($q) {
    var me = this;
    var TIME_FORMAT = "HH:mm:ss";

    function load(keys) {
        var deferred = $q.defer();

        chrome.storage.sync.get(keys, function (data) {
            if (chrome.runtime.lastError) {
                deferred.reject(chrome.runtime.lastError);
            }
            else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }

    function save(obj) {
        var deferred = $q.defer();

        chrome.storage.sync.set(obj, function (data) {
            if (chrome.runtime.lastError) {
                deferred.reject(chrome.runtime.lastError);
            }
            else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }

    function serializeTemplate(template) {
        return {
            summary: template.summary,
            description: template.description,
            startTime: moment(template.startTime).format(TIME_FORMAT),
            endTime: moment(template.endTime).format(TIME_FORMAT),
            guests: template.guests
        };
    }

    _.extend(me, {
        getTemplates: function () {
            return load({
                    templates: []
                })
                .then(function (data) {
                    return _.map(data.templates, function (templ) {
                        templ.startTime = moment(templ.startTime, TIME_FORMAT).toDate();
                        templ.endTime = moment(templ.endTime, TIME_FORMAT).toDate();

                        return templ;
                    });
                });
        },
        addTemplate: function (templ) {
            return me.getTemplates()
                .then(function (templates) {
                    templates.push(templ);
                    return save({
                        templates: _.map(templates, serializeTemplate)
                    });
                });
        },
        removeTemplate: function (templ) {
            return me.getTemplates()
                .then(function (templates) {
                    templates = _.filter(templates, function (template) {
                        return template.summary !== templ.summary;
                    });

                    return save({
                        templates: _.map(templates, serializeTemplate)
                    });
                });
        },
        saveTemplates: function (templates) {
            templates = _.map(templates, serializeTemplate);
            return save({
                templates: templates
            });
        }
    });
}]);