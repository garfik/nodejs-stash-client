var request = require('request'),
    extend = require('util')._extend,
    Q = require('q');

/**
 * Функция, которая может работать с Paged API от Stash, так же умеет полностью выкачивать список
 *
 * @param settings
 * @param startPage
 * @param lastResult
 */
function pageWorker (settings, startPage, lastResult) {
    var reqSettings = extend({
            qs: {
                limit: (settings.limit === 'ALL' ? '100' : settings.limit),
                start: startPage
            },
            json: true,
            headers: {
                'User-Agent': 'Stash-Client',
                'Authorization': settings.token,
                'Content-Type': 'application/json'
            }
        }, settings);
    delete reqSettings.baseUrl;

    request(reqSettings, function (err, response, body) {
        if (err) {
            settings.deferred.reject(err);
            return;
        }
        if (body && body.values && body.size && settings.limit === 'ALL') {
            // this is a PagedAPI
            if (!lastResult) {
                lastResult = [];
            }
            Array.prototype.push.apply(lastResult, body.values);
            if (body && body.isLastPage) {
                settings.deferred.resolve(lastResult);
            } else {
                pageWorker(settings, body.nextPageStart, lastResult);
            }
        } else {
            if (body && body.values) {
                body = body.values;
            }
            settings.deferred.resolve(body);
        }
    });
}

/**
 * Выполнить реквест
 *
 * @param {String} url
 * @param {Object} settings
 * @returns {Q}
 */
module.exports.makeRequest = function (url, settings) {
    var deferred = Q.defer(),
        params = extend({
            url: settings.baseUrl + url,
            deferred: deferred,
            limit: 'ALL',
            method: 'GET'
        }, settings);

    pageWorker(params, 0);

    return deferred.promise;
};

