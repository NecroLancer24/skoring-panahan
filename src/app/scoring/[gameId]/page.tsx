"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Player {
  id: number;
  nama_player: string;
  game_id: number;
  skor: number;
}

interface Game {
  id: number;
  nama: string;
  maxRonde: number;
  createdAt: string;
  player: Player[];
}

interface RoundScore {
  [playerId: number]: number;
}

interface GameScores {
  [round: number]: RoundScore;
}

interface Round {
  game_id: number;
}

export default function ScoringGame() {
  const [game, setGame] = useState<Game | null>(null);
  const [scores, setScores] = useState<GameScores>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const pathParts = window.location.pathname.split('/');
        const gameId = pathParts[pathParts.length - 1];

        // Fetch all games
        const { data: allGames } = await axios.get('/api/game');
        
        // Find the specific game that matches the ID
        const selectedGame = allGames.find((g: Game) => g.id === parseInt(gameId));
        
        if (!selectedGame) {
          setLoading(false);
          return;
        }

        setGame(selectedGame);
        
        const initialScores: GameScores = {};
        for (let i = 1; i <= selectedGame.maxRonde; i++) {
          initialScores[i] = {};
          selectedGame.player.forEach((player: Player) => {
            initialScores[i][player.id] = 0;
          });
        }
        setScores(initialScores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game:", error);
        setLoading(false);
      }
    };

    fetchGame();
  }, []);

  const handleScoreChange = (playerId: number, round: number, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    setScores(prev => ({
      ...prev,
      [round]: {
        ...prev[round],
        [playerId]: numValue
      }
    }));
  };

  const calculateTotalScore = (playerId: number) => {
    return Object.values(scores).reduce((total, round) => {
      return total + (round[playerId] || 0);
    }, 0);
  };

  const handleSaveScores = async () => {
    try {
      const pathParts = window.location.pathname.split('/');
      const gameId = pathParts[pathParts.length - 1];
      
      // Fetch all rounds and filter by current gameId
      const { data: allRounds } = await axios.get('/api/round');
      const currentGameRounds = allRounds.filter((round: Round) => round.game_id === parseInt(gameId));
      const currentRoundCount = currentGameRounds.length;
      
      // Hanya buat round baru jika belum mencapai maxRonde
      if (currentRoundCount < game!.maxRonde) {
        const remainingRounds = game!.maxRonde - currentRoundCount;
        const rounds = [...Array(remainingRounds)].map((_, index) => currentRoundCount + index + 1);
        
        for (const roundNum of rounds) {
          await axios.post('/api/round', {
            game_id: parseInt(gameId),
          });
        }
      }

      // Proses pengiriman score
      for (const [roundNum, playerScores] of Object.entries(scores)) {
        for (const [playerId, score] of Object.entries(playerScores)) {
          await axios.post('/api/score', {
            round_no: Number(roundNum),
            player_id: Number(playerId),
            game_id: Number(gameId),
            skor: score
          });
        }
      }

      window.location.href = '/gamelist';
    } catch (error) {
      console.error("Error saving scores:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Game not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="border-b border-gray-200 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-screen-xl flex flex-wrap items-center mx-auto p-4">
          <a
            href="/gamelist"
            className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity"
          >
            <img src="/left-arrow.png" alt="" className="size-8" />
          </a>
          <span className="text-gray-800 dark:text-white text-2xl font-bold ml-2">
            Scoring: {game.nama}
          </span>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Game Information</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 dark:text-gray-300">Game Name:</p>
              <p className="text-gray-800 dark:text-white font-semibold">{game.nama}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">Total Rounds:</p>
              <p className="text-gray-800 dark:text-white font-semibold">{game.maxRonde}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Player List</h3>
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="py-2 px-4 text-left text-gray-800 dark:text-white">No</th>
                <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Player Name</th>
                <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Current Score</th>
              </tr>
            </thead>
            <tbody>
              {game.player.map((player, index) => (
                <tr key={player.id} className="border-b dark:border-gray-700">
                  <td className="py-2 px-4 text-gray-800 dark:text-white">{index + 1}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-medium">
                          {player.nama_player.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-800 dark:text-white">{player.nama_player}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-gray-800 dark:text-white">{player.skor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="py-3 px-4 text-left text-gray-800 dark:text-white">Player</th>
                {[...Array(game.maxRonde)].map((_, index) => (
                  <th key={index + 1} className="py-3 px-4 text-center text-gray-800 dark:text-white">
                    Round {index + 1}
                  </th>
                ))}
                <th className="py-3 px-4 text-center text-gray-800 dark:text-white">Total</th>
              </tr>
            </thead>
            <tbody>
              {game.player.map((player) => (
                <tr key={player.id} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-medium">
                          {player.nama_player.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-800 dark:text-white">
                        {player.nama_player}
                      </span>
                    </div>
                  </td>
                  {[...Array(game.maxRonde)].map((_, index) => (
                    <td key={index + 1} className="py-3 px-4">
                      <input
                        type="number"
                        value={scores[index + 1]?.[player.id] || ""}
                        onChange={(e) => handleScoreChange(player.id, index + 1, e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-center"
                        placeholder="0"
                        min="0"
                      />
                    </td>
                  ))}
                  <td className="py-3 px-4 text-center font-semibold text-gray-800 dark:text-white">
                    {calculateTotalScore(player.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveScores}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                       transition-colors font-medium flex items-center"
            >
              Save Scores
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 