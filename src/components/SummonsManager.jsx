// SummonsManager.jsx
import { useState, useEffect } from "react";

export default function SummonsManager() {
  const [summons, setSummons] = useState([]);

  useEffect(() => {
    fetch("/data/summons.json")
      .then((res) => res.json())
      .then((data) => setSummons(data))
      .catch((err) => console.error("Failed to load summons.json", err));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Summons Manager</h1>
      {summons.map((creature) => (
        <div key={creature.id} className="border rounded-xl p-4 shadow bg-white">
          <h2 className="text-xl font-semibold">{creature.name}</h2>
          <p className="text-sm text-gray-600">{creature.source}</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div><strong>AC:</strong> {creature.ac}</div>
            <div><strong>HP:</strong> {creature.hp}</div>
            <div><strong>Speed:</strong> {creature.speed}</div>
            <div><strong>Senses:</strong> {creature.senses}</div>
            <div><strong>Attack:</strong> {creature.attack.name} ({creature.attack.toHit}, {creature.attack.damage})</div>
          </div>
          {creature.traits?.length > 0 && (
            <div className="mt-2">
              <strong>Traits:</strong>
              <ul className="list-disc list-inside text-sm">
                {creature.traits.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
