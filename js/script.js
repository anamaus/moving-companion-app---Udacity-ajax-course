function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var $streetVal = $('#street').val();
    var $cityVal = $('#city').val();
    // $streetVal= removeSpace($streetVal);
    // $cityVal =  removeSpace($cityVal);
    var address = $streetVal + ', ' + $cityVal;
    var apiKey = 'AIzaSyAjxLDoZqFMPJLF0f46YEcUveejAl7MeNg';
    var baseUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=';
    var image = $('<img class="bgimg" src="' + baseUrl + address + '&key=' + apiKey + '">');
    $body.append(image);
    $greeting.text("So, you want to live in " + $cityVal+ "?");


    // load NYT
    var urlNYT = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    urlNYT += '?' + $.param({
            'api-key': "c65f0478b82248e2a533e9845dfdd4bc",
            'q': $cityVal
        });

    $.getJSON(urlNYT, function (data) {

        // change header
        $('#nytimes-header').text('Articles about ' + $cityVal);


        // iterate tru response json and add <li> with url, heading and snippet, then append <li>s to ul
        for (var obj in data.response.docs) {

            var objUrl = data.response.docs[obj].web_url;
            var objLeadP = data.response.docs[obj].snippet;
            var objHeadline = data.response.docs[obj].headline.main;

            var articleLi = $("<li class='article'>" +
                '<a href="' + objUrl + '">' + objHeadline + '</a>' +
                '<p>' + objLeadP + '</p>' +
                "</li>");
            // var articleLink= $('<a href=""/>');
            // articleLink.text(objHeadline);
            //
            // var articleP= $("<p></p>");
            //
            // articleLi.append(articleLink.attr('href', objUrl));
            // articleLi.append(articleP.text( objLeadP ));

            $('#nytimes-articles').append(articleLi);
        }


    }).fail(function () {
        $nytHeaderElem.text('Articles not found');
    });

// load Wikipedia

    //set timeout function to change text if error occurs
    var wikiTimeout = setTimeout(function () {
        $wikiElem.text("Wiki not loaded");
    }, 5000);
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + $cityVal + '&format=json&prop=info&titles=',
        dataType: 'jsonp',
        success: function (data) {

            var objectsWiki = data[1];
            var linksWiki = data[3];
            for (obj in objectsWiki) {


                var aHref = $('<a href="' + linksWiki[obj] + '">' + objectsWiki[obj] + '</a>');
                var wikiLink = $('<li></li>');
                wikiLink.append(aHref);
                $wikiElem.append(wikiLink);
            }
             //if error doesnt ocur, clear timeout,
            // ako ne stavimo ovo pojavice se novi tekst iako je zahtev uspesan
            clearTimeout(wikiTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);


//
// function removeSpace(string){
//     var regex = /\s/g;
//
//     return  string.replace(regex, '&');
//
// }