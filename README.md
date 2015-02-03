NodeJS REST Client for Atlassian's Stash
========================================

На данный момент используется только для чтения данных из Stash

Пример использования
--------------------

Инициализируем клиент

    Stash = require('./lib/stash-client'),
    client = new Stash({
        url: 'http://stash:7990',
        credentials: 'login:password'
    })

Далее используем:

    client.getProjectList().then(success_handler, error_handler)
    client.Project('Project_Key').getRepoList().then(success_handler, error_handler)
    client.Project('Project_Key').Repo('Repo_Slug').getPullRequestList({limit: 'ALL'}).then(success_handler, error_handler)
    client.Project('Project_Key').Repo('Repo_Slug').PullRequest('1').getInfo().then(success_handler, error_handler)
    client.PullRequest('Project_Key', 'Repo_Slug', '1').getApproversList(data_from_getInfo)
    client.getBuildStats('1234871234234123465237465273465').then(success_handler, error_handler)
    client.getMultipleBuildStats(['8419b5a47c....f4c155f', '2c0989589....3086714fd']).then(success_handler, error_handler)
    client.PullRequest('Project_Key', 'Repo_Slug', '1').getJiraIssues().then(success_handler, error_handler)

Библиотека еще будет дополнятся