// SummonsManager.jsx
import { useState, useEffect } from "react";
import CreatureCard from "./CreatureCard"; // Import CreatureCard

export default function SummonsManager() {
  const [creatureTemplates, setCreatureTemplates] = useState([]);
  const [activeSummons, setActiveSummons] = useState([]);

  useEffect(() => {
    fetch("/summons.json")
      .then((res) => res.json())
      .then((data) => setCreatureTemplates(data))
      .catch((err) => console.error("Failed to load summons.json", err));
  }, []);

  const handleAddSummon = (template) => {
    const newSummon = {
      ...template, // Spread original creature data
      id: `${template.id}-${Date.now()}`, // Unique ID for this instance
      currentHp: template.hp,
      actionAvailable: true,
      bonusActionAvailable: true,
      attackAvailable: true,
    };
    setActiveSummons((prevSummons) => [...prevSummons, newSummon]);
  };

  // Handler functions to update individual creature states
  const updateSummonState = (creatureId, updateFn) => {
    setActiveSummons(prevSummons =>
      prevSummons.map(s => (s.id === creatureId ? updateFn(s) : s))
    );
  };

  const handleHpInputChange = (creatureId, newHp) => {
    updateSummonState(creatureId, s => ({ ...s, currentHp: Math.max(0, Math.min(s.hp, newHp)) }));
  };

  const handleDecreaseHp = (creatureId) => {
    updateSummonState(creatureId, s => ({ ...s, currentHp: Math.max(0, s.currentHp - 1) }));
  };

  const handleIncreaseHp = (creatureId) => {
    updateSummonState(creatureId, s => ({ ...s, currentHp: Math.min(s.hp, s.currentHp + 1) }));
  };

  const handleApplyDamage = (creatureId, amount) => {
    updateSummonState(creatureId, s => ({ ...s, currentHp: Math.max(0, s.currentHp - amount) }));
  };

  const handleApplyHealing = (creatureId, amount) => {
    updateSummonState(creatureId, s => ({ ...s, currentHp: Math.min(s.hp, s.currentHp + amount) }));
  };

  const handleToggleAction = (creatureId) => {
    updateSummonState(creatureId, s => ({ ...s, actionAvailable: !s.actionAvailable }));
  };

  const handleToggleBonusAction = (creatureId) => {
    updateSummonState(creatureId, s => ({ ...s, bonusActionAvailable: !s.bonusActionAvailable }));
  };

  const handleToggleAttack = (creatureId) => {
    updateSummonState(creatureId, s => ({ ...s, attackAvailable: !s.attackAvailable }));
  };

  const handleResetActions = (creatureId) => {
    updateSummonState(creatureId, s => ({
      ...s,
      actionAvailable: true,
      bonusActionAvailable: true,
      attackAvailable: true,
    }));
  };

  const handleRemoveCreature = (creatureId) => {
    setActiveSummons(prevSummons => prevSummons.filter(s => s.id !== creatureId));
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-6"> {/* Adjusted padding for responsiveness */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">Summons Manager</h1> {/* Adjusted margin */}

      {/* Section for Creature Templates */}
      <div className="p-4 border rounded-lg shadow-lg bg-slate-50 space-y-4"> {/* Adjusted child margin from space-y-3 to space-y-4 */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Available Creatures</h2> {/* Adjusted margin */}
        {creatureTemplates.length === 0 && <p className="text-gray-500 text-center">Loading creature templates...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Adjusted grid for sm and xl */}
          {creatureTemplates.map((creature) => (
            <div key={creature.id} className="border rounded-xl p-4 shadow-md bg-white flex flex-col justify-between items-center hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">{creature.name}</h3> {/* Added mb-3 and text-center */}
              <button
                onClick={() => handleAddSummon(creature)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition-colors text-center"
              >
                Add to Tracker
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section for Active Summons */}
      {activeSummons.length > 0 && (
        <div className="p-4 border rounded-lg shadow-lg bg-slate-50 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tracked Summons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeSummons.map((activeCreature) => (
              <CreatureCard
                key={activeCreature.id}
                creature={activeCreature} // Contains base stats + unique id
                currentHp={activeCreature.currentHp}
                actionAvailable={activeCreature.actionAvailable}
                bonusActionAvailable={activeCreature.bonusActionAvailable}
                attackAvailable={activeCreature.attackAvailable}
                onHpInputChange={(newHp) => handleHpInputChange(activeCreature.id, newHp)}
                onDecreaseHp={() => handleDecreaseHp(activeCreature.id)}
                onIncreaseHp={() => handleIncreaseHp(activeCreature.id)}
                onApplyDamage={(amount) => handleApplyDamage(activeCreature.id, amount)}
                onApplyHealing={(amount) => handleApplyHealing(activeCreature.id, amount)}
                onToggleAction={() => handleToggleAction(activeCreature.id)}
                onToggleBonusAction={() => handleToggleBonusAction(activeCreature.id)}
                onToggleAttack={() => handleToggleAttack(activeCreature.id)}
                onResetActions={() => handleResetActions(activeCreature.id)}
                onRemove={() => handleRemoveCreature(activeCreature.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
