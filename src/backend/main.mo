import Map "mo:core/Map";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type GameId = Nat;
  type LuckyNumberSetId = Nat;

  type Game = {
    id : GameId;
    name : Text;
    drawTime : Int;
    colorTheme : Text;
  };

  type LuckyNumberSet = {
    id : LuckyNumberSetId;
    gameId : GameId;
    numbers : [Nat];
    timestamp : Int;
  };

  var nextGameId : GameId = 5;
  var nextLuckyNumberSetId : LuckyNumberSetId = 1;

  let sampleGames : [(GameId, Game)] = [
    (
      1,
      {
        id = 1;
        name = "Weekly Jackpot";
        drawTime = 1924972800; // Example timestamp
        colorTheme = "blue";
      },
    ),
    (
      2,
      {
        id = 2;
        name = "Daily Double";
        drawTime = 1925059200; // Example timestamp
        colorTheme = "red";
      },
    ),
    (
      3,
      {
        id = 3;
        name = "Midnight Millions";
        drawTime = 1925145600; // Example timestamp
        colorTheme = "purple";
      },
    ),
    (
      4,
      {
        id = 4;
        name = "Lucky Seven";
        drawTime = 1925232000; // Example timestamp
        colorTheme = "green";
      },
    ),
  ];

  let games = Map.fromIter<GameId, Game>(sampleGames.values());
  let luckyNumberSets = Map.empty<LuckyNumberSetId, LuckyNumberSet>();

  // Game CRUD operations
  public shared ({ caller }) func createGame(name : Text, drawTime : Int, colorTheme : Text) : async GameId {
    let gameId = nextGameId;
    let game : Game = {
      id = gameId;
      name;
      drawTime;
      colorTheme;
    };
    games.add(gameId, game);
    nextGameId += 1;
    gameId;
  };

  public shared ({ caller }) func updateGame(gameId : GameId, name : Text, drawTime : Int, colorTheme : Text) : async () {
    switch (games.get(gameId)) {
      case (null) { Runtime.trap("Game not found") };
      case (?_) {
        let updatedGame : Game = {
          id = gameId;
          name;
          drawTime;
          colorTheme;
        };
        games.add(gameId, updatedGame);
      };
    };
  };

  public shared ({ caller }) func deleteGame(gameId : GameId) : async () {
    switch (games.get(gameId)) {
      case (null) { Runtime.trap("Game not found") };
      case (?_) {
        games.remove(gameId);
      };
    };
  };

  public query ({ caller }) func getGame(gameId : GameId) : async Game {
    switch (games.get(gameId)) {
      case (null) { Runtime.trap("Game not found") };
      case (?game) { game };
    };
  };

  public query ({ caller }) func getAllGames() : async [Game] {
    games.values().toArray();
  };

  // Generate and store lucky numbers
  public shared ({ caller }) func generateAndSaveLuckyNumbers(gameId : GameId) : async LuckyNumberSetId {
    switch (games.get(gameId)) {
      case (null) { Runtime.trap("Game does not exist") };
      case (?_) {
        let luckyNumberSetId = nextLuckyNumberSetId;
        let numbers = Array.tabulate(6, func(i) { i + 1 }); // Placeholder for random numbers
        let timestamp = Time.now();

        let luckyNumberSet : LuckyNumberSet = {
          id = luckyNumberSetId;
          gameId;
          numbers;
          timestamp;
        };

        luckyNumberSets.add(luckyNumberSetId, luckyNumberSet);
        nextLuckyNumberSetId += 1;
        luckyNumberSetId;
      };
    };
  };

  public query ({ caller }) func getLuckyNumberSetsForGame(gameId : GameId) : async [LuckyNumberSet] {
    let filteredIter = luckyNumberSets.values().filter(
      func(set) { set.gameId == gameId }
    );
    filteredIter.toArray();
  };

  public query ({ caller }) func getLuckyNumberSet(luckyNumberSetId : LuckyNumberSetId) : async LuckyNumberSet {
    switch (luckyNumberSets.get(luckyNumberSetId)) {
      case (null) { Runtime.trap("Lucky number set not found") };
      case (?set) { set };
    };
  };

  public query ({ caller }) func getAllLuckyNumberSets() : async [LuckyNumberSet] {
    luckyNumberSets.values().toArray();
  };
};
