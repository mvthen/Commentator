$(document).ready(function() {

    var api_key = "85ce95f17741a447d78af20d8a85470e:9:61350197";
    var user_summary = [];
    var name_id = [];

    $("#search").hide();
    $(".page-results").hide();
    $(".search").hide();
    $(".error-msg").hide();
    $("#no-result").empty();

    $('.dropdown-menu').find('form').click(function(e) {
        e.stopPropagation();
    });

    $('.form_date').datetimepicker({
        format: "dd/mm/yyyy",
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        endDate: "-1d",
    });

    $('.lightbox').lightbox();
    $('.lightbox').click(function() {
        $('html').addClass("open-lightbox");
        setTimeout(function() {
            $('html.open-lightbox').css("overflow", "hidden");
        }, 300);
    });

    $('.jquery-lightbox-button-close').click(function() {
        $('html.open-lightbox').css("overflow-y", "scroll");
        setTimeout(function() {
            $('html').removeClass("open-lightbox");
        }, 300);
    });

    function search_filter(search_type, query) {

        var search_url;
        var results;
        var arg;

        if (search_type == "random") {
            search_url = "random.jsonp?api-key=";
            arg = "";
        }
        if (search_type == "date") {
            search_url = "by-date/" + query + ".jsonp?api-key=";
            arg = "";
        }
        if (search_type == "article") {
            arg = query;
            query = query.replace("://", "%3A%2F%2F").replace("/", "%2F");
            search_url = "url/exact-match.jsonp?url=" + query + "&api-key=";
        }


        var message =
            $.ajax({
                'url': "http://api.nytimes.com/svc/community/v2/comments/" + search_url + api_key,
                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {
                    display_first(data, search_type, arg);
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

    function display_first(data, search_type, arg) {

        results = data.results.comments
        if (results.length < 1){
            $('<img src="img/noresults.png">').appendTo('#no-result');
            $('<h3>Please hit the red button "Search Again" to try again.</h3>').appendTo('#no-result');
        }

        for (var i = 0; i < results.length; i++) {

            var utcSeconds = results[i].approveDate;
            var d = new Date(0);
            d.setUTCSeconds(utcSeconds);
            var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
            var location = results[i].location;
            var display_name;
            if (results[i].display_name == "") {
                display_name = "Username Unavailable"
            } else {
                display_name = results[i].display_name;
            }
            var commentBody = results[i].commentBody;
            var user_id = results[i].userComments.substr(50).replace(".xml", "");
            var articleURL;

            if (search_type == "article") {
                articleURL = arg;
            } else {
                articleURL = results[i].articleURL;
            }

            if (user_id in name_id) {
                var mod_content = commentBody.replace("<br>", " ").replace("</br>", " ").replace("<br />", " ").replace("<br/>", " ");
                $('<div class= "panel box"><div class="comment-box box-comment-' + user_id + '">\
                <a href="' + articleURL + '?lightbox[iframe]=true&lightbox[width]=80p&lightbox[height]=85p" \
                class="lightbox">Associated Article</a><p style="color: grey; font-size: 13px;">' +
                    location + ' @ ' + date + '</p>' + mod_content + '</div></div>').appendTo($("#" + user_id));
                $('<div class="btn-group rank-button"><button class="btn btn-info col-xs-4 scale" id="thoughtful' + user_id + '">thoughtful</button> \
                    <button class="btn btn-info col-xs-4 scale" id="funny-' + user_id + '">funny</button> <button class="btn btn-info col-xs-4 scale" id="informative-' +
                     user_id + '">informative</button> </div><br>').appendTo($('.box-comment-' + user_id));
                $('.box-comment-'+user_id).after('<div class="rate-rate total-rating-'+user_id+'"></div>');
                $('<div id = "more-comments-' + user_id + '" style="display:none;"></div>').appendTo($("#" + user_id));

            } else {
                name_id[user_id] = display_name;
                var obj = {};
                obj = [{
                    id: user_id
                }, {
                    thoughtful: 0
                }, {
                    funny: 0
                }, {
                    informative: 0
                }];

                user_summary.push(obj);

                var mod_content = commentBody.replace("<br>", " ").replace("</br>", " ").replace("<br />", " ").replace("<br/>", " ");
                var content = display_name;

                var comment_inside = $("<div/>").attr("class", "comment-inside").text(content);
                var comment_content = $("<a/>").attr("href", "#btn_" + user_id).html(comment_inside);
                var element = $("<li/>").attr("class", "comments").html(comment_content);
                element.appendTo(".sidebar-nav");

                $('<a class="anchors" name="btn_' + user_id + '"></a>').appendTo(".expanded-comments");
                var page_content = $("<div/>").attr("class", "jumbotron").appendTo(".expanded-comments");
                $('<div id="' + user_id + '"></div>').appendTo(page_content);
                var mod_page_content = $('<div class="container inline r-'+user_id+'"></div>').appendTo($("#" + user_id));
                $('<h3>' + display_name + ' </h3>').appendTo(mod_page_content);
                $('<div class= "panel box"><div class="comment-box box-comment-' + user_id + '"> \
                    <a href="' + articleURL + '?lightbox[iframe]=true&lightbox[width]=80p&lightbox[height]=85p" \
                    class="lightbox">Associated Article</a><p style="color: grey; font-size: 13px;">' +
                    location + ' @ ' + date + '</p><span>' + mod_content + '</span><br><br></div></div>').appendTo($("#" + user_id));

                $('<div class="btn-group rank-button"><button class="btn btn-info col-xs-4 scale" id="thoughtful-' + user_id + '">thoughtful</button> \
                    <button class="scale btn btn-info col-xs-4" id="funny-' + user_id + '">funny</button> <button class="btn btn-info col-xs-4 scale" id="informative-' 
                    + user_id + '">informative</button> </div><br>').appendTo($('.box-comment-' + user_id));
                $('.r-'+user_id).after('<div class="rate-rate total-rating-'+user_id+'"></div>');
                $('<div id = "more-comments-' + user_id + '" style="display:none;"></div>').appendTo($("#" + user_id));

                user_search(user_id, commentBody);
            }
        }
    }

    function user_search(user_id, first_comment) {

        var search_url = "user/id/" + user_id + ".jsonp?api-key=";

        var message =
            $.ajax({
                'url': 'http://api.nytimes.com/svc/community/v2/comments/' + search_url + api_key,
                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {
                    var results = data.results.comments;
                    for (var i = 0; i < results.length; i++) {
                        var utcSeconds = results[i].approveDate;
                        var d = new Date(0);
                        d.setUTCSeconds(utcSeconds);
                        var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                        var location = results[i].location;
                        var display_name = results[i].display_name;
                        var user_id = results[i].userComments.substr(50).replace(".xml", "");
                        var comment = results[i].commentBody;

                        if (comment != first_comment) {
                            var comment = $('<div class= "panel box"><div class="comment-box box-comment' + user_id + '"><p style="color: grey; font-size: 13px;"> No associated article. <br>' +
                                location + ' @ ' + date + '</p><span>' + comment + '</span><br><br></div></div>').appendTo($('#more-comments-' + user_id));
                            $('<div class="btn-group rank-button"><button class="btn btn-info col-xs-4 scale" id="thoughtful-' + user_id + '">thoughtful</button> \
                                            <button class="btn btn-info col-xs-4 scale" id="funny-' + user_id + '">funny</button><button class="btn btn-info col-xs-4 scale" id="informative-' 
                                            + user_id + '">informative</button></div><br><br>').appendTo($(comment));
                        }
                    }

                    if (results.length > 1) {
                        $('<div class= "more-button-out"><a href="#' + user_id + '" onclick="toggle_more(\'more-comments-' + user_id +
                            '\');"><span id="a_' + user_id + '">Click for more comments.</span><img id= "img_' + user_id + 
                        '"src="img/down_arrow_green.png" class="more-button"></a></div>').appendTo($('#' + user_id));
                    }
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

    $(document).on('click', '.scale', function(ev) {
        $(".modal-body").empty();

        var user_id = (this.id).substr((this.id).indexOf("-") + 0);
        var adj = this.id.replace(user_id, "");
        user_id = user_id.substr(1);

        $('.total-rating-'+user_id).empty();

        for (var i = 0; i < user_summary.length; i++) {
            var id = user_summary[i][0]["id"];
            if (user_id == id) {
                if (adj == "thoughtful")
                    user_summary[i][1]["thoughtful"] ++;
                if (adj == "funny")
                    user_summary[i][2]["funny"] ++;
                if (adj == "informative")
                    user_summary[i][3]["informative"] ++;
                var total = user_summary[i][1]["thoughtful"] + user_summary[i][2]["funny"] + user_summary[i][3]["informative"];
                $('<h6>user rated '+total+' time(s) total</h6>').appendTo($('.total-rating-'+id));
            }
        }

        for (var i = 0; i < user_summary.length; i++) {
            var total = user_summary[i][1]["thoughtful"] + user_summary[i][2]["funny"] + user_summary[i][3]["informative"];
            var thoughtful = user_summary[i][1]["thoughtful"] / total * 100;
            var funny = user_summary[i][2]["funny"] / total * 100;
            var informative = user_summary[i][3]["informative"] / total * 100;

            var thoughtful_span = $("<span/>").attr("class", "sr-only");
            var thoughtful_div = $("<div/>").attr("class", "progress-bar progress-bar-success progress-bar-striped").attr("style", "width:" +
                thoughtful + "%").html(thoughtful_span);
            var funny_span = $("<span/>").attr("class", "sr-only");
            var funny_div = $("<div/>").attr("class", "progress-bar progress-bar-warning progress-bar-striped").attr("style", "width:" +
                funny + "%").html(funny_span);
            var informative_span = $("<span/>").attr("class", "sr-only");
            var informative_div = $("<div/>").attr("class", "progress-bar progress-bar-danger progress-bar-striped").attr("style", "width:" +
                informative + "%").html(informative_span);

            var element = $("<div/>").attr("class", "progress user");
            var display_name = name_id[user_summary[i][0]["id"]];
            display_div = $("<div class=username> " + display_name + "</div>");
            display_div.appendTo($(element));
            thoughtful_div.appendTo($(element));
            funny_div.appendTo($(element));
            informative_div.appendTo($(element));
            element.appendTo($(".modal-body"));
        }
    });


    $("#random_search").click(function(event) {
        search_filter("random", "");
        $(".start-page").hide();
        $(".page-results").show();
        $(".extra-information").hide();
        $(".search").show();
        $('<a class="search" id="random_search" href="#">RANDOM MODE ON</a>').appendTo($('.mode'));

    });

    $('#date').on('change', function() {
        var date = $(this).val();
        year = date.substr(6);
        month = date.slice(3, 5);
        day = date.slice(0, 2);
        mod_date = year + month + day;

        search_filter("date", mod_date);

        $(".start-page").hide();
        $(".page-results").show();
        $(".extra-information").hide();
        $('<a class="search" id="date-search" href="#">DATE MODE ON: ' + date + '</a>').appendTo($('.mode'));

    });

    $("#article_search").click(function(event) {

        var website = document.getElementById("article").value;
        if (website == "") {
            $('.error-msg').show();
        } else {
            search_filter("article", website);
            $(".start-page").hide();
            $(".page-results").show();
            $(".extra-information").hide();
            $('<a class="search" id="article-search" href="#">ARTCLE MODE ON: ' + website + '</a>').appendTo($('.mode'));
        }
    });

    $(".search_again").click(function(event) {
        $(".mode").empty();
        $(".expanded-comments").empty();
        $(".sidebar-nav").empty();
        $(".start-page").show();
        $("#search").hide();
        $(".page-results").hide();
        $(".search").hide();

    });

    $(".commentator").click(function(event) {
        $(".mode").empty();
        $(".expanded-comments").empty();
        $(".sidebar-nav").empty();
        $(".start-page").show();
        $("#search").hide();
        $(".page-results").hide();
        $(".search").hide();

    });

});