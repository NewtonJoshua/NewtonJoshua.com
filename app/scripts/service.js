'use strict';

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



function isScrollBottom() {
    var documentHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    return (documentHeight === scrollPosition);
}

function loadMoreFeed() {
    loadMoreFBFeed();
    loadMoreGitFeed();
}

$(window).scroll(function () {
    if (isScrollBottom()) {
        loadMoreFeed();
        console.log('scroll end');
    }
});