'use strict';

// Google Analytics Report

//Read Only GA refresh token
var refreshToken = '1/zKrnUuw8m9jlpSPwAMy81kfCelHOT0iyGCKvasFLXs5IgOrJDtdun6zK6XiATCKT';

google.charts.load('current', {
    'packages': ['corechart', 'geochart', 'table']
});

//Draw country Chart
function drawRegionsMap(data) {

    data = google.visualization.arrayToDataTable(data);
    var options = {
        title: 'NewtonJoshua.com is viewed from,',
        domain: 'IN',
        tooltip: {
            textStyle: {
                color: 'navy'
            },
            showColorCode: true
        },
        legend: {
            textStyle: {
                color: 'navy',
                fontSize: 12
            }
        },
        colorAxis: {
            colors: ['#00FFFF', '#0000FF']
        }
    };

    var chart = new google.visualization.GeoChart(document.getElementById('countryChart'));

    chart.draw(data, options);
}

// Draw browser chart

function drawPieChart(data) {

    data = google.visualization.arrayToDataTable(data);

    var options = {
        title: 'Browser:',
        titleTextStyle: {
            color: 'navy',
            fontName: 'Times New Roman',
            fontSize: 16,
        },
        //pieHole: 0.4,
        chartArea: {
            width: '100%'
        },
        is3D: true,
        legend: {
            position: 'labeled',
            maxLines: 5,
            textStyle: {
                color: 'navy',
                fontSize: 12
            }
        },
    };


    var chart = new google.visualization.PieChart(document.getElementById('browserChart'));
    chart.draw(data, options);
}

//Get Country Data
function gaGetCountry() {
    $.get('https://www.googleapis.com/analytics/v3/data/ga?' +
        'ids=ga%3A104796047&' +
        'start-date=2015-07-01&' +
        'end-date=today&' +
        'metrics=ga%3Ausers&' +
        'dimensions=ga%3Acountry&' +
        'sort=ga%3Ausers&' +
        'filters=ga%3Ausers%3E10&' +
        'max-results=50' +
        '&access_token=' + localStorage.access_token,
        function (data, status) {
            if (status === 'success') {
                var head = data.rows[0];
                head[0] = 'Country';
                head[1] = 'Users';
                for (var i = 1; i < data.rows.length; i++) {
                    var d = data.rows[i];
                    d[1] = Number(d[1]);
                }
                drawRegionsMap(data.rows);
            } else {
                console.debug(status);
            }

        });
}

//Get Browser Data
function gaGetBrowser() {
    $.get('https://www.googleapis.com/analytics/v3/data/ga?' +
        'ids=ga%3A104796047&' +
        'start-date=2015-07-01&' +
        'end-date=today&' +
        'metrics=ga%3Ausers&' +
        'dimensions=ga%3Abrowser&' +
        '&access_token=' + localStorage.access_token,
        function (data, status) {
            if (status === 'success') {
                var head = data.rows[0];
                head[0] = 'Browsers';
                head[1] = 'Users';
                for (var i = 1; i < data.rows.length; i++) {
                    var d = data.rows[i];
                    d[1] = Number(d[1]);
                }
                drawPieChart(data.rows);
            } else {
                console.debug(status);
            }

        });
}
// Get AccessToken from Refresh Token
function gaGetToken() {
    $.post('https://www.googleapis.com/oauth2/v3/token', {
        client_id: '836282602576-qtdor9pmimt5vm9opi208nuui4tv8t8l.apps.googleusercontent.com',
        client_secret: 'H2SnX7QZK_xfEjH91Gj7dQX3',
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }, function (data, status) {
        if (status === 'success') {
            console.debug('New Token');
            localStorage.access_token = data.access_token;
            gaGetCountry();
            gaGetBrowser();
        } else {
            console.debug(status);
        }
    });
}

// Check Validity of Access Token
function checkValidity() {
    $.post('https://www.googleapis.com/oauth2/v1/tokeninfo', {
            access_token: localStorage.access_token
        }).done(function (data, status) {
            if (status === 'success') {
                console.debug(data.expires_in);
                console.debug(data.hasOwnProperty('expires_in'));
                var check = false;
                check = data.hasOwnProperty('expires_in');
                if (check) {
                    gaGetCountry();
                    gaGetBrowser();
                }
                if (!check) {
                    gaGetToken();
                }
            } else {
                console.debug(status);
            }

        })
        .fail(function (data) {
            console.debug(data);
            gaGetToken();
        });
}

function gaReport() {

    if (localStorage.access_token === null) {
        console.debug('No token');
        gaGetToken();
    }
    if (localStorage.access_token !== null) {
        console.debug(localStorage.access_token);
        checkValidity();
    }

}

google.charts.setOnLoadCallback(gaReport);