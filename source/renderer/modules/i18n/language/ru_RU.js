var appName = require('electron').remote.app.getName();

module.exports = {
    'DARWIN': {
        'ABOUT': 'О ' + appName,
        'SERVICES': 'Сервисы',
        'HIDE': 'Скрыть ' + appName,
        'HIDE_OTHERS': 'Скрыть другие',
        'SHOW_ALL': 'Показать все',
        'QUIT': 'Закрыть',
        'BRING_ALL_TO_FRONT': 'Показать все окна'
    },
    'ARTICLE': {
        'ARTICLE': 'Статья',
        'NEW': 'Новая',
        'EDIT': 'Редактировать',
        'SAVE': 'Сохранить',
        'COPY_ID': 'Копировать ID в буфер',
        'COPY_LINK': 'Копировать ссылку в буфер',
        'SYNCHRONIZE_ARTICLES': 'Синхронизовать статьи'
    },
    'MEDIA': {
        'MEDIA': 'Медиа',
        'NEW': 'Новая',
        'EDIT': 'Редактировать',
        'SAVE': 'Сохранить',
        'COPY_ID': 'Копировать ID в буфер',
        'COPY_CODE': 'Копировать код для вставки в буфер',
        'SYNCHRONIZE_MEDIA_ITEMS': 'Синхронизовать медиа'
    },
    'EDIT': {
        'EDIT': 'Правка',
        'UNDO': 'Отменить',
        'REDO': 'Повторить',
        'CUT': 'Вырезать',
        'COPY': 'Копировать',
        'PASTE': 'Вставить',
        'SELECT_ALL': 'Выделить всё'
    },
    'SEARCH': {
        'SEARCH': 'Поиск',
        'PAGE_SEARCH': 'Поиск на странице',
        'GLOBAL_SEARCH': 'Глобальный поиск'
    },
    'VIEW': {
        'VIEW': 'Вид',
        'RELOAD': 'Перезагрузить',
        'TOGGLE_FULL_SCREEN': 'Полноэкранный режим',
        'TOGGLE_DEVELOPER_TOOLS': 'Инструменты разработчика'
    },
    'WINDOW': {
        'WINDOW': 'Окно',
        'MINIMIZE': 'Свернуть окно',
        'NEW_WINDOW': 'Новое окно',
        'CLOSE': 'Закрыть'
    },
    'HELP': {
        'HELP': 'Справка',
        'LEARN_MORE': 'О приложении'
    },
    'TITLEBAR': {
        'SEARCH': 'Поиск'
    },
    'SIDEBAR': {
        'MENU': 'Меню',
        'SEARCH': 'Поиск',
        'MEDIA': 'Медиа',
        'SETTINGS': 'Настройки',
        'RECENT_ARTICLES': 'Недавно просмотренное',
        'NODES': 'Подключенные узлы'
    },
    'SEARCHBAR': {
        'PAGE_SEARCH': 'Поиск на странице',
        'TOTAL_RESULTS': 'Найдено:'
    },
    'EDITOR': {
        'TOOLBAR': {
            'BOLD': 'Жирный',
            'ITALIC': 'Курсив',
            'STRIKETHROUGH': 'Перечёркнутый',
            'HEADING': 'Заголовок',
            'CODE': 'Код',
            'QUOTE': 'Цитата',
            'GENERIC_LIST': 'Список',
            'NUMBERED_LIST': 'Нумерованный список',
            'CREATE_LINK': 'Создать ссылку',
            'INSERT_IMAGE': 'Вставить изображение',
            'INSERT_MEDIA': 'Вставить медиа',
            'INSERT_TABLE': 'Вставить таблицу',
            'INSERT_HORIZONTAL_LINE': 'Вставить разделитель',
            'TOGGLE_PREVIEW': 'Показать превью',
            'TOGGLE_SIDE_BY_SIDE': 'Показать превью рядом с текстом',
            'TOGGLE_FULLSCREEN': 'Полноэкранный режим',
            'MARKDOWN_GUIDE': 'Справка по Markdown'
        }
    },
    'NGVIEW': {
        'ARTICLE': {
            'LIST': {
                'SEARCH': 'Поиск:',
                'SUBMIT': 'Отправить',
                'NO_ARTICLES': 'В вики пока нет статей.',
                'NOT_FOUND': 'Статей по запросу не найдено',
                'CREATE_NEW': 'Создайте первую!'
            },
            'EDIT': {
                'TITLE': 'Заголовок',
                'CONTENT': 'Контент',
                'MEDIA': {
                    'SELECTOR': {
                        'SELECT': 'Выбрать',
                        'SELECT_A_MEDIA': 'Выберите медиа для вставки'
                    }
                }
            }
        },
        'MEDIA': {
            'VIEW': {
                'ARTICLES': 'Статьи, использующие эту медиа'
            },
            'LIST': {
                'SEARCH': 'Поиск:',
                'SUBMIT': 'Отправить',
                'VIEW': 'Открыть',
                'CATEGORY': {
                    'IMAGE': 'Изображение',
                    'AUDIO': 'Аудио'
                },
                'NO_MEDIA': 'В вики пока нет мультимедийных файлов.',
                'NOT_FOUND': 'Файлов по запросу не найдено',
                'CREATE_NEW': 'Добавьте первый!'
            },
            'EDIT': {
                'TITLE': 'Заголовок',
                'DESCRIPTION': 'Описание',
                'CONTENT': 'Медиа контент',
                'PREVIEW': 'Предпросмотр'
            }
        },
        'SETTINGS': {
            'VIEW': {
                'SETTINGS': 'Настройки',
                'ENABLED': 'Включено',
                'DISABLED': 'Выключено',
                'GENERAL': 'Основные',
                'LANGUAGE': 'Язык',
                'SYNCHRONIZATION': 'Синхронизация',
                'SYNCHRONIZATION_ON_STARTUP': 'Синхронизация при запуске приложения',
                'SYNCHRONIZATION_FREQUENCY': 'Частота синхронизации',
                'SYNC_FREQUENCY_1_HOUR': 'Каждый час',
                'SYNC_FREQUENCY_3_HOURS': 'Каждые 3 часа',
                'SYNC_FREQUENCY_6_HOURS': 'Каждые 6 часов',
                'SYNC_FREQUENCY_12_HOURS': 'Каждые 12 часов',
                'SYNC_FREQUENCY_24_HOURS': 'Каждые 24 часа',
                'SYNC_FREQUENCY_MANUAL': 'Исключительно вручную',
                'NODE': 'Узел',
                'NODE_NAME': 'Имя узла',
                'NETWORK_TOKEN': 'Ключ сети'
            }
        },
        'NODE': {
            'LIST': {
                'NODES': 'Узлы в сети',
                'NODE_NAME': 'Имя узла',
                'NODE_IS_CURRENT': 'Текущий узел',
                'ITEM': {
                    'CURRENT': {
                        'YES': 'Да',
                        'NO': 'Нет'
                    }
                }
            }
        }
    },
    'BUTTON': {
        'SAVE': 'Сохранить',
        'CANCEL': 'Отменить',
        'REFRESH_LIST': 'Обновить список',
        'SELECT_FILE': 'Выбрать файл'
    },
    'FORM': {
        'ERROR': {
            'REQUIRED': 'Это обязательное поле'
        },
        'SAVING': 'Сохранение'
    },
    'NOTIFICATION': {
        'NODE': {
            'SCAN_FINISHED': 'Поиск завершён',
            'DISCOVERED': 'Найдено узлов: {{count}}'
        },
        'SETTINGS': {
            'SAVE_SUCCESS': 'Параметры успешно сохранены',
            'SAVE_FAILURE': 'Упс! Не удалось сохранить.',
            'APPLY_LANGUAGE_FAILURE': 'Упс! Не удаётся применить выбранный язык.',
            'SAVE_FAILURE_TEXT': 'Произошла ошибка. Пожалуйста, попробуйте сохранить настройки ещё раз.',
            'VALIDATION_ERRORS': 'Параметры не сохранены',
            'FIX_ERRORS': 'Пожалуйста, проверьте правильность выбранных настроек'
        },
        'ARTICLE': {
            'SYNC_FINISHED': 'Синхронизация выполнена',
            'SAVE_SUCCESS': 'Статья успешно сохранена',
            'SAVE_FAILURE': 'Упс! Не удалось сохранить.',
            'SAVE_FAILURE_TEXT': 'Произошла ошибка. Пожалуйста, попробуйте сохранить статью ещё раз.',
            'VALIDATION_ERRORS': 'Статья не сохранена',
            'FIX_ERRORS': 'Пожалуйста, проверьте правильность данных'
        },
        'MEDIA': {
            'SYNC_FINISHED': 'Синхронизация выполнена',
            'SAVE_SUCCESS': 'Медиа успешно сохранена',
            'SAVE_FAILURE': 'Упс! Не удалось сохранить.',
            'SAVE_FAILURE_TEXT': 'Произошла ошибка. Пожалуйста, попробуйте сохранить ещё раз.',
            'VALIDATION_ERRORS': 'Медиа не сохранена',
            'FIX_ERRORS': 'Пожалуйста, проверьте правильность данных'
        }
    }
};
