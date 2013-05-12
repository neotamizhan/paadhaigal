angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            //alert('done0');            
            $('#loading').show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) { //success
                // do something on success
                // todo hide the spinner
                //alert('done1');
                $('#loading').hide();
                return response;

            }, function (response) { //error
                // do something on error
                // todo hide the spinner
                //alert('done2');
                $('#loading').hide();
                return $q.reject(response);
            });
        };
    })


var app = angular.module("app", ['ngResource','SharedServices']);

app.factory('Poetry', function ($resource, $http) {
	var base_url = 'https://api.mongolab.com/api/1/databases/poetry/collections/poems?s={serial::so}&apiKey=50aa141ce4b0021e6aceebc0';

    return {
        
        //byTerm : $resource('/api/v1/searchtext/:term'),
        //byTags : $resource('/api/v1/tags/:tags'),
        //bySerial : $resource('/api/v1/:urlkey/:serial')
        byTerm : $resource(base_url + '&q={text:{"$regex":":term","$options":"i"}}'),        
        byTags : $resource(base_url + '&q={tags:{"$all":[:tags]}}'),
        bySerial : $resource(base_url + '&q={urlkey:":urlkey", serial::serial}'),
        allTags : $resource('https://api.mongolab.com/api/1/databases/poetry/runCommand?apiKey=50aa141ce4b0021e6aceebc0')

        //{"distinct": "users","key": "account","query": {"active":true}}
        
    }
})

app.controller("PoetryCtrl", function ($scope, Poetry) {

    $scope.poems = [
                    {"author":"valluvar","explanation":"As all letters have the letter A for their first, so the world has the eternal God for its first. ","name":"thirukkural","serial":1,"tags":["thirukkural","valluvar","அறத்துப்பால்","கடவுள் வாழ்த்து"],"text":["அகர முதல எழுத்தெல்லாம் ஆதி","பகவன் முதற்றே உலகு."],"translation":"A, as its first of letters, every speech maintains; <br>The \"Primal Deity\" is first through all the world's domains. ","urlkey":"kural"}
                   ];                

    $scope.pluralizer = {
        0: "No poems found.",
        1: "One poem found.",
        other: "{} poems found."
    };

    /*
        1. Is tag? then tag search
    */
    $scope.search = function () {

        var term = $scope.term;
        if (term.indexOf("tags:") > -1) {
            $scope.searchTags(term);
            return;            
        }

        var searchSerial = term.match(/(\D+) (\d+)/);
        if ( searchSerial ) {            
            $scope.searchBySerial(searchSerial[1], searchSerial[2])
            return;
        }        

        $scope.searchTerms();
    }


    $scope.searchTerms = function () {
        $scope.poems = Poetry.byTerm.query({so : 1, term : $scope.term});    
    };

    $scope.searchTags = function (tags) {

        tagArray = tags.replace("tags:","").trim().split(",");
        
        for (var i = 0; i < tagArray.length; i++) {
          	tagArray[i] = '"' + tagArray[i].trim() + '"';
        };          
        console.log(tagArray);    	
        $scope.poems = Poetry.byTags.query({so: 1, tags: tagArray});

    };

    $scope.searchBySerial = function (urlkey, serial) {
        $scope.poems = Poetry.bySerial.query({so: 1, urlkey: urlkey, serial: serial});
    };

    DB = $scope.poems;

});