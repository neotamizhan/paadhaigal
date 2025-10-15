angular.module('SharedServices', [])
.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
        // todo start the spinner here
        $('#status-alert').hide();
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
            $('#status-alert').show();
            return response;

        }, function (response) { //error
            // do something on error
            $('#loading').hide();
            $('#status-alert').show();
            return $q.reject(response);
        });
    };
});


var app = angular.module("app", ['SharedServices']);

app.factory('Poetry', function ($http) {
    return {
      query: function(criteria, sort) {
        if (criteria && criteria.tags && criteria.tags.$all) {
          var tags = criteria.tags.$all.join(',');
          return $http.get('/api/v1/tags/' + encodeURIComponent(tags)).then(function(r) { return r.data; });
        }
        if (criteria && criteria.text && criteria.text.$regex) {
          var term = criteria.text.$regex;
          return $http.get('/api/v1/searchtext/' + encodeURIComponent(term)).then(function(r) { return r.data; });
        }
        if (criteria && criteria.urlkey && criteria.serial != null) {
          return $http.get('/api/v1/' + encodeURIComponent(criteria.urlkey) + '/' + encodeURIComponent(criteria.serial)).then(function(r) { return r.data; });
        }
        return $http.get('/api/v1/search').then(function(r) { return r.data; });
      },
      distinct: function(field, criteria) {
        if (field === 'tags') {
          return $http.get('/api/v1/tags').then(function(r) { return r.data; });
        }
        return Promise.resolve([]);
      }
    };
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
        0: "பாடல்கள் எதுவும் கிடைக்கவில்லை. ",
        1: "ஒரு பாடல் கிடைத்தது.",
        other: "{} பாடல்கள் கிடைத்தன."
    };

  $scope.search = function () {

      var term = $scope.term;
      if (term.indexOf("tags:") > -1) {
          $scope.searchTags(term);
          return;
      }

      var searchSerial = term.match(/(\D+) (\d+)/);
      if ( searchSerial ) {
          $scope.searchBySerial(searchSerial[1], parseInt(searchSerial[2],10));
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