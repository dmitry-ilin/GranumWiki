'use strict';

granumArticle.controller('ArticleEditFormController', ['$scope', '$routeParams', '$location', 'Article', 'Notifications', '$translate', '$window',
    function($scope, $routeParams, $location, Article, Notifications, $translate, $window) {

        let $form = angular.element('#article-form');
        $translate('FORM.ERROR.REQUIRED').then((translation) => {
            $form
                .form({
                    fields: {
                        'article.title': {
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: translation
                                }
                            ]
                        }
                    },
                    inline: true
                });
        });

        if ($routeParams.articleId) {
            Article.get($routeParams.articleId).then(function(article) {
                $scope.article = article;
                $scope.$parent.article.uuid = $scope.article.uuid;
                $scope.$parent.article.title = $scope.article.title;
                $scope.$apply();

                if ($scope.simplemde) {
                    $scope.simplemde.value(article.content);
                }
            }).catch(function(err) {
                if (err['not_found']) {
                    $window.location.hash = '#/article/new/';
                }
            });
        } else {
            $scope.article = {};
        }

        $scope.cancelArticle = function() {
            if ($scope.article.uuid) {
                $location.url('/article/view/' + $scope.article.uuid);
            } else {
                $location.url('/article/list/');
            }
        };

        $scope.saveArticle = function() {
            if ($form.form('validate form')) {
                Article.save($scope.article).then(function(article) {
                    $location.url('/article/view/' + article.uuid);
                    $scope.$apply();
                    Notifications.showTranslated(
                        'NOTIFICATION.ARTICLE.SAVE_SUCCESS',
                        null,
                        'success'
                    );
                }).catch(function() {
                    Notifications.showTranslated(
                        'NOTIFICATION.ARTICLE.SAVE_FAILURE',
                        'NOTIFICATION.ARTICLE.SAVE_FAILURE_TEXT',
                        'alert'
                    );
                });
            } else {
                Notifications.showTranslated(
                    'NOTIFICATION.ARTICLE.VALIDATION_ERRORS',
                    'NOTIFICATION.ARTICLE.FIX_ERRORS',
                    'warning'
                );
            }
        };
    }]);
