'use strict';

google.load('feeds', '1');

function formatGitContent(content) {
    if (content.includes('<code>')) {
        var res = content.split('<code>');
        var res1 = res[1].split('</code>');
        var commit  = res1[0].replace('href="', 'target="_blank" href="https://github.com');
        res = content.split('<blockquote>');
        res1 = res[1].split('</blockquote>');
        var description = res1[0];
        return ('<blockquote>' + description + '<footer>' + commit  + '</footer></blockquote>');
    } else {
        return '';
    }
}

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
    $.get('https://api.stackexchange.com/2.2/users/6778969/timeline?site=stackoverflow&filter=!))x30_z', function (feeds) {
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
                (feed.timeline_type !== 'badge' ? ('</div><blockquote>' + (feed.detail ? feed.detail : feed.title) + '</blockquote></div></a>') :
                    ('</a></div><div id="badge' + feedId + '"></div></div>')) +
                '<div id="feedId' + feedId + '"></div>' +
                '</li>';
            $(stackFeed).append(elem);
        });
        var feed = new google.feeds.Feed('http://stackoverflow.com/feeds/user/6778969');
        feed.setNumEntries(500);
        feed.load(function (result) {
            result.feed.entries.forEach(function (xmlFeed) {
                feedArray.some(function (feed, key) {
                    var xmlFeedDate = (new Date(xmlFeed.publishedDate)).getTime();
                    var feedDate = (new Date(feed.creation_date * 1000)).getTime();
                    if (feed.timeline_type !== 'badge' && xmlFeed.title.includes(feed.title) && xmlFeedDate === feedDate) {
                        console.log(xmlFeed.content);
                        $('#feedId' + key).append(xmlFeed.content);
                        return true;
                    }
                });
            });
        });
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

google.setOnLoadCallback(getStackFeeds);

function loadMoreStackFeed() {

}