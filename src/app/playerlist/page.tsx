"use client"
import React, {useState, useEffect} from "react";
import axios from "axios";

interface Game {
  id: number;
  nama: string;
  maxRonde: number;
}

interface Player {
  id: number;
  nama_player: string;
  game_id: number;
  game: Game;
}

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await axios.get("/api/player");
      console.log(response.data);
      setPlayers(response.data);
      setIsLoading(false);
    };
    fetchPlayers();
  }, []);

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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                        Game: {player.game.nama}
                      </span>
                      <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                        Max Ronde: {player.game.maxRonde}
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
