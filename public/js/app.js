var app = angular.module("app", []);

app.controller("PoetryCtrl", function ($scope, $http) {

    //$scope.cards = Cbk.creditcards.query({ cif: $scope.cif, acc: $scope.acc, civilid: $scope.civilid }, isArray = true);

    $scope.poems = [
                    {"author":"valluvar","explanation":"As all letters have the letter A for their first, so the world has the eternal God for its first. ","name":"thirukkural","serial":1,"tags":["thirukkural","valluvar","அறத்துப்பால்","கடவுள் வாழ்த்து"],"text":["அகர முதல எழுத்தெல்லாம் ஆதி","பகவன் முதற்றே உலகு."],"translation":"A, as its first of letters, every speech maintains; <br>The \"Primal Deity\" is first through all the world's domains. ","urlkey":"kural"}
                   ];

    //$scope.searchparams = [{ name: 'CIF', value: 'cif' }, { name: 'Mobile', value: 'mobile' }, { name: 'Account', value: 'account' }, { name: 'Civil ID', value: 'civilid'}];

    //$scope.criteria = $scope.searchparams[0];

    $scope.pluralizer = {
        0: "No poems found.",
        1: "One poem found.",
        other: "{} poems found."
    };

    $scope.searchPoems = function () {
        $http({
            method: 'get',
            url: '/api/v1/searchtext/:term',
            //params: { cif: $scope.cif, acc: $scope.acc, civilid: $scope.civilid, mobile: $scope.mobile }
            params: { criteria: $scope.criteria.value, searchval: $scope.searchval }
        }).success(function (data, status) { $scope.cards = data; });
    };

    $scope.clearSearch = function () {
        $scope.cards = [];
        $scope.cif = '';
        $scope.acc = '';
        $scope.civilid = '';
        $scope.mobile = '';
    };

    $scope.setCriteria = function () {
        if ($scope.searchval.length <= 7) {
            $scope.criteria = $scope.searchparams[0];
        }
        else if ($scope.searchval.length == 8) {
            $scope.criteria = $scope.searchparams[1];
        }
        else if ($scope.searchval.length == 10) {
            $scope.criteria = $scope.searchparams[2];
        }
        else if ($scope.searchval.length == 12) {
            $scope.criteria = $scope.searchparams[3];
        }
    }

    $scope.fmtAmt = function (amt) {
        var symbol = amt.substr(amt.length - 1);
        return symbol + amt.substring(0, amt.length - 1);
    }

    DB = $scope.cards;
});