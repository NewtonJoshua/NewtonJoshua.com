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

function gitHubFeeds() {
    var feed = new google.feeds.Feed('https://github.com/NewtonJoshua.atom');
    feed.setNumEntries(500);
    feed.load(function (result) {
        if (!result.error) {
            result.feed.entries.forEach(function (feed) {
                var elem = '<li class="media list-group-item p-a">' +
                    '<a class="media-left" href="#">' +
                    '<img class="media-object img-circle" src="https://avatars1.githubusercontent.com/u/12285163?v=3&s=460">' + '</a>' +
                    '<div class="media-body">' +
                    ' <div class="media-heading">' +
                    ' <small class="pull-right text-muted">' + formatDate(feed.publishedDate) + '</small>' +
                    ' <h5><a href="' + feed.link + '"  target="_blank">' + feed.title + '</a></h5>' +
                    '</div>' +
                    formatGitContent(feed.content) +
                    '</div>' +
                    '</li>';

                $('#gitFeed').append(elem);
            });
        }
    });
}

google.setOnLoadCallback(gitHubFeeds);