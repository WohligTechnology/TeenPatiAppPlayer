myApp = angular.module('starter');

myApp.service("selectPlayer", function () {
  this.currentPlayer = $.jStorage.get("player");
  this.setPlayer = function (playerId) {
    $.jStorage.set("player", playerId);
    this.currentPlayer = playerId;
  };
  this.getPlayer = function () {
    return this.currentPlayer;
  };
});
myApp.factory('apiService', function ($http, $q, $timeout) {


  return {
    // This is a demo Service for POST Method.
    callApiWithData: function (url, data, callback) {
      $http.post(adminurl + url, data).then(function (data) {
        callback(data);
      });
    },
    getAll: function (callback) {
      $http.post(adminurl + 'Player/getAll').then(function (data) {
        callback(data.data.data);
      });
    },
    showWinner: function (callback) {
      $http.post(adminurl + 'Player/showWinner').then(function (data) {
        callback(data);
      });

    },
    moveTurn: function (callback) {
      $http.post(adminurl + 'Player/moveTurn').then(function (data) {
        callback(data);
      });

    },
    foldPlayer: function (callback) {
      $http.post(adminurl + 'Player/fold').then(function (data) {
        callback(data);
      });
    },
    doSideShow: function (callback) {
      $http.post(adminurl + 'Player/doSideShow').then(function (data) {
        callback(data);
      });
    },
    sideShow: function (callback) {
      $http.post(adminurl + 'Player/sideShow', {}).then(function (data) {
        callback(data.data);
      });
    },
    makeSeen: function(callback){
      $http.post(adminurl + 'Player/makeSeen', {}).then(function (data) {
          callback(data.data);
      });
  },

  };
});

myApp.directive('card', function () {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      card: "@",
      width: "@",
      height: "@"
    },
    templateUrl: 'templates/directive/card.html',
    link: function ($scope, element, attr) {
      function calc() {
        $scope.style = {
          width: $scope.width + "px",
          height: $scope.height + "px"
        };
        $scope.cardFile = "img/cards/" + _.toUpper($scope.card) + ".svg";
      }
      calc();
      $scope.$watch("card", function () {
        calc();
      });


    }
  };
});

myApp.directive('community', function () {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      communityCard: "=ngCommunityCard"
    },
    templateUrl: 'templates/directive/communityCard.html',
    link: function ($scope, element, attr) {

    }
  };
});

myApp.directive('winnerPlayer', function () {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      player: "=ngPlayer",
      method: "="
    },
    templateUrl: 'templates/directive/winnerPlayer.html',
    link: function ($scope, element, attr) {}
  };
})

myApp.directive('player', function () {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      player: "=ngPlayer",
      gameType: "=ngGameType"
    },
    templateUrl: 'templates/directive/player.html',
    link: function ($scope, element, attr) {}
  };
})

myApp.filter('showCard', function(){
  return function(input, player){
        if(player.isBlind){
             return 'DONE' 
        }else{
            return input;
        }
  }
})