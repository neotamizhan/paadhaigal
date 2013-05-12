angular.module('SharedServices', [])
.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
        // todo start the spinner here          
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
            $('#loading').hide();
            return response;

        }, function (response) { //error
            // do something on error
            $('#loading').hide();
            return $q.reject(response);
        });
    };
});


var app = angular.module("app", ['mongolabResourceHttp','SharedServices']);

app.constant('MONGOLAB_CONFIG',{API_KEY:'50aa141ce4b0021e6aceebc0', DB_NAME:'poetry'});

app.factory('Poetry', function ($mongolabResourceHttp) {
    return $mongolabResourceHttp('poems');
});

app.controller("PoetryCtrl", function ($scope, Poetry) {	

	$scope.queryObject = {
							type:'', 
							qry : {},
							page_size : 10,
							page_num: 1,
							sort : {sort: {serial:1}}
						};

    $scope.poems = [
                    {"author":"valluvar","explanation":"As all letters have the letter A for their first, so the world has the eternal God for its first. ","name":"thirukkural","serial":1,"tags":["thirukkural","valluvar","அறத்துப்பால்","கடவுள் வாழ்த்து"],"text":["அகர முதல எழுத்தெல்லாம் ஆதி","பகவன் முதற்றே உலகு."],"translation":"A, as its first of letters, every speech maintains; <br>The \"Primal Deity\" is first through all the world's domains. ","urlkey":"kural"}
                   ];                

    $scope.pluralizer = {
        0: "No poems found.",
        1: "One poem found.",
        other: "{} poems found."
    };

  $scope.search = function () {

      var term = $scope.term;
      if (term.indexOf("tags:") > -1) {
          $scope.searchTags(term);
          return;            
      }

      var searchSerial = term.match(/(\D+) (\d+)/);
      if ( searchSerial ) {            
          $scope.searchBySerial(searchSerial[1], parseInt(searchSerial[2]));
          return;
      }        
      
      $scope.searchTerms();
  };

  $scope.searchTerms = function () {
    Poetry.query({text:{"$regex":$scope.term,"$options":"i"}}, $scope.queryObject.sort)
    .then(function (poems) {
      $scope.poems = poems;
    });
      //$scope.poems = Poetry.byTerm.query({so : 1, term : $scope.term});    
  };

  $scope.searchTags = function (tags) {
      var tagArray = tags.replace("tags:","").trim().split(",");
      
      for (var i = 0; i < tagArray.length; i++) {
        tagArray[i] = tagArray[i].trim();
      }         
      console.log(tagArray);

      Poetry.query({tags:{"$all":tagArray}}, {sort: {serial:1}})
      .then(function (poems) {
        console.log(poems.length);
        $scope.poems = poems;
      });
  };

  $scope.searchBySerial = function (urlkey, serial) {
    Poetry.query({urlkey:urlkey, serial:serial}, {sort: {serial:1}})
    .then(function (poems) {
      $scope.poems = poems;
    });
  };

  $scope.fetchAllTags = function () {
    Poetry.distinct("tags",{})
    .then(function (all_tags) {
      $scope.all_tags = all_tags;
    });
  };

    
    DB = $scope.poems;

});