'use strict';

var steamLoaded = false;

function getSteamFeeds() {
    $.get('https://1-dot-newton-angelin.appspot.com/steamfeeds',
        function (feeds) {
            feeds.response.forEach(function (feed) {
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
                $('#stackFeed').append(elem);
            });
        });
}


$('#steamTab').click(function () {
    if (!steamLoaded) {
        getSteamFeeds();
        steamLoaded = true;
    }

});

function loadMoreStackFeed() {

}