App.service('StorageService', ['$q', function ($q) {
    var me = this;

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

    _.extend(me, {
        getTemplates: function () {
            return load({
                templates: []
            });
        },
        addTemplate: function (templ) {
            return me.getTemplates()
                .then(function (data) {
                    data.templates.push(templ);
                    return save({
                        templates: data.templates
                    });
                });
        },
        removeTemplate: function (templ) {
            return me.getTemplates()
                .then(function (data) {
                    data.templates = _.filter(data.templates, function (template) {
                        return template.summary !== templ.summary;
                    });

                    return save({
                        templates: data.templates
                    });
                });
        },
        saveTemplates: function (templates) {
            return save({
                templates: templates
            });
        }
    });
}]);