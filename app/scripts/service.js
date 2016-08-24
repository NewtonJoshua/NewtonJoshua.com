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
    return month + ' ' + day + ', ' + year.toString().split("20")[1]
}