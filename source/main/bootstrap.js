var logger          = require('./common/logger'),
    mediaProtocol   = require('./protocol/media'),
    sequelize       = require('./db/sequelize'),
    Article         = require('./db/model/article'),
    FtsArticle      = require('./db/model/fts-article'),
    ArticleChecksum = require('./db/model/article-checksum'),
    Media           = require('./db/model/media'),
    FtsMedia        = require('./db/model/fts-media'),
    MediaChecksum   = require('./db/model/media-checksum');

/**
 * Database relations initialization
 */
ArticleChecksum.belongsTo(Article);
Article.hasOne(ArticleChecksum);
MediaChecksum.belongsTo(Media);
Media.hasOne(MediaChecksum, { foreignKey: 'media_id' });

/**
 * Database tables initialization
 */
Article.sync();
ArticleChecksum.sync();
// Sort of FtsArticle.sync();
sequelize.query("CREATE VIRTUAL TABLE IF NOT EXISTS fts_article USING fts4 (content='article', title, content, hashtags)");

Media.sync();
MediaChecksum.sync();
// Sort of FtsMedia.sync();
sequelize.query("CREATE VIRTUAL TABLE IF NOT EXISTS fts_media USING fts4 (content='media', title, description, hashtags)");

/**
 * IPC services initialization
 */
var settings = require('./settings');
var settingsIpc = require('./ipc/settings');
var articleIpc = require('./ipc/article');
var mediaIpc = require('./ipc/media');
var nodeIpc = require('./ipc/node');

/**
 * Networking services initialization
 */
var subscriberProviderArticleModifications = require('./exchange/subscriber/article-modifications');
var publisherProviderArticleModifications = require('./exchange/publisher/article-modifications');

var responderProviderArticle = require('./exchange/responder/article');
var requesterProviderArticle = require('./exchange/requester/article');

var subscriberProviderMediaModifications = require('./exchange/subscriber/media-modifications');
var publisherProviderMediaModifications = require('./exchange/publisher/media-modifications');

var responderProviderMedia = require('./exchange/responder/media');
var requesterProviderMedia = require('./exchange/requester/media');

var responderProviderNode = require('./exchange/responder/node');
var requesterProviderNode = require('./exchange/requester/node');

var syncTimer = require('./common/sync-timer');


process.on('uncaughtException', (err) => {
    logger.fatal(`Uncaught exception: ${err}`);
    logger.fatal(`Stack trace: ${err.stack}`);
    process.exit(1);
});
