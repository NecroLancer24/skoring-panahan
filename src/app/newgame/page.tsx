"use client";
import { useState } from "react";
import axios from "axios";

const WizardForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    gameName: '',
    roundGame: '',
    playerName: '',
    players: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'roundGame') {
      // Hanya menerima input jika itu adalah angka atau string kosong
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddPlayer = () => {
    if (formData.playerName.trim()) {
      setFormData(prev => ({
        ...prev,
        players: [...prev.players, formData.playerName.trim()],
        playerName: ''
      }));
    }
  };

  const handleRemovePlayer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      // Create game
      const gameResponse = await axios.post("/api/game", {
        data: {
          nama_game: formData.gameName,
          max_round: formData.roundGame,
        }
      });
      const gameResult = await gameResponse.data;
      
      // Log untuk memeriksa format data yang dikirim
      const playerDataToSend = formData.players.map(playerName => ({
        nama_player: playerName,
        game_id: gameResult.game.id
      }));
      console.log("Data yang dikirim:", playerDataToSend);

      // Kirim data langsung sebagai array
      const playerResponse = await axios.post("/api/player", playerDataToSend);
      
      const playerResult = await playerResponse.data;
      console.log("Players created successfully:", playerResult);

      const roundeResponse = await axios.post("/api/round", { game_id: gameResult.game.id });
      const roundeResult = await roundeResponse.data;
      console.log("Round created successfully:", roundeResult);
      window.location.href = '/gamelist';
      
    } catch (error) {
      console.error("Error creating game and players:", error);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 m-5 bg-white rounded-lg shadow-lg ">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                                ${step >= item
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 text-gray-300"
                  }`}
              >
                {item}
              </div>
              <span
                className={`text-sm mt-2 ${step >= item ? "text-blue-500" : "text-gray-400"
                  }`}
              >
                Step {item}
              </span>
            </div>
          ))}
        </div>
        <div className="relative w-full h-2 bg-gray-200 rounded">
          <div
            className="absolute h-full bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mb-8">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Game Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game Name
              </label>
              <input
                type="text"
                name="gameName"
                value={formData.gameName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Game Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Round Game
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="roundGame"
                value={formData.roundGame}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Round Game"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Player Details</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Player
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="playerName"
                  value={formData.playerName}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Player Name"
                />
                <button
                  onClick={handleAddPlayer}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Daftar Player */}
            {formData.players.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Players List:</h3>
                <div className="space-y-2">
                  {formData.players.map((player, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{player}</span>
                      <button
                        onClick={() => handleRemovePlayer(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Confirmation</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Game Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-gray-600">Game Name:</p>
                <p className="font-medium">{formData.gameName}</p>
                <p className="text-gray-600">Round Game:</p>
                <p className="font-medium">{formData.roundGame}</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-4 mb-3">Player Details</h3>
              <div className="space-y-2">
                {formData.players.map((player, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600">Player {index + 1}:</p>
                    <p className="font-medium">{player}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className={`px-4 py-2 rounded ${
            step === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
          disabled={step === 1}
        >
          Previous
        </button>
        <button
          onClick={step === totalSteps ? handleSubmit : nextStep}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {step === totalSteps ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default WizardForm;
