
var sUtils = require('./stash-utils'),
    extend = require('util')._extend,
    /**
     * Объект для управления пулл реквестом
     *
     * @param {String} projectKey
     * @param {String} repoSlug
     * @param {String} pullRequestId
     * @param {Settings} settings
     * @constructor
     */
    PullRequest = function (projectKey, repoSlug, pullRequestId, settings) {
        this.key = projectKey;
        this.slug = repoSlug;
        this.id = pullRequestId;
        this.settings = settings;
    };

/**
 * Возвращает линк до АПИ работы с репозиторием
 *
 * @returns {string}
 * @private
 */
PullRequest.prototype._getBaseURL = function () {
    return '/rest/api/1.0/projects/' + this.key + '/repos/' + this.slug + '/pull-requests/' + this.id;
};

/**
 * Получает информацию о пулл реквесте
 *
 * @returns {Q}
 */
PullRequest.prototype.getInfo = function () {
    return sUtils.makeRequest(this._getBaseURL(), this.settings);
};

/**
 * Возвращает информацию об ошибках при мерже
 *
 * @returns {Q}
 */
PullRequest.prototype.canBeMerged = function () {
    return sUtils.makeRequest(this._getBaseURL() + '/merge', this.settings);
};

/**
 * Получает список пользователей, которые поставили Approve у пулл реквеста
 *
 * @param {Object} pullRequestObj Результат выполнения PullRequest.getInfo
 * @returns {Array}
 */
PullRequest.prototype.getApproversList = function (pullRequestObj) {
    var result = [],
        getApprovers = function (list) {
            var result = [], i, len;
            for (i = 0, len = list.length; i < len; i += 1) {
                if (list[i].approved) {
                    result.push(list[i]);
                }
            }
            return result;
        };
    if (!pullRequestObj || typeof pullRequestObj !== "object" || typeof pullRequestObj.reviewers === 'undefined') {
        throw "Wrong type given. It must be an result of PullRequest.getInfo";
    }
    if (typeof pullRequestObj.reviewers !== 'undefined') {
        Array.prototype.push.apply(result, getApprovers(pullRequestObj.reviewers));
    }
    if (typeof pullRequestObj.participants !== 'undefined') {
        Array.prototype.push.apply(result, getApprovers(pullRequestObj.participants));
    }
    return result;
};

/**
 * Получает список задач, которые привязаны к пулл реквесту
 *
 * @returns {Q}
 */
PullRequest.prototype.getJiraIssues = function () {
    return sUtils.makeRequest('/rest/jira/1.0/projects/' + this.key + '/repos/' + this.slug + '/pull-requests/' + this.id + '/issues' , this.settings);
};

module.exports = PullRequest;