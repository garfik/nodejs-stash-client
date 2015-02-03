
var sUtils = require('./stash-utils'),
    extend = require('util')._extend,
    PullRequest = require('./stash-pullrequest'),
    /**
     * Объект для управления репозиторием
     *
     * @param {String} projectKey
     * @param {String} repoSlug
     * @param {Settings} settings
     * @constructor
     */
    Repo = function (projectKey, repoSlug, settings) {
        this.key = projectKey;
        this.slug = repoSlug;
        this.settings = settings;
    };

/**
 * Получить информацию о репозитории
 *
 * @returns {Q}
 */
Repo.prototype.getInfo = function () {
    return sUtils.makeRequest('/rest/api/1.0/projects/' + this.key + '/repos/' + this.slug, this.settings);
};


/**
 * Получить список пулл реквестов
 *
 * @param {GetPullRequestSetting} settings
 * @returns {Q}
 */
Repo.prototype.getPullRequestList = function (settings) {
    /**
     * @typedef {Object} GetPullRequestSetting
     * @param {String} state - может быть OPEN, DECLINED, MERGED
     * @param {String} limit - может быть количество или ALL, чтобы получить все пуллреквесты
     */
    var mergedSettings = extend({
            state: 'OPEN',
            limit: 'ALL'
        }, settings);
    mergedSettings = extend(mergedSettings, this.settings);
    return sUtils.makeRequest('/rest/api/1.0/projects/' + this.key + '/repos/' + this.slug +
    '/pull-requests?state=' + mergedSettings.state + '&order=NEWEST', mergedSettings);
};

/**
 * Объект для управления пулл реквестом
 *
 * @param {String} pId
 * @returns {PullRequest}
 * @constructor
 */
Repo.prototype.PullRequest = function (pId) {
    return new PullRequest(this.key, this.slug, pId, this.settings);
};

module.exports = Repo;