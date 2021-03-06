'use strict';

var steamLoaded = false;

function getSteamFeeds() {
    $.get('https://newtonjoshua-com.appspot.com/steamfeeds',
        function (feeds) {
            var avatar = feeds.player.avatarfull;
            var profile = feeds.player.profileurl;

            function sortGame(game1, game2) {

                var game1_recent = game1.playtime_2weeks;
                var game2_recent = game2.playtime_2weeks;
                var game1_total = game1.playtime_forever;
                var game2_total = game2.playtime_forever;

                if (game1_recent && game2_recent) {
                    if (game1_recent < game2_recent) {
                        return 1;
                    }
                    if (game1_recent > game2_recent) {
                        return -1;
                    }
                }
                if (game1_recent && !game2_recent) {
                    return -1;
                }
                if (game1_total < game2_total) {
                    return 1;
                }
                if (game1_total > game2_total) {
                    return -1;
                }
                return 0;
            }

            feeds.games.sort(sortGame);
            feeds.games.forEach(function (game) {
                var icon = 'http://media.steampowered.com/steamcommunity/public/images/apps/' + game.appid + '/' + game.img_icon_url + '.jpg';
                var logo = 'http://media.steampowered.com/steamcommunity/public/images/apps/' + game.appid + '/' + game.img_logo_url + '.jpg';
                var playTime = Math.ceil(game.playtime_forever / 60);
                var appLink = 'http://store.steampowered.com/app/' + game.appid;
                var achievements = '';
                if (game.achievements) {
                    game.achievements.reverse();
                    game.achievements.forEach(function (achievement) {
                        if (achievement.icon && achievement.displayName) {
                            achievements = achievements + '<div class="media">' +
                                '<div class="media-left">' +
                                '<img class="media-object" style="border-radius:0%" src="' + achievement.icon + '"></div>' +
                                '<div class="media-body">' +
                                '<a href="http://steamcommunity.com/id/NewtonJoshua/stats/' + game.appid + '" target="_blank">' +
                                '<h4 class="media-heading">' + achievement.displayName + '</h4></a>' +
                                (achievement.description ? achievement.description : '') +
                                '</div></div>';
                        }
                    });
                }

                var elem = '<li class="media list-group-item p-a">' +
                    '<a class="media-left" href="' + profile + '" target="_blank">' +
                    '<img class="media-object img-circle" src="' + avatar + '"/>' + '</a>' +
                    '<div class="media-body">' +
                    ' <div class="media-heading">' +
                    '<a class="pull-right" href="' + appLink + '" target="_blank">' +
                    '<img class="media-object img-circle" src="' + icon + '"/>' + '</a>' +
                    ' <small class="pull-right text-muted">' + playTime + (playTime > 1 ? ' hours' : ' hour') + '</small>' +
                    '<a href="' + appLink + '"  target="_blank"><h5>' + game.name + '</h5>' +
                    '<img src="' + logo + '"></a></div><div class="panel-group">' +
                    (achievements ?
                        ('<br><div class="panel panel-default"><div class="panel-heading">' +
                            '<h4 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" href="#achievements' + game.appid + '">Achievements</a></h4></div>' +
                            '<div id="achievements' + game.appid + '" class="panel-collapse collapse"><div class="panel-body">' + achievements + '</div></div></div>') : '') +
                    (game.stats ?
                        ('<br><div class="panel panel-default"><div class="panel-heading">' +
                            '<h4 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" href="#stats' + game.appid + '">Statistics</a></h4></div>' +
                            '<div id="stats' + game.appid + '" class="panel-collapse collapse"><div class="panel-body">' +
                            '<div id="chart' + game.appid + '"></div></div></div></div>') : '') +
                    '</div></div></li>';

                $('#steamFeed').append(elem);

                if (game.stats) {
                    var statData = [['Name', 'Value']];
                    game.stats.forEach(function (stat) {
                        if (stat.displayName && stat.value) {
                            var displayName = stat.displayName.split('_').join(' ');
                            displayName = displayName.split('STAT ').join('');
                            //displayName = displayName.toLowerCase();
                            //displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                            displayName = displayName.replace(/\w\S*/g, function (txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            });
                            statData.push([displayName, stat.value]);
                        }
                    });
                    var data = google.visualization.arrayToDataTable(statData);
                    var options = {
                        title: 'Stats',
                        width: '100%'
                    };
                    var chart = new google.visualization.Table(
                        document.getElementById('chart' + game.appid));

                    chart.draw(data, options);
                }
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