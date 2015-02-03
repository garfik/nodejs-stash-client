
var sUtils = require('./stash-utils'),
    Repo = require('./stash-repo'),
    /**
     * Объект для управления проектом Stash'а
     *
     * @param {String} projectKey
     * @param {Settings} settings
     * @constructor
     */
    Project = function (projectKey, settings) {
        this.key = projectKey;
        this.settings = settings;
    };

/**
 * Получить список репозиториев в проекте
 *
 * @returns {Q}
 */
Project.prototype.getRepoList = function () {
    return sUtils.makeRequest('/rest/api/1.0/projects/' + this.key + '/repos', this.settings);
};

/**
 * Объект для управления репозиторием
 *
 * @param slug
 * @returns {Repo}
 * @constructor
 */
Project.prototype.Repo = function (slug) {
    return new Repo(this.key, slug, this.settings);
};

module.exports = Project;