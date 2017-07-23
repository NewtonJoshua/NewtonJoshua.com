'use strict';

var gitFeedsLoaded = false;

function formatGitContent(content) {
    if (content.indexOf('<code>') !== -1) {
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
    $.get('https://newtonjoshua-com.appspot.com/feed?url=https://github.com/NewtonJoshua.atom', function(result){
        if (!result.error) {
            result.feed.entry.forEach(function (feed) {
                var elem = '<li class="media list-group-item p-a">' +
                    '<a class="media-left" href="#">' +
                    '<img class="media-object img-circle" src="https://avatars1.githubusercontent.com/u/12285163?v=3&s=460">' + '</a>' +
                    '<div class="media-body">' +
                    ' <div class="media-heading">' +
                    ' <small class="pull-right text-muted">' + formatDate(feed.published) + '</small>' +
                    ' <h5><a href="' + feed.link.href + '"  target="_blank">' + feed.title.content + '</a></h5>' +
                    '</div>' +
                    formatGitContent(feed.content.content) +
                    '</div>' +
                    '</li>';

                $('#gitFeed').append(elem);
            });
        }
    });
    gitFeedsLoaded = true;
}

$('#gitTab').click(function () {
    if (!gitFeedsLoaded) {
        gitHubFeeds();
    }
});