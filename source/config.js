module.exports = {
    indexFile: 'file://' + __dirname + '/renderer/index.html',
    media: {
        allowedMimeTypes: {
            // Allowed image files
            'image/jpeg':   'image',
            'image/png':    'image',
            'image/gif':    'image',
            // Allowed audio files
            'audio/mpeg':   'audio',
            'audio/ogg':    'audio',
            'audio/webm':   'audio'
        }
    },
    window: {
        minHeight: 480,
        minWidth: 640,
        maxInitialHeight: 800,
        maxInitialWidth: 1200,
        heightInitialRatio: 1.3,
        widthInitialRatio: 1.5
    },
    learnMoreUrl: 'https://github.com/dmitry-ilin/GranumWiki',
    developerMode: false
};
