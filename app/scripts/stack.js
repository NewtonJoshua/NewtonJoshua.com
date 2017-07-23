'use strict';

var stackLoaded = false;

var timelineType = {
    accepted: 'Accepted An Answer',
    answered: 'Posted An Answer',
    asked: 'Asked A Question',
    badge: 'Earned A Badge',
    commented: 'Posted A Comment',
    reviewed: 'Reviewed A Suggested Edit',
    revision: 'Edited A Post',
    suggested: 'Suggested An Edit'
};

var feedArray = [];
var feedId = 0;

function getStackFeeds() {
    $.get('https://api.stackexchange.com/2.2/users/6778969/timeline?site=stackoverflow&pagesize=100&filter=!))x30_z', function (feeds) {
        feeds.items.forEach(function (feed) {
            feedId++;
            feedArray[feedId] = feed;
            var elem = '<li class="media list-group-item p-a">' +
                '<a class="media-left" href="#">' +
                '<img class="media-object img-circle" src="https://avatars1.githubusercontent.com/u/12285163?v=3&s=460">' + '</a>' +
                '<div class="media-body">' +
                ' <div class="media-heading">' +
                ' <small class="pull-right text-muted">' + formatDate(feed.creation_date * 1000) + '</small>' +
                '<a href="' + feed.link + '"  target="_blank"><h5>' + timelineType[feed.timeline_type] + '</h5>' +
                (feed.timeline_type !== 'badge' ? ('</div><blockquote>' +
                        (feed.timeline_type !== 'commented' ? (feed.detail ? feed.detail : feed.title) : feed.title) +
                        '</blockquote></div></a>') :
                    ('</a></div><div id="badge' + feedId + '"></div></div>')) +
                '<div id="feedId' + feedId + '"></div>' +
                '</li>';
            $('#stackFeed').append(elem);
        });

        // Display detailed content
        $.get('https://newtonjoshua-com.appspot.com/feed?url=http://stackoverflow.com/feeds/user/6778969', function (result) {
            if (!result.error) {
                result.feed.entry.forEach(function (xmlFeed) {
                    feedArray.some(function (feed, key) {
                        var xmlFeedDate = (new Date(xmlFeed.published)).getTime();
                        var feedDate = (new Date(feed.creation_date * 1000)).getTime();
                        if (feed.timeline_type !== 'badge' && (xmlFeed.title.content.indexOf(feed.title) !== -1) && xmlFeedDate === feedDate) {
                            $('#feedId' + key).append(xmlFeed.summary.content);
                            return true;
                        }
                    });
                });
            }
            formatCode();
        });

        // Display Badge details
        $.get('https://api.stackexchange.com/2.2/users/6778969/badges?order=desc&sort=rank&site=stackoverflow&filter=!4(EI32hSwYgOGH2hM', function (badges) {
            badges.items.forEach(function (badge) {
                feedArray.some(function (feed, key) {
                    if (badge.badge_id === feed.badge_id) {
                        var badgeHtml = '<blockquote><img src="images/badges/' + badge.rank + '.jpg"/>  <a href="' + feed.link + '"  target="_blank">' +
                            (feed.detail ? feed.detail : feed.title) +
                            '</a><footer>' + badge.description + '</footer></blockquote>';
                        $('#badge' + key).html(badgeHtml);
                        return true;
                    }
                });
            });
        });

    });

}


$('#stackTab').click(function () {
    if (!stackLoaded) {
        getStackFeeds();
        stackLoaded = true;
    }

});

function loadMoreStackFeed() {

}

function formatCode() {
    $("pre code").each(function (index, code) {
        // Format comments - ignore spaces between // and comments
        var stripCommentSpaces = code.textContent.replace(/\/\/\s+/g, '//');
        // Add line break - replace 4 space with new line
        var addNewLine = stripCommentSpaces.replace(/\s{4}/g, '<br>');
        // Add tab spaces - add 4 spaces for all the line break but the first
        var addCodeTabs = addNewLine.replace(/<br><br>/g, '<br>    ').replace(/\s{4}<br>/g, '    ');
        // support html tags
        var htmlContent = addCodeTabs.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&lt;br&gt;/g, '<br>');
        // replace the code with the formatted code
        code.innerHTML = htmlContent;
    });
}