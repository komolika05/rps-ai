import { useState } from "react";

const choices = ["rock", "paper", "scissors"] as const;
type Choice = (typeof choices)[number];

export default function Game() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<Choice[]>([]);

  const decideWinner = (player: Choice, ai: Choice) => {
    if (player === ai) return "Draw";
    if (
      (player === "rock" && ai === "scissors") ||
      (player === "paper" && ai === "rock") ||
      (player === "scissors" && ai === "paper")
    )
      return "You Win";
    return "You Lose";
  };

  const predictNextMove = (pastMoves: Choice[]): Choice => {
    if (pastMoves.length < 3) {
      return choices[Math.floor(Math.random() * 3)];
    }
    const freq: Record<Choice, number> = {
      rock: 0,
      paper: 0,
      scissors: 0,
    };
    pastMoves.forEach((move) => freq[move]++);
    const likelyMove = Object.entries(freq).sort(
      (a, b) => b[1] - a[1]
    )[0][0] as Choice;

    // AI picks the counter move
    const counter: Record<Choice, Choice> = {
      rock: "paper",
      paper: "scissors",
      scissors: "rock",
    };
    return counter[likelyMove];
  };

  const play = (choice: Choice) => {
    setPlayerChoice(choice);
    const ai = predictNextMove(history);
    setAiChoice(ai);
    setResult(decideWinner(choice, ai));
    setHistory((prev) => [...prev.slice(-4), choice]); // Keep last 5 moves
  };

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold mb-4">
        Rock Paper Scissors: AI Edition
      </h1>
      <div className="space-x-4">
        {choices.map((choice) => (
          <button
            key={choice}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => play(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {playerChoice && (
        <div className="mt-4">
          <p>You chose: {playerChoice}</p>
          <p>AI chose: {aiChoice}</p>
          <p className="font-bold">{result}</p>
        </div>
      )}
    </div>
  );
}
