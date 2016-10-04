'use strict';

var feeds = [];
var picUrl = '';
var fbPaging = '';

//Get FaceBook Feeds
window.fbAsyncInit = function () {
    FB.init({
        appId: '771830059601215',
        xfbml: true,
        version: 'v2.7'
    });
    var accessToken = 'EAAK9ZBbCHjT8BAOqRQEGOTMGPrEkpC6t5wowBtF8ZB35dDhKFnx9ffiZCbyLr7lfL74twAuiiIl9US3tNrfvCE7kmvKifZABh2bOzaBPdBvSBAilKfxFPdGXMhcDuPtglCJbWcUNliynsje6LIQP0W9sNFcMnpMZD';
    FB.api(
        '/me',
        'GET', {
            fields: 'id,picture{url},cover,feed{permalink_url,created_time,link,picture,full_picture,message,story,from,likes.limit(0).summary(true)}',
            access_token: accessToken
        },
        function (response) {
            if (response.picture.data.url) {
                console.debug('updated');
                document.getElementById('myPicture').src = response.picture.data.url;
                document.getElementById('thumbPic').src = response.picture.data.url;
                picUrl = response.picture.data.url;
            } else {
                picUrl = 'images/picture.jpg';
            }
            if (response.cover.source) {
                console.debug('updated');
                document.getElementById('cover').style.backgroundImage = 'url(' + response.cover.source + ')';
            }
            if (response.feed.data) {
                response.feed.data.forEach(function (feed) {
                    if (feed.story) {
                        var elem = formatFBFeed(feed);
                        $('#fbFeed').append(elem);
                        if (feed.from.id === response.id) {
                            feeds.push(feed);
                        }
                    }
                });

                document.getElementById('myStatus').innerHTML = feeds[0].story;
            }
            if (response.feed.paging.next) {
                fbPaging = response.feed.paging.next;
            }

            if (response.error) {
                console.error(response.error.message);
            }
        }
    );
};

//Load more feeds on page down
function loadMoreFBFeed() {
    $.get(fbPaging, function (feeds) {
        feeds.data.forEach(function (feed) {
            if (feed.story) {
                var elem = formatFBFeed(feed);
                $('#fbFeed').append(elem);
            }

        });
        if (feeds.paging.next) {
            fbPaging = feeds.paging.next;
        }
    });
}

function formatFBFeed(feed) {
    return '<li class="media list-group-item p-a">' +
        '<a class="media-left" href="#">' +
        '<img class="media-object img-circle" src="' + picUrl + '">' + '</a>' +
        '<div class="media-body">' +
        ' <div class="media-heading">' +
        ' <small class="pull-right text-muted">' + formatDate(feed.created_time) + '</small>' +
        ' <h5><a href="' + (feed.permalink_url || feed.link) + '"  target="_blank">' + feed.story + '</a></h5>' +
        '</div>' +
        '<p>' + (feed.message ? feed.message : '') + '</p>' +
        '<div class="media-body-inline-grid" data-grid="images">' +
        (feed.full_picture ? '<img data-width="640" data-height="640" data-action="zoom" src=' + feed.full_picture + '>' : '') +
        '</div>' +
        (feed.likes.summary.total_count ? ('<button type="button" class="btn btn-xs btn-pill btn-default"><img src="images/logos/ThumbsUp%20Small.png" height="15px"> ' + feed.likes.summary.total_count + ' </button>') : '') +
        '</li>';
}