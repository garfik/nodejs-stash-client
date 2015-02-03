/**
 * Created by garfik on 01.02.15.
 */

"use strict";

var sUtils = require('./stash-utils'),
    Project = require('./stash-project'),
    Repo = require('./stash-repo'),
    extend = require('util')._extend,
    PullRequest = require('./stash-pullrequest'),
    /**
     * Объект для работы с Stash Rest Api
     *
     * @param {Settings} settings
     * @constructor
     * @returns {StashClient}
     */
    StashClient = function (settings) {
        /**
         * @typedef {Object} Settings
         * @type {String} url - Урл по которому можно достучаться до Stash, например: http://stash:7990
         * @type {String} token - логин:пароль пользователя
         */
        this.settings = {
            baseUrl: settings.url,
            token: 'Basic ' + new Buffer(settings.credentials).toString('base64')
        };
    };

/**
 * Получить список доступных для пользователя проектов
 *
 * @returns {Q}
 */
StashClient.prototype.getProjectList = function () {
    return sUtils.makeRequest('/rest/api/1.0/projects', this.settings);
};

/**
 * Получить статус билда для определенного коммита
 *
 * @param {String} commitId - Хэш коммита
 * @returns {Q}
 */
StashClient.prototype.getBuildStats = function (commitId) {
    return sUtils.makeRequest('/rest/build-status/1.0/commits/stats/' + commitId, this.settings);
};

/**
 * Получить статусы билда для набора коммитов
 *
 * @param {Array.<String>} commitList - Список хэшей коммитов
 * @returns {Q}
 */
StashClient.prototype.getMultipleBuildStats = function (commitList) {
    var settings = extend({}, this.settings);
    settings.method = 'POST';
    settings.body = commitList;
    return sUtils.makeRequest('/rest/build-status/1.0/commits/stats/', settings);
};

/**
 * Объект для работы с проектом Stash'а
 *
 * @param {String} projectKey - ключ проекта
 * @returns {Project}
 * @constructor
 */
StashClient.prototype.Project = function (projectKey) {
    return new Project(projectKey, this.settings);
};

/**
 * Объект для работы с репозиторием Stash'а
 *
 * @param {String} projectKey - ключ проекта
 * @param {String} repoSlug - слаг(ид) репозитория
 * @returns {Repo}
 * @constructor
 */
StashClient.prototype.Repo = function (projectKey, repoSlug) {
    return new Repo(projectKey, repoSlug, this.settings);
};

/**
 * Объект для работы с пулл реквестом Stash'а
 *
 * @param {String} projectKey - ключ проекта
 * @param {String} repoSlug - слаг(ид) репозитория
 * @param {String} pullRequestId - ид пулл реквеста
 * @returns {PullRequest}
 * @constructor
 */
StashClient.prototype.PullRequest = function (projectKey, repoSlug, pullRequestId) {
    return new PullRequest(projectKey, repoSlug, pullRequestId, this.settings);
};

module.exports = StashClient;

