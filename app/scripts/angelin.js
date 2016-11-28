'use strict';

// FB

window.fbAsyncInit = function () {
    FB.init({
        appId: '771830059601215',
        xfbml: true,
        version: 'v2.7'
    });
    var fbId = '100006515688958';
    var accessToken = 'EAAK9ZBbCHjT8BAOqRQEGOTMGPrEkpC6t5wowBtF8ZB35dDhKFnx9ffiZCbyLr7lfL74twAuiiIl9US3tNrfvCE7kmvKifZABh2bOzaBPdBvSBAilKfxFPdGXMhcDuPtglCJbWcUNliynsje6LIQP0W9sNFcMnpMZD';
    FB.api(
        '/' + fbId,
        'GET', {
            fields: 'picture{url},cover',
            access_token: accessToken
        },
        function (response) {
            if (response.picture.data.url) {
                document.getElementById('myPicture').src = response.picture.data.url;
            }
            if (response.cover.source) {
                document.getElementById('cover').style.backgroundImage = 'url(' + response.cover.source + ')';
            }
            if (response.error) {
                console.error(response.error.message);
            }
        }
    );
};

// Git Feeds

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
    var feed = new google.feeds.Feed('https://github.com/AngelinElfieda.atom');
    feed.setNumEntries(500);
    feed.load(function (result) {
        if (!result.error) {
            result.feed.entries.forEach(function (feed) {
                var elem = '<li class="list-group-item p-a">' +
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

// Stack Feeds

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


function getStackFeeds() {

    $.get('https://api.stackexchange.com/2.2/users/7029019/timeline?site=stackoverflow&filter=!))x30_z', function (feeds) {
        feeds.items.forEach(function (feed) {
            var title = feed.detail || feed.title;
            var feedDate = formatDate(feed.creation_date * 1000);
            var elem = '<li class="list-group-item p-a">' +
                '<div class="media-body">' +
                ' <div class="media-heading">' +
                ' <small class="pull-right text-muted">' + feedDate + '</small>' +
                '<a href="' + feed.link + '"  target="_blank"><h5>' + timelineType[feed.timeline_type] + '</h5></a></div></div>' +
                '<p>' + (feed.timeline_type === 'badge' ? '<img src="images/badges/bronze.jpg"> ' : '') + title + '</p>' +
                '</li>';
            $('#stackFeed').append(elem);
        });

    });

}

getStackFeeds();


// Service

var monthNames = [
                'Jan', 'Feb', 'Mar',
                'Aprl', 'May', 'Jun', 'Jul',
                'Aug', 'Sep', 'Oct',
                'Nov', 'Dec'
            ];

function formatDate(date) {
    date = new Date(date);
    var day = date.getDate();
    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();
    return (month + ' ' + day + ', ' + year.toString().split('20')[1]);
}