'use strict';

var fbPaging = '';

function formatPhoto(pic) {
    return '<div style="margin-bottom: 10px; margin-right: 10px; display: inline-block; vertical-align: bottom;"> ' +
        '<img data-action="zoom" src="' + pic.source + '" style="height: 223px;"></div>';
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '771830059601215',
        xfbml: true,
        version: 'v2.7'
    });
    var accessToken = 'EAAK9ZBbCHjT8BADwrM3oubWtUAIeZCyXeKiA7JAaTFmIgnt9e7QcSCYvfZAI5tUA1xxbFhrcpkwINbMLn52sXD68a7VYdQgOmO62uTfrzS5QJAso2VAX2JbQZAKGAHVPb3mrW3aVteJqHMGqkoOoO8C97ez74ZBQZD';
    FB.api(
        '/me',
        'GET', {
            'fields': 'photos{images},picture,cover',
            access_token: accessToken
        },
        function (response) {
            $('#profilePic').attr('src', response.picture.data.url);
            $('#coverPic').css('background-image', 'url(' + response.cover.source + ')');
            response.photos.data.forEach(function (photo) {
                var pic = photo.images[0];
                var elem = formatPhoto(pic);
                $('#fbPics').append(elem);
            });
            if (response.photos.paging.next) {
                fbPaging = response.photos.paging.next;
            }
            //            $(window).trigger('resize');
        }
    );
};

//Load more Photos on page down
$(window).scroll(function () {
    var documentHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if (documentHeight * 0.9 < scrollPosition && fbPaging !== '') {
        $.get(fbPaging, function (photos) {
            photos.data.forEach(function (photo) {
                var pic = photo.images[0];
                var elem = formatPhoto(pic);
                $('#fbPics').append(elem);

            });
            if (photos.paging.next) {
                fbPaging = photos.paging.next;
            } else {
                fbPaging = '';
                //                $(window).trigger('resize');
            }
        });
        $(window).trigger('resize');
    }
});