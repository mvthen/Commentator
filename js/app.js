$(document).ready(function() {

    $(".extra-information").hide();

    var community_api_key = "9f8c437533633048b3d4f6ae3539da2c:2:61350197";
    var article_api_key = "2d371cd00638970c9a34112fe038120e:19:61350197";


    // function scrollToAnchor(href) {
    //     var aTag = $("a[name='" + href + "']");
    //     $('html,body').animate({
    //         scrollTop: aTag.offset().top-100
    //     }, 'slow');
    // }

    function search_filter(search_type, query, callback) {

        // $(".extra-information").show();

        var search_url;
        var results;

        if (search_type == "random") {
            search_url = "random.jsonp?api-key=";
            api_key = community_api_key;
        }
        if (search_type == "date") {
            search_url = "by-date/" + query + ".jsonp?api-key=";
            api_key = community_api_key;
        }
        if (search_type == "article") {
            query = query.replace("://", "%3A%2F%2F").replace("/", "%2F");
            search_url = "url/exact-match.jsonp?url=" + query + "&api-key=";
            api_key = community_api_key;
        }


        var message =
            $.ajax({
                //note that I used jsonp ? instead of json, and put a type of jsonp to get around cross browser issues
                'url': "http://api.nytimes.com/svc/community/v2/comments/" + search_url + api_key,
                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {
                    display_first(data);
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

    function display_first(data) {
        // $('<li><div class="comment-inside" style="color:#B74934"><h4>COMMENTS</h4></div></li>').appendTo(".sidebar-nav");

        // console.log(data);
        results = data.results.comments
            console.log(results);
        for (var i = 0; i < results.length; i++) {

            var utcSeconds = results[i].approveDate;
            var d = new Date(0);
            d.setUTCSeconds(utcSeconds);
            var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            var location = results[i].location;
            var display_name = results[i].display_name;
            var commentBody = results[i].commentBody;
            var user_id = results[i].userComments.substr(50).replace(".xml", "");
            var articleURL = results[i].articleURL;

            var mod_content = commentBody.replace("<br>", " ").replace("</br>", " ").replace("<br />", " ").replace("<br/>", " ");
            // var content = display_name + ": " + mod_content.substring(0, 20) + "...";
            var content = display_name;

            var comment_inside = $("<div/>").attr("class", "comment-inside").text(content);
            var comment_content = $("<a/>").attr("href", "#btn_" + user_id).html(comment_inside);
            var element = $("<li/>").attr("class", "comments").html(comment_content);
            element.appendTo(".sidebar-nav");

            // var a_link = $('<a name="' + user_id + '"></a>').appendTo(".expanded-comments");
            $('<a class="anchors" name="btn_' + user_id + '"></a>').appendTo(".expanded-comments");
            var page_content = $("<div/>").attr("class", "jumbotron").appendTo(".expanded-comments");
            // var page_content = $("<div/>").attr("class", "jumbotron").appendTo(a_link);
            $('<div id="' + user_id + '"></div>').appendTo(page_content);
            var mod_page_content = $('<div class="container inline"></div>').appendTo($("#" + user_id));
            $('<h3>' + display_name + ' </h3>').appendTo(mod_page_content);
            $('<div class= "panel box"><div class="box-comment"><a href="'+articleURL+
            	'" target="_blank">Associated Article</a><p style="color: grey; font-size: 13px;">' +
                location + ' @ ' + date + '</p>' + mod_content + '</div></div>').appendTo($("#" + user_id));
            var naw = $('<div id = "more-comments-' + user_id + '" style="display:none;"></div>').appendTo($("#" + user_id));
            // $('<div class= "less-button-out"><a href="#'+user_id+'" onclick="toggle_less(\'more-comments-' + user_id +
            //                 '\');"><img src="img/up_arrow_green.png" id="less-button-'+user_id+'"></a></div>').appendTo($('#' + user_id));

            user_search(user_id, commentBody);

            var URL = (results[i].articleURL).replace(":", "%3A").replace("/", "%2F");
        }
    }

    function article_search(website) {
        var message =
            $.ajax({
                'url': 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url%3A%28%22http%3A%2F%2Fwww.nytimes.com%2F2013%2F10%2F05%2Fopinion%2Fcollins-frankenstein-goes-to-congress.html%22%29&fl=headline&api-key=2d371cd00638970c9a34112fe038120e%3A19%3A61350197',
                'type': 'GET',
                'dataType': "json",
                success: function(data, textStats, XMLHttpRequest) {

                    // for i in 
                    return data.results;
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

    function user_search(user_id, first_comment) {

        var search_url = "user/id/" + user_id + ".jsonp?api-key=";
        var api_key = community_api_key;

        var message =
            $.ajax({
                'url': 'http://api.nytimes.com/svc/community/v2/comments/' + search_url + api_key,
                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {

                    var results = data.results.comments;
                    // console.log(data.results);
                    console.log(results);

                    for (var i = 0; i < results.length; i++) {
                        var utcSeconds = results[i].approveDate;
                        var d = new Date(0);
                        d.setUTCSeconds(utcSeconds);
                        var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                        var month = d.getMonth() + 1;
                        var year = d.getFullYear();
                        var location = results[i].location;
                        var display_name = results[i].display_name;
                        var user_id = results[i].userComments.substr(50).replace(".xml", "");
                        var comment = results[i].commentBody;

                        if (comment != first_comment) {
                            $('<div class= "panel box"><div class="box-comment"><p style="color: grey; font-size: 13px;">' + location + ' @ ' 
                            	+ date + '</p>' + comment + '</div></div>').appendTo($('#more-comments-' + user_id));
                        }
                    }

                    if (results.length > 1) {
                        $('<div class= "more-button-out"><a href="#'+user_id+'" onclick="toggle_more(\'more-comments-' + user_id +
                            '\');"><img src="img/down_arrow_green.png" class="more-button"></a></div>').appendTo($('#' + user_id));
						
                    }
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

    function comment_page_content(results) {
        // alert(results);
    }


    $("#random_search").click(function(event) {
        search_filter("random", "", comment_page_content);
    });
    // $("#user_search").click(function(event) {
    // 	search_filter("user","12936802", comment_page_content);
    // });
    $("#date_search").click(function(event) {
        search_filter("date", "20040806", comment_page_content);
    });
    $("#article_search").click(function(event) {
        // search_filter("article", "http://www.nytimes.com/2012/10/09/opinion/nocera-buying-the-election.html", comment_page_content);
        article_search("asdfasdf");

    });

});