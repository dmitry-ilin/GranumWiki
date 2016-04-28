'use strict';

const granumMarkdown = angular.module('granumMarkdown', []);

granumMarkdown.config(['markdownItConverterProvider',
    function(markdownItConverter) {
        let md;

        markdownItConverter.config('default', {
            breaks: true,
            html: false,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs ' + this.langPrefix + lang + '"><code>' +
                            hljs.highlight(lang, str, true).value +
                            '</code></pre>';
                    } catch (__) {}
                }

                return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
            }
        }, [{
            plugin: markdownitHashtag,
            options: {
                hashtagRegExp: '[A-Za-zА-Яа-я0-9-_]+',
                hashtagOpen: function hashtag_open(tokens, idx) {
                    let tagName = tokens[idx].content;
                    return '<a hashtag-link="true" href="#/article/list/%23' + tagName + '" class="tag">';
                }
            }
        }, {
            plugin: markdownitHTML5Embed,
            options: {
                html5embed: {
                    useImageSyntax: true,
                    getCustomMimeService: function() {
                        return require('./modules/angular-service').getService('MarkdownMime');
                    }
                }
            }
        }, {
            plugin: require('markdown-it-anchor')
        }]);

        md = markdownItConverter.$get();
    }]);
