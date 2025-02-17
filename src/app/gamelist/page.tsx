"use client";
import React, { useEffect, useState } from "react";

interface Player {
  id: number;
  nama_player: string;
  game_id: number;
  scores: Skor[];
}

interface Skor {
  id: number;
  game_id: number;
  round_no: number;
  player_id: number;
  skor: number;
  createdAt: string;
  updatedAt: string;
}

interface Game {
  id: number;
  nama: string;
  maxRonde: number;
  createdAt: string;
  player: Player[];
}

export default function GameList() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerScores, setPlayerScores] = useState<{ [key: number]: Skor[] }>({});
  const [gameScores, setGameScores] = useState<{ [key: number]: Skor[] }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/game"); // sesuaikan dengan endpoint API Anda
        const data = await response.json();
        console.log(data);
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const fetchAllScores = async () => {
      try {
        const response = await fetch('/api/score');
        const data = await response.json();
        
        // Kelompokkan skor berdasarkan game_id
        const scoresByGame = data.reduce((acc: { [key: number]: Skor[] }, score: Skor) => {
          if (!acc[score.game_id]) {
            acc[score.game_id] = [];
          }
          acc[score.game_id].push(score);
          return acc;
        }, {});
        
        setGameScores(scoresByGame);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchAllScores();
  }, []);
  

  const handleDelete = async (game: Game) => {
    setGameToDelete(game);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!gameToDelete) return;
    
    try {
      const response = await fetch(`/api/game?id=${gameToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGames(games.filter((g) => g.id !== gameToDelete.id));
        setShowDeleteModal(false);
        // Tambahkan toast notification jika diperlukan
      } else {
        alert("Failed to delete game");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("Error deleting game");
    }
  };

  const fetchPlayerScores = async (gameId: number) => {
    try {
      const response = await fetch(`/api/score?gameId=${gameId}`);
      const data = await response.json();

      // Kelompokkan skor berdasarkan player_id
      const scoresByPlayer = data.reduce((acc: { [key: number]: Skor[] }, score: Skor) => {
        if (!acc[score.player_id]) {
          acc[score.player_id] = [];
        }
        acc[score.player_id].push(score);
        return acc;
      }, {});

      setPlayerScores(scoresByPlayer);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="border-b border-gray-200 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-screen-xl flex flex-wrap items-center mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity"
          >
            <img src="left-arrow.png" alt="" className="size-8" />
          </a>
          <span className="text-gray-800 dark:text-white text-2xl font-bold ml-2">
            Game List
          </span>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto p-4">
        <ul className="grid gap-4">
          {games.map((game) => (
            <li
              key={game.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer 
                        hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => {
                setSelectedGame(game);
                fetchPlayerScores(game.id);
                setIsModalOpen(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {game.nama}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {game.maxRonde} Rounds
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {game.player.length} Players
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      !gameScores[game.id] || gameScores[game.id].length === 0 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {!gameScores[game.id] || gameScores[game.id].length === 0 ? 'Pending' : 'Finished'}
                    </span>
                    {(!gameScores[game.id] || gameScores[game.id].length === 0) && (
                      <a
                        href={`/scoring/${game.id}`}
                        className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Score Game
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <span>Created</span>
                  <p className="font-medium">{new Date(game.createdAt).toLocaleDateString()}</p>
                </div>
                  {/* Tombol Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(game);
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedGame.nama}
            </h2>
            <div className="space-y-4">
              {selectedGame.player.map((player) => {
                const playerScoreList = playerScores[player.id] || [];
                const totalScore = playerScoreList.reduce((sum, s) => sum + s.skor, 0);

                return (
                  <div key={player.id} className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      {player.nama_player}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {playerScoreList.map((score, index) => (
                          <span key={score.id} className="mx-1">
                            R{score.round_no}: {score.skor}
                          </span>
                        ))}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        Total: {totalScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && gameToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Delete Game
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete "{gameToDelete.nama}"? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
