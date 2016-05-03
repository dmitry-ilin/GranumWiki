var appName = require('electron').remote.app.getName();

module.exports = {
    'DARWIN': {
        'ABOUT': 'About ' + appName,
        'SERVICES': 'Services',
        'HIDE': 'Hide ' + appName,
        'HIDE_OTHERS': 'Hide others',
        'SHOW_ALL': 'Show All',
        'QUIT': 'Quit',
        'BRING_ALL_TO_FRONT': 'Bring All to Front'
    },
    'ARTICLE': {
        'ARTICLE': 'Article',
        'NEW': 'New',
        'EDIT': 'Edit',
        'SAVE': 'Save',
        'COPY_ID': 'Copy Article ID to clipboard',
        'COPY_LINK': 'Copy Article Link to clipboard',
        'SYNCHRONIZE_ARTICLES': 'Synchronize Articles'
    },
    'MEDIA': {
        'MEDIA': 'Media',
        'NEW': 'New',
        'EDIT': 'Edit',
        'SAVE': 'Save',
        'COPY_ID': 'Copy Media ID to clipboard',
        'COPY_CODE': 'Copy Media Code to clipboard',
        'SYNCHRONIZE_MEDIA_ITEMS': 'Synchronize Media Items'
    },
    'EDIT': {
        'EDIT': 'Edit',
        'UNDO': 'Undo',
        'REDO': 'Redo',
        'CUT': 'Cut',
        'COPY': 'Copy',
        'PASTE': 'Paste',
        'SELECT_ALL': 'Select All'
    },
    'SEARCH': {
        'SEARCH': 'Search',
        'PAGE_SEARCH': 'Page search',
        'GLOBAL_SEARCH': 'Global search'
    },
    'VIEW': {
        'VIEW': 'View',
        'RELOAD': 'Reload',
        'TOGGLE_FULL_SCREEN': 'Toggle Full Screen',
        'TOGGLE_DEVELOPER_TOOLS': 'Toggle Developer Tools'
    },
    'WINDOW': {
        'WINDOW': 'Window',
        'MINIMIZE': 'Minimize Window',
        'NEW_WINDOW': 'New Window',
        'CLOSE': 'Close'
    },
    'HELP': {
        'HELP': 'Help',
        'LEARN_MORE': 'Learn More'
    },
    'TITLEBAR': {
        'SEARCH': 'Search'
    },
    'SIDEBAR': {
        'MENU': 'Menu',
        'SEARCH': 'Search',
        'MEDIA': 'Media',
        'SETTINGS': 'Settings',
        'RECENT_ARTICLES': 'Recent articles',
        'NODES': 'Connected Nodes'
    },
    'SEARCHBAR': {
        'PAGE_SEARCH': 'Page Search',
        'TOTAL_RESULTS': 'Total results:'
    },
    'EDITOR': {
        'TOOLBAR': {
            'BOLD': 'Bold',
            'ITALIC': 'Italic',
            'STRIKETHROUGH': 'Strikethrough',
            'HEADING': 'Heading',
            'CODE': 'Code',
            'QUOTE': 'Quote',
            'GENERIC_LIST': 'Generic List',
            'NUMBERED_LIST': 'Numbered List',
            'CREATE_LINK': 'Create Link',
            'INSERT_IMAGE': 'Insert Image',
            'INSERT_MEDIA': 'Insert Media',
            'INSERT_TABLE': 'Insert Table',
            'INSERT_HORIZONTAL_LINE': 'Insert Horizontal Line',
            'TOGGLE_PREVIEW': 'Toggle Preview',
            'TOGGLE_SIDE_BY_SIDE': 'Toggle Side by Side',
            'TOGGLE_FULLSCREEN': 'Toggle Fullscreen',
            'MARKDOWN_GUIDE': 'Markdown Guide'
        }
    },
    'NGVIEW': {
        'ARTICLE': {
            'LIST': {
                'SEARCH': 'Search:',
                'SUBMIT': 'Submit',
                'NO_ARTICLES': 'There are no articles yet.',
                'NOT_FOUND': 'Nothing found by your request',
                'CREATE_NEW': 'Create your first one!'
            },
            'EDIT': {
                'TITLE': 'Title',
                'CONTENT': 'Content',
                'MEDIA': {
                    'SELECTOR': {
                        'SELECT': 'Select',
                        'SELECT_A_MEDIA': 'Select a Media to insert'
                    }
                }
            },
            'VIEW': {
                'NOT_FOUND': 'Article not found'
            }
        },
        'MEDIA': {
            'VIEW': {
                'ARTICLES': 'Articles with this media'
            },
            'LIST': {
                'SEARCH': 'Search:',
                'SUBMIT': 'Submit',
                'VIEW': 'View',
                'CATEGORY': {
                    'IMAGE': 'Image',
                    'AUDIO': 'Audio'
                },
                'NO_MEDIA': 'There are no media items yet.',
                'NOT_FOUND': 'Nothing found by your request',
                'CREATE_NEW': 'Add your first one!'
            },
            'EDIT': {
                'TITLE': 'Title',
                'DESCRIPTION': 'Description',
                'CONTENT': 'Media content',
                'PREVIEW': 'Preview'
            }
        },
        'SETTINGS': {
            'VIEW': {
                'SETTINGS': 'Settings',
                'ENABLED': 'Enabled',
                'DISABLED': 'Disabled',
                'GENERAL': 'General',
                'LANGUAGE': 'Language',
                'SYNCHRONIZATION': 'Synchronization',
                'SYNCHRONIZATION_ON_STARTUP': 'Synchronization on App Startup',
                'SYNCHRONIZATION_FREQUENCY': 'Synchronization frequency',
                'SYNC_FREQUENCY_1_HOUR': 'Every 1 hour',
                'SYNC_FREQUENCY_3_HOURS': 'Every 3 hours',
                'SYNC_FREQUENCY_6_HOURS': 'Every 6 hours',
                'SYNC_FREQUENCY_12_HOURS': 'Every 12 hours',
                'SYNC_FREQUENCY_24_HOURS': 'Every 24 hours',
                'SYNC_FREQUENCY_MANUAL': 'Manual only',
                'NODE': 'Node',
                'NODE_NAME': 'Node name',
                'NETWORK_TOKEN': 'Network token'
            }
        },
        'NODE': {
            'LIST': {
                'NODES': 'Nodes',
                'NODE_NAME': 'Node name',
                'NODE_IS_CURRENT': 'Is current node',
                'ITEM': {
                    'CURRENT': {
                        'YES': 'Yes',
                        'NO': 'No'
                    }
                }
            }
        }
    },
    'BUTTON': {
        'SAVE': 'Save',
        'CANCEL': 'Cancel',
        'REFRESH_LIST': 'Refresh list',
        'SELECT_FILE': 'Select file'
    },
    'FORM': {
        'ERROR': {
            'REQUIRED': 'This field is required'
        },
        'SAVING': 'Saving'
    },
    'NOTIFICATION': {
        'NODE': {
            'SCAN_FINISHED': 'Scan finished',
            'DISCOVERED': 'Discrovered {{count}} node(s)'
        },
        'SETTINGS': {
            'SAVE_SUCCESS': 'Successfully saved',
            'SAVE_FAILURE': 'Ooops! Not saved.',
            'APPLY_LANGUAGE_FAILURE': 'Ooops! Cannot apply chosen language.',
            'SAVE_FAILURE_TEXT': 'There was an error. Please, try to save settings again.',
            'VALIDATION_ERRORS': 'Not saved',
            'FIX_ERRORS': 'Please, see validation errors'
        },
        'ARTICLE': {
            'SYNC_FINISHED': 'Synchronization completed',
            'SAVE_SUCCESS': 'Successfully saved',
            'SAVE_FAILURE': 'Ooops! Not saved.',
            'SAVE_FAILURE_TEXT': 'There was an error. Please, try to save again.',
            'VALIDATION_ERRORS': 'Not saved',
            'FIX_ERRORS': 'Please, see validation errors'
        },
        'MEDIA': {
            'SYNC_FINISHED': 'Synchronization completed',
            'SAVE_SUCCESS': 'Successfully saved',
            'SAVE_FAILURE': 'Ooops! Not saved.',
            'SAVE_FAILURE_TEXT': 'There was an error. Please, try to save again.',
            'VALIDATION_ERRORS': 'Not saved',
            'FIX_ERRORS': 'Please, see validation errors'
        }
    }
};
