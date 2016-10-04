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
    var tab = $('#tabContent'),
        active = tab.find('.tab-pane.active'),
        activeId = active[0].id;
    if (activeId === 'fbFeed') {
        loadMoreFBFeed();
    }
}

$(window).scroll(function () {
    if (isScrollBottom()) {
        loadMoreFeed();
    }
});