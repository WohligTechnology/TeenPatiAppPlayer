var playerCtrlSocket = {};
var winnerCtrlSocket = {};

angular
  .module("starter.controllers", [])

  .controller("AppCtrl", function($scope, $ionicModal, $timeout) {})

  // .controller('WinnerCtrl', function ($scope, $stateParams, apiService, $state, selectPlayer) {
  //   io.socket.off("showWinner", playerCtrlSocket.winner);
  //   io.socket.off("Update", playerCtrlSocket.update);

  //   $scope.showWinner = function () {
  //     apiService.showWinner(function (data) {
  //       $scope.players = data.data.data.winners;
  //       $scope.player = _.find($scope.players, function (player) {
  //         return player.playerNo == selectPlayer.getPlayer();
  //       });
  //       $scope.playersChunks = _.chunk($scope.players, 2);

  //       if ($scope.player) {
  //         if ($scope.player.winner) {
  //           $scope.meWinner = "Win";
  //         } else {
  //           $scope.meWinner = "Lose";
  //         }
  //       }

  //       $scope.winners = _.filter($scope.players, function (player) {
  //         return player.winner;
  //       });
  //       $scope.communityCards = data.data.data.communityCards;
  //       $scope.winnerString = _.join(_.map($scope.winners, function (n) {
  //         return "Player " + n.playerNo;
  //       }), " & ");
  //     });
  //   };
  //   $scope.showWinner();

  //   winnerCtrlSocket.update = function (data) {
  //     $state.go("player");
  //   };
  //   io.socket.on("Update", winnerCtrlSocket.update);

  // })
  .controller("PlayerCtrl", function(
    $scope,
    $stateParams,
    selectPlayer,
    apiService,
    $interval,
    $state,
    $ionicModal,
    $timeout
  ) {
    io.socket.off("Update", winnerCtrlSocket.update);

    io.socket.on("sideShow", function(data) {
      if (data.data.toPlayer.playerNo == selectPlayer.getPlayer()) {
        $scope.modal1.show();
      }
      if (data.data.fromPlayer.playerNo == selectPlayer.getPlayer()) {
        $scope.modal3.show();
        $scope.message = {
          content: "Your request for the Side show has been sent!",
          color: "color-balanced"
        };
      }
    });

    io.socket.on("sideShowCancel", function(data) {
      console.log(selectPlayer.getPlayer);
      $scope.modal2.hide();
      if (data.data.playerNo == selectPlayer.getPlayer()) {
        $scope.modal3.show();
        $scope.message = {
          content: "Side show has been denied !!",
          color: "color-assertive"
        };
        $timeout(function() {
          $scope.modal3.hide();
        }, 3000);
      }
    });
    $scope.confirmModalClose = function() {
      $scope.modal1.hide();
    };

    $scope.cancelSideShow = function() {
      apiService.cancelSideShow(function(data) {});
    };

    $scope.sideShow = function() {
      apiService.sideShow(function(data) {});
    };

    //io.socket.off("Update", winnerCtrlSocket.update);
    // Modal Actions
    $scope.confirmModalOk = function() {
      apiService.doSideShow(function(data) {});
    };

    $ionicModal
      .fromTemplateUrl("templates/modal/side-show.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal1 = modal;
      });

    $ionicModal
      .fromTemplateUrl("templates/modal/side-show-requested.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal2 = modal;
      });

    $ionicModal
      .fromTemplateUrl("templates/modal/toastr.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal3 = modal;
      });

    $ionicModal
      .fromTemplateUrl("templates/modal/winner.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    $scope.removeWinner = function() {
      $scope.modal.hide();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.openSideShowModal = function() {
      console.log("in");
      $scope.modal2.show();
    };

    $scope.closeConfirmModal = function() {
      $scope.modal2.hide();
    };

    playerCtrlSocket.winner = function(data) {
      console.log(_.cloneDeep(data), "New Winner");
      $scope.sideShowData = data.data.sideShows;
      console.log($scope.sideShowData);
      if ($scope.player.isActive) {
        $scope.modal.show();
        var isWinner = _.find(data.data.winners, function(n) {
          return n.playerNo == selectPlayer.getPlayer() && n.winner;
        });
        if (isWinner) {
          $scope.isWinner = "You Won";
        } else {
          $scope.isWinner = "You Lose";
        }
      }
    };

    playerCtrlSocket.update = function(data) {
      compileData(data);
      console.log(data);
      $scope.$apply();
      $scope.modal.hide();
      $scope.newGame = data.extra.newGame;
      if (data.extra.newGame) {
        $scope.modal.hide();
      }
      $scope.modal3.hide();
      $scope.modal1.hide();
      $scope.modal2.hide();
    };
    io.socket.on("Update", playerCtrlSocket.update);
    io.socket.on("showWinner", playerCtrlSocket.winner);
    $scope.getTabDetail = function() {
      apiService.getAll(compileData);
    };
    $scope.getTabDetail();

    function compileData(data) {
      $scope.player = _.find(data.playerCards, function(player) {
        return player.playerNo == selectPlayer.getPlayer();
      });

      console.log("$scope.showWinner", data);
      $scope.showWinner = data.showWinner;
      $scope.gameType = data.currentGameType;
      $scope.remainingPlayer = _.filter(data.playerCards, function(player) {
        return player.isActive && !player.isFold;
      }).length;
      if (!$scope.player) {
        $state.go("tab");
      }
      if (data.newGame) {
        $scope.removeWinner();
      }
    }
    $scope.removeWinner = function() {
      $scope.modal.hide();
      $scope.modal1.hide();
    };
    $scope.moveTurn = function() {
      $scope.player.isTurn = true;
      apiService.moveTurn(function(data) {});
    };
    $scope.foldPlayer = function() {
      $scope.player.isTurn = true;
      apiService.foldPlayer(function(data) {});
    };
    io.socket.on("sideShowCancel", function(data) {
      console.log(data.data.playerNo);
      if (data.data.playerNo == selectPlayer.getPlayer()) {
        $scope.modal3.show();
      }
    });
    $scope.cancelSideShow = function() {
      $scope.player.isTurn = true;
      apiService.cancelSideShow(function(data) {});
    };

    // io.socket.on("ShowWinner", $scope.showWinner);
  })

  .controller("TabCtrl", function(
    $scope,
    $stateParams,
    selectPlayer,
    apiService,
    $state
  ) {
    $scope.players = ["1", "2", "3", "4", "5", "6", "7", "8"];
    $scope.form = {};
    $scope.form.adminurl = apiService.getAdminUrl();
    $scope.form.player = selectPlayer.getPlayer();
    $scope.saveForm = function() {
      apiService.saveAdminUrl($scope.form.adminurl);
      selectPlayer.setPlayer($scope.form.player);
      window.location.href = window.location.href.split("#")[0];
    };
  })

  .controller("PlaylistCtrl", function($scope, $stateParams) {});
