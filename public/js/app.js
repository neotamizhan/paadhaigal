var app = angular.module("app", ['ngResource']);

app.factory('Poetry', function ($resource, $http) {
    return {
        mlTerm : $resource('https://api.mongolab.com/api/1/databases/poetry/collections/poems?apiKey=50aa141ce4b0021e6aceebc0&q={text:{"$regex":":term","$options":"i"}}'),        
        byTerm : $resource('/api/v1/searchtext/:term'),
        byTags : $resource('/api/v1/tags/:tags'),
        bySerial : $resource('/api/v1/:urlkey/:serial')
    }
})

app.controller("PoetryCtrl", function ($scope, $resource, $http, Poetry) {

    //$scope.cards = Cbk.creditcards.query({ cif: $scope.cif, acc: $scope.acc, civilid: $scope.civilid }, isArray = true);

    var WordSearch = $resource('/api/v1/searchtext/:term');

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
            // tag search
            term = term.replace("tags:","").trim();
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
        //$scope.poems = Poetry.byTerm.query({term : $scope.term});    
        $scope.poems = Poetry.mlTerm.query({term : $scope.term});
    };

    $scope.searchTags = function (tags) {
        $scope.poems = Poetry.byTags.query({tags: tags});
    };

    $scope.searchBySerial = function (urlkey, serial) {
        $scope.poems = Poetry.bySerial.query({urlkey: urlkey, serial: serial});
    };

    var DB = $scope.poems;

});