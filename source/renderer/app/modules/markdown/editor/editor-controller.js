'use strict';

granumMarkdown.controller('MarkdownEditorController', ['$scope', '$filter', '$translate', 'MarkdownMime',
    function($scope, $filter, $translate, MarkdownMime) {
        const ipcRenderer = require('electron').ipcRenderer;

        let renderingQueue = [];
        let isRendering = false;

        function processRenderingQueueItem() {
            if (!isRendering && renderingQueue.length > 0) {
                isRendering = true;
                let queueItem = renderingQueue.pop();
                renderingQueue = [];

                queueItem(() => {
                    isRendering = false;
                    processRenderingQueueItem();
                });
            }
        }

        $scope.mediaSelector = {};

        /**
         * Modified copy of private function from Simple MDE
         */
        function _replaceSelection(cm, active, startEnd, url, title) {
            if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
                return;

            var text;
            var start = startEnd[0];
            var end = startEnd[1];
            var startPoint = cm.getCursor("start");
            var endPoint = cm.getCursor("end");
            if(url) {
                end = end.replace("#title#", title);
                end = end.replace("#url#", url);
            }
            if(active) {
                text = cm.getLine(startPoint.line);
                start = text.slice(0, startPoint.ch);
                end = text.slice(startPoint.ch);
                cm.replaceRange(start + end, {
                    line: startPoint.line,
                    ch: 0
                });
            } else {
                text = cm.getSelection();
                cm.replaceSelection(start + text + end);

                startPoint.ch += start.length;
                if(startPoint !== endPoint) {
                    endPoint.ch += start.length;
                }
            }
            cm.setSelection(startPoint, endPoint);
            cm.focus();
        }

        $scope.drawMedia = function(media) {
            if (media) {
                let cm = $scope.$parent.simplemde.codemirror;

                let stat = $scope.$parent.simplemde.getState(cm),
                    options = $scope.$parent.simplemde.options,
                    url = "media://" + media.uuid;

                _replaceSelection(cm, stat.image, ["![", "#title#](#url#)"], url, media.title);
            }
        };

        $scope.openMediaSelector = function(editor) {
            // debugger;
            $scope.mediaSelector.searchMediaItems();
            angular.element('#media-selector').modal('show');
        };

        $scope.closeMediaSelector = function(editor) {
            angular.element('#media-selector').modal('hide');
        };

        function getToolbarButtons() {
            let translatePrefix = 'EDITOR.TOOLBAR.';

            function getTitle(element) {
                return translatePrefix + element;
            }
            let titles = [
                'BOLD',
                'ITALIC',
                'STRIKETHROUGH',
                'HEADING',
                'CODE',
                'QUOTE',
                'GENERIC_LIST',
                'NUMBERED_LIST',
                'CREATE_LINK',
                'INSERT_IMAGE',
                'INSERT_MEDIA',
                'INSERT_TABLE',
                'INSERT_HORIZONTAL_LINE',
                'TOGGLE_PREVIEW',
                'TOGGLE_SIDE_BY_SIDE',
                'TOGGLE_FULLSCREEN',
                'MARKDOWN_GUIDE'
            ].map(getTitle);

            return new Promise(function(resolve, reject) {
                $translate(titles).then((translation) => {
                    resolve([{
                        name: "bold",
                        action: SimpleMDE.toggleBold,
                        className: "fa fa-bold",
                        title: translation[getTitle('BOLD')],
                        default: true
                    },
                        {
                            name: "italic",
                            action: SimpleMDE.toggleItalic,
                            className: "fa fa-italic",
                            title: translation[getTitle('ITALIC')],
                            default: true
                        },
                        {
                            name: "strikethrough",
                            action: SimpleMDE.toggleStrikethrough,
                            className: "fa fa-strikethrough",
                            title: translation[getTitle('STRIKETHROUGH')]
                        },
                        {
                            name: "heading",
                            action: SimpleMDE.toggleHeadingSmaller,
                            className: "fa fa-header",
                            title: translation[getTitle('HEADING')],
                            default: true
                        },
                        "|",
                        {
                            name: "code",
                            action: SimpleMDE.toggleCodeBlock,
                            className: "fa fa-code",
                            title: translation[getTitle('CODE')]
                        },
                        {
                            name: "quote",
                            action: SimpleMDE.toggleBlockquote,
                            className: "fa fa-quote-left",
                            title: translation[getTitle('QUOTE')],
                            default: true
                        },
                        {
                            name: "unordered-list",
                            action: SimpleMDE.toggleUnorderedList,
                            className: "fa fa-list-ul",
                            title: translation[getTitle('GENERIC_LIST')],
                            default: true
                        },
                        {
                            name: "ordered-list",
                            action: SimpleMDE.toggleOrderedList,
                            className: "fa fa-list-ol",
                            title: translation[getTitle('NUMBERED_LIST')],
                            default: true
                        },
                        "|",
                        {
                            name: "link",
                            action: SimpleMDE.drawLink,
                            className: "fa fa-link",
                            title: translation[getTitle('CREATE_LINK')],
                            default: true
                        },
                        {
                            name: "image",
                            action: SimpleMDE.drawImage,
                            className: "fa fa-picture-o",
                            title: translation[getTitle('INSERT_IMAGE')],
                            default: true
                        },
                        {
                            name: "media",
                            action: $scope.openMediaSelector,
                            className: "fa fa-file-image-o ",
                            title: translation[getTitle('INSERT_MEDIA')]
                        },
                        {
                            name: "table",
                            action: SimpleMDE.drawTable,
                            className: "fa fa-table",
                            title: translation[getTitle('INSERT_TABLE')]
                        },
                        {
                            name: "horizontal-rule",
                            action: SimpleMDE.drawHorizontalRule,
                            className: "fa fa-minus",
                            title: translation[getTitle('INSERT_HORIZONTAL_LINE')]
                        },
                        "|",
                        {
                            name: "preview",
                            action: SimpleMDE.togglePreview,
                            className: "fa fa-eye no-disable",
                            title: translation[getTitle('TOGGLE_PREVIEW')],
                            default: true
                        },
                        {
                            name: "side-by-side",
                            action: SimpleMDE.toggleSideBySide,
                            className: "fa fa-columns no-disable no-mobile",
                            title: translation[getTitle('TOGGLE_SIDE_BY_SIDE')],
                            default: true
                        },
                        {
                            name: "fullscreen",
                            action: SimpleMDE.toggleFullScreen,
                            className: "fa fa-arrows-alt no-disable no-mobile",
                            title: translation[getTitle('TOGGLE_FULLSCREEN')],
                            default: true
                        },
                        "|",
                        {
                            name: "guide",
                            action: "https://simplemde.com/markdown-guide",
                            className: "fa fa-question-circle",
                            title: translation[getTitle('MARKDOWN_GUIDE')],
                            default: true
                        }
                    ]);
                });
            });
        }


        getToolbarButtons().then((buttons) => {
            $scope.$parent.simplemde = new SimpleMDE({
                element: angular.element("#article-content")[0],
                spellChecker: false,
                autoDownloadFontAwesome: false,
                previewRender: function(plainText, preview) {
                    renderingQueue.push((callback) => {
                        function success(event, mimeTypes) {
                            MarkdownMime.setMimeTypes(mimeTypes);
                            preview.innerHTML = $filter('markdownIt')(plainText);
                            if (callback) {
                                callback();
                            }
                        }
                        ipcRenderer.once('article-get-mime-types-from-content-reply', success);
                        ipcRenderer.send('article-get-mime-types-from-content-query', {content: plainText});
                        setTimeout(() => {
                            ipcRenderer.removeListener('article-get-mime-types-from-content-reply', success);
                            if (callback) {
                                callback();
                            }
                        }, 5000);
                    });
                    processRenderingQueueItem();

                    return preview.innerHTML;
                },
                toolbar: buttons
            });

            $scope.$parent.simplemde.codemirror.on('change', function(cm, changeObj) {
                $scope.$parent.article.content = $scope.$parent.simplemde.value();
            });
        });
    }]);
