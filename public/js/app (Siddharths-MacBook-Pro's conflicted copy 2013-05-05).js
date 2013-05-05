var app = angular.module("app", []);

app.controller("MyCtrl", function ($scope) {

    $scope.poems = 	[
    				{ "_id" : ObjectId("4ffdb87d2559df3706000025"), "author" : "valluvar", "explanation" : "The fruit of virtue need not be described in books; it may be inferred from seeing the bearer of a palanquin and the rider therein. ", "name" : "thirukkural", "serial" : 37, "tags" : [ "thirukkural", "valluvar", "அறத்துப்பால்", "அறன்வலியுறுத்தல்" ], "text" : [ "அறத்தாறு இதுவென வேண்டா சிவிகை", "பொறுத்தானோடு ஊர்ந்தான் இடை." ], "translation" : "Needs not in words to dwell on virtue's fruits", "urlkey" : "kural" },
    				{ "_id" : ObjectId("4ffdb87d2559df3706000064"), "author" : "valluvar", "explanation" : "To say disagreeable things when agreeable are at hand is like eating unripe fruit when there is ripe. ", "name" : "thirukkural", "serial" : 100, "tags" : [ "thirukkural", "valluvar", "அறத்துப்பால்", "இனியவைகூறல்" ], "text" : [ "இனிய உளவாக இன்னாத கூறல்", "கனிஇருப்பக் காய்கவர்ந் தற்று." ], "translation" : "When pleasant words are easy, bitter words to use, <br>Is, leaving sweet ripe fruit, the sour unripe to choose. ", "urlkey" : "kural" }
    				];
});