"use client"
import React, {useState, useEffect} from "react";
import axios from "axios";

enum RoundStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED"
}

interface Ronde {
  id: number;
  game_id: number;
  round_no: number;
  status: RoundStatus;
}

interface Game {
  id: number;
  nama: string;
  maxRonde: number;
  round: Ronde[];
}

interface Skor {
  id: number;
  game_id: number;
  round_no: number;
  player_id: number;
  skor: number;
}

interface Player {
  id: number;
  nama_player: string;
  game_id: number;
  game: Game;
  scores: Skor[];
}

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch players, games, dan scores dalam parallel
        const [playersResponse, gamesResponse, scoresResponse] = await Promise.all([
          axios.get("/api/player"),
          axios.get("/api/game"),
          axios.get("/api/score")
        ]);

        // Map players dengan game data dan scores mereka
        const playersWithGamesAndScores = playersResponse.data.map((player: Player) => ({
          ...player,
          game: gamesResponse.data.find((game: Game) => game.id === player.game_id),
          scores: scoresResponse.data.filter((score: Skor) => score.player_id === player.id)
        }));

        setPlayers(playersWithGamesAndScores);
        setGames(gamesResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCompletedRondes = (player: Player) => {
    // Menghitung ronde yang selesai (memiliki skor > 0)
    return player.scores.filter(score => score.skor > 0).length;
  };

  const getPendingRondes = (player: Player, maxRonde: number) => {
    // Menghitung ronde yang belum selesai (skor = 0 atau belum ada skor)
    const completedRounds = getCompletedRondes(player);
    return maxRonde - completedRounds;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <nav className="bg-slate-900 shadow-lg">
        <div className="max-w-screen-xl flex flex-wrap items-center mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity"
          >
            <img src="left-arrow.png" alt="" className="size-8 invert" />
          </a>
          <span className="text-white text-2xl font-bold ml-4 tracking-wide">
            Player List
          </span>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto p-6">
        <ul className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            players.map((player) => (
              <li 
                key={player.id} 
                className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="shrink-0">
                    <div className={`size-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">
                        {player.nama_player.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-white truncate">
                      {player.nama_player}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                        Game: {player.game.nama}
                      </span>
                      <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                        Max Ronde: {player.game.maxRonde}
                      </span>
                      <span className="px-3 py-1 bg-emerald-500 text-white text-sm rounded-full">
                        Ronde Selesai: {getCompletedRondes(player)}
                      </span>
                      <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                        Ronde Belum Selesai: {getPendingRondes(player, player.game.maxRonde)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
