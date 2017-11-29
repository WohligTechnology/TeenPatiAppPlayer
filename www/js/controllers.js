var playerCtrlSocket = {};
var winnerCtrlSocket = {};

angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {})


  .controller('WinnerCtrl', function ($scope, $stateParams, apiService, $state, selectPlayer) {
    io.socket.off("Winner", playerCtrlSocket.winner);
    io.socket.off("Update", playerCtrlSocket.update);

    $scope.showWinner = function () {
      apiService.showWinner(function (data) {
        $scope.players = data.data.data.winners;
        $scope.player = _.find($scope.players, function (player) {
          return player.playerNo == selectPlayer.getPlayer();
        });
        $scope.playersChunks = _.chunk($scope.players, 2);

        if ($scope.player) {
          if ($scope.player.winner) {
            $scope.meWinner = "Win";
          } else {
            $scope.meWinner = "Lose";
          }
        }

        $scope.winners = _.filter($scope.players, function (player) {
          return player.winner;
        });
        $scope.communityCards = data.data.data.communityCards;
        $scope.winnerString = _.join(_.map($scope.winners, function (n) {
          return "Player " + n.playerNo;
        }), " & ");
      });
    };
    $scope.showWinner();

    winnerCtrlSocket.update = function (data) {
      $state.go("player");
    };
    io.socket.on("Update", winnerCtrlSocket.update);


  })
  .controller('PlayerCtrl', function ($scope, $stateParams, selectPlayer, apiService, $interval, $state) {

    io.socket.off("Update", winnerCtrlSocket.update);



    playerCtrlSocket.winner = function (data) {
      $state.go('winner');
    };
    io.socket.on("Winner", playerCtrlSocket.winner);


    playerCtrlSocket.update = function (data) {
      compileData(data);
      $scope.$apply();
    };
    io.socket.on("Update", playerCtrlSocket.update);

    $scope.getTabDetail = function () {
      apiService.getAll(compileData);
    };
    $scope.getTabDetail();


    function compileData(data) {
      $scope.player = _.find(data.playerCards, function (player) {
        return player.playerNo == selectPlayer.getPlayer();
      });
      $scope.communityCards = data.communityCards;
      $scope.remainingPlayer = _.filter(data.playerCards, function (player) {
        return player.isActive && !player.isFold;
      }).length;
      if (!$scope.player) {
        $state.go("tab");
      }
    }


    $scope.moveTurn = function () {
      $scope.player.isTurn = true;
      apiService.moveTurn(function (data) {});
    };
    $scope.foldPlayer = function () {
      $scope.player.isTurn = true;
      apiService.foldPlayer(function (data) {});
    };

  })
  .controller('TabCtrl', function ($scope, $stateParams, selectPlayer, $state) {
    $scope.players = ["1", "2", "3", "4", "5", "6", "7", "8"];
    $scope.currentPlayer = selectPlayer.getPlayer();
    $scope.selectPlayerNo = function (currentPlayer) {
      selectPlayer.setPlayer(currentPlayer);
    };
  })
  .controller('PlaylistCtrl', function ($scope, $stateParams) {});