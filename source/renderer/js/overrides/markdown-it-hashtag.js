/*! markdown-it-hashtag 0.4.0 https://github.com/svbergerem/markdown-it-hashtag @license MIT */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitHashtag = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Process #hashtag

'use strict';

//////////////////////////////////////////////////////////////////////////
// Renderer partials

function hashtag_open(tokens, idx) {
  var tagName = tokens[idx].content.toLowerCase();
  return '<a href="/tags/' + tagName + '" class="tag">';
}

function hashtag_close() { return '</a>'; }

function hashtag_text(tokens, idx) {
  return '#' + tokens[idx].content;
}

//////////////////////////////////////////////////////////////////////////

function isLinkOpen(str)  { return /^<a[>\s]/i.test(str); }
function isLinkClose(str) { return /^<\/a\s*>/i.test(str); }

module.exports = function hashtag_plugin(md, options) {

  var arrayReplaceAt = md.utils.arrayReplaceAt,
      escapeHtml = md.utils.escapeHtml,
      regex,
      hashtagRegExp = '\\w+',
      preceding     = '^|\\s';

  if (options) {
    if (typeof options.preceding !== 'undefined') {
      preceding = options.preceding;
    }
    if (typeof options.hashtagRegExp !== 'undefined') {
      hashtagRegExp = options.hashtagRegExp;
    }
    if (typeof options.hashtagOpen !== 'undefined') {
      hashtag_open = options.hashtagOpen;
    }
    if (typeof options.hashtagText !== 'undefined') {
      hashtag_open = options.hashtagOpen;
    }
    if (typeof options.hashtagClose !== 'undefined') {
      hashtag_close = options.hashtagClose;
    }
  }

  regex = new RegExp('(' + preceding + ')#(' + hashtagRegExp + ')', 'g');


  function hashtag(state) {
    var i, j, l, m,
        tagName,
        currentToken,
        token,
        tokens,
        Token = state.Token,
        blockTokens = state.tokens,
        htmlLinkLevel,
        matches,
        text,
        nodes,
        pos,
        level;

    for (j = 0, l = blockTokens.length; j < l; j++) {
      if (blockTokens[j].type !== 'inline') { continue; }

      tokens = blockTokens[j].children;

      htmlLinkLevel = 0;

      for (i = tokens.length - 1; i >= 0; i--) {
        currentToken = tokens[i];

        // skip content of markdown links
        if (currentToken.type === 'link_close') {
          i--;
          while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
            i--;
          }
          continue;
        }

        // skip content of html links
        if (currentToken.type === 'html_inline') {
          // we are going backwards, so isLinkOpen shows end of link
          if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
            htmlLinkLevel--;
          }
          if (isLinkClose(currentToken.content)) {
            htmlLinkLevel++;
          }
        }
        if (htmlLinkLevel > 0) { continue; }

        if (currentToken.type !== 'text') { continue; }

        // find hashtags
        text = currentToken.content;
        matches = text.match(regex);

        if (matches === null) { continue; }

        nodes = [];
        level = currentToken.level;

        for (m = 0; m < matches.length; m++) {
          tagName = matches[m].split('#', 2)[1];

          // find the beginning of the matched text
          pos = text.indexOf(matches[m]);
          // find the beginning of the hashtag
          pos = text.indexOf('#' + tagName, pos);

          if (pos > 0) {
            token         = new Token('text', '', 0);
            token.content = text.slice(0, pos);
            token.level   = level;
            nodes.push(token);
          }

          token         = new Token('hashtag_open', '', 1);
          token.content = tagName;
          token.level   = level++;
          nodes.push(token);

          token         = new Token('hashtag_text', '', 0);
          token.content = escapeHtml(tagName);
          token.level   = level;
          nodes.push(token);

          token         = new Token('hashtag_close', '', -1);
          token.level   = --level;
          nodes.push(token);

          text = text.slice(pos + 1 + tagName.length);
        }

        if (text.length > 0) {
          token         = new Token('text', '', 0);
          token.content = text;
          token.level   = level;
          nodes.push(token);
        }

        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }

  md.core.ruler.after('inline', 'hashtag', hashtag);
  md.renderer.rules.hashtag_open  = hashtag_open;
  md.renderer.rules.hashtag_text  = hashtag_text;
  md.renderer.rules.hashtag_close = hashtag_close;
};

},{}]},{},[1])(1)
});