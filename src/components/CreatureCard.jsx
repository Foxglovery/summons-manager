// CreatureCard.jsx
import React, { useState } from 'react'; // useState is kept for damageHealAmount

export default function CreatureCard({
  creature,
  currentHp,
  actionAvailable,
  bonusActionAvailable,
  attackAvailable,
  onHpInputChange,
  onDecreaseHp,
  onIncreaseHp,
  onApplyDamage,
  onApplyHealing,
  onToggleAction,
  onToggleBonusAction,
  onToggleAttack,
  onResetActions,
  onRemove,
}) {
  if (!creature) {
    return <div className="p-4 border rounded-lg shadow-md bg-red-100 text-red-700">Error: Creature data is missing.</div>;
  }

  const [damageHealAmount, setDamageHealAmount] = useState(1); // Local state for this input

  const handleLocalHpInputChange = (event) => {
    let newHp = parseInt(event.target.value, 10);
    if (isNaN(newHp)) newHp = 0; // Or some other default/validation
    onHpInputChange(Math.max(0, Math.min(creature.hp, newHp))); // Propagate validated value
  };
  
  const handleDamageHealAmountChange = (event) => {
    const amount = parseInt(event.target.value, 10);
    setDamageHealAmount(isNaN(amount) ? 0 : amount);
  };

  const commonButtonClasses = "w-full py-2.5 px-3 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm"; // Increased py
  const availableButtonClasses = "bg-green-600 hover:bg-green-700 focus:ring-green-500"; // Darker green
  const usedButtonClasses = "bg-slate-500 hover:bg-slate-600 focus:ring-slate-400"; // Darker slate
  const removeButtonClasses = "bg-red-600 hover:bg-red-700 text-white font-bold p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 leading-none"; // p-1.5, rounded-full, leading-none


  return (
    <div className="border rounded-lg p-4 shadow-lg bg-white flex flex-col space-y-4 relative"> {/* shadow-lg, space-y-4 */}
      <button
        onClick={onRemove}
        className={`${removeButtonClasses} absolute top-3 right-3`} // Adjusted position slightly
        aria-label="Remove creature"
      >
        <span className="text-base">&times;</span> {/* Larger 'X' */}
      </button>
      <h3 className="text-xl font-bold text-gray-800 pr-10">{creature.name}</h3> {/* Increased pr for X button */}


      {/* HP Management Section */}
      <div className="p-3 border rounded-md bg-gray-50 space-y-3"> {/* space-y-3 */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700 text-lg">HP:</span> {/* text-lg */}
          <div className="flex items-center space-x-1.5"> {/* space-x-1.5 */}
            <button onClick={onDecreaseHp} className="h-10 w-10 flex items-center justify-center text-xl bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">-</button>
            <input
              type="number"
              value={currentHp} // From prop
              onChange={handleLocalHpInputChange} // Uses local handler to call prop
              className="w-20 text-center border border-gray-300 rounded-md py-2 px-2 text-lg focus:ring-blue-500 focus:border-blue-500" // Increased size & padding
              min="0" max={creature.hp}
            />
            <span className="text-gray-700 text-lg">/ {creature.hp}</span> {/* text-lg */}
            <button onClick={onIncreaseHp} className="h-10 w-10 flex items-center justify-center text-xl bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">+</button>
          </div>
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="number"
            value={damageHealAmount} // Local state
            onChange={handleDamageHealAmountChange} // Local state handler
            className="w-24 border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500" // Increased padding
            placeholder="Amount"
          />
          <button onClick={() => onApplyDamage(damageHealAmount)} className="flex-1 text-sm px-3 py-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-400">Apply Damage</button>
          <button onClick={() => onApplyHealing(damageHealAmount)} className="flex-1 text-sm px-3 py-2 bg-green-200 text-green-800 rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-400">Apply Healing</button>
        </div>
      </div>

      {/* Actions & Attack Section */}
      <div className="p-3 border rounded-md bg-gray-50 space-y-3">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Actions & Attack</h4>
        
        <div className="grid grid-cols-2 gap-3 items-center"> {/* gap-3 */}
          <span className="text-sm font-medium text-gray-600">Action:</span>
          <button 
            onClick={onToggleAction} // Prop
            className={`${commonButtonClasses} ${actionAvailable ? availableButtonClasses : usedButtonClasses}`}
          >
            {actionAvailable ? "Available" : "Used"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center"> {/* gap-3 */}
          <span className="text-sm font-medium text-gray-600">Bonus Action:</span>
          <button 
            onClick={onToggleBonusAction} // Prop
            className={`${commonButtonClasses} ${bonusActionAvailable ? availableButtonClasses : usedButtonClasses}`}
          >
            {bonusActionAvailable ? "Available" : "Used"}
          </button>
        </div>
        
        {creature.attack && (
          <div className="space-y-2 pt-3 border-t mt-3"> {/* pt-3 */}
             <div className="text-sm text-gray-700"> {/* text-gray-700 */}
              <p><strong className="font-semibold">{creature.attack.name}:</strong> {creature.attack.toHit}, {creature.attack.damage}</p> {/* Attack name semi-bold */}
            </div>
            <button 
              onClick={onToggleAttack} // Prop
              className={`${commonButtonClasses} ${attackAvailable ? availableButtonClasses : usedButtonClasses}`}
            >
              {attackAvailable ? `Use ${creature.attack.name}` : `${creature.attack.name} Used`}
            </button>
          </div>
        )}
        
        <button 
          onClick={onResetActions} // Prop
          className={`w-full mt-3 py-2.5 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm`} // Darker blue
        >
          Reset Actions for New Turn
        </button>
      </div>

      {/* Static Details Section (AC, Speed, Senses) */}
      <div className="space-y-1 pt-1 text-sm"> {/* space-y-1, pt-1, text-sm for all children */}
        <div className="flex justify-between items-center"><span className="font-medium text-gray-600">AC:</span> <span className="text-gray-800 font-medium">{creature.ac}</span></div>
        <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Speed:</span> <span className="text-gray-800">{creature.speed}</span></div>
        {creature.senses && <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Senses:</span> <span className="text-gray-800">{creature.senses}</span></div>}
      </div>

      {creature.traits && creature.traits.length > 0 && (
        <div className="pt-2">
          <h4 className="font-semibold text-gray-700 text-base mb-1">Traits:</h4> {/* text-base, mb-1 */}
          <ul className="list-disc list-inside text-sm text-gray-600 pl-2 space-y-0.5"> {/* space-y-0.5 */}
            {creature.traits.map((trait, index) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
