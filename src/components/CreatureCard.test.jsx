import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CreatureCard from './CreatureCard';
import React from 'react';

const mockCreatureBase = {
  id: 'test1',
  name: 'Test Goblin',
  ac: 13,
  hp: 7, // Max HP
  speed: '30ft',
  senses: 'Darkvision 60ft',
  attack: { name: 'Scimitar', toHit: '+4', damage: '1d6+2 slashing' },
  traits: ['Nimble Escape'],
};

// Props for CreatureCard, including state values and handlers
const getMockProps = (overrides = {}) => ({
  creature: { ...mockCreatureBase, ...overrides.creature }, // creature data itself
  currentHp: overrides.currentHp !== undefined ? overrides.currentHp : mockCreatureBase.hp,
  actionAvailable: overrides.actionAvailable !== undefined ? overrides.actionAvailable : true,
  bonusActionAvailable: overrides.bonusActionAvailable !== undefined ? overrides.bonusActionAvailable : true,
  attackAvailable: overrides.attackAvailable !== undefined ? overrides.attackAvailable : true,
  onHpInputChange: vi.fn(),
  onDecreaseHp: vi.fn(),
  onIncreaseHp: vi.fn(),
  onApplyDamage: vi.fn(),
  onApplyHealing: vi.fn(),
  onToggleAction: vi.fn(),
  onToggleBonusAction: vi.fn(),
  onToggleAttack: vi.fn(),
  onResetActions: vi.fn(),
  onRemove: vi.fn(),
});

describe('CreatureCard', () => {
  it('renders basic creature information', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    expect(screen.getByText(mockCreatureBase.name)).toBeInTheDocument();
    expect(screen.getByText('AC:')).toBeInTheDocument();
    expect(screen.getByText(mockCreatureBase.ac.toString())).toBeInTheDocument();
    // Check for HP display (split into input value and static text)
    expect(screen.getByDisplayValue(props.currentHp.toString())).toBeInTheDocument();
    expect(screen.getByText(`/ ${mockCreatureBase.hp}`)).toBeInTheDocument();
  });

  it('renders attack details and traits', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    expect(screen.getByText(`${mockCreatureBase.attack.name}:`)).toBeInTheDocument();
    expect(screen.getByText(`${mockCreatureBase.attack.toHit}, ${mockCreatureBase.attack.damage}`)).toBeInTheDocument();
    expect(screen.getByText('Traits:')).toBeInTheDocument();
    expect(screen.getByText(mockCreatureBase.traits[0])).toBeInTheDocument();
  });

  it('calls onHpInputChange when HP input is changed', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    const hpInput = screen.getByDisplayValue(props.currentHp.toString()); // Input type number might be tricky
    fireEvent.change(hpInput, { target: { value: '5' } });
    expect(props.onHpInputChange).toHaveBeenCalledWith(5);
  });

  it('calls onDecreaseHp when "-" HP button is clicked', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    // The button is just "-", find by role and text content if possible or more specific selector
    const decreaseButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
    fireEvent.click(decreaseButton);
    expect(props.onDecreaseHp).toHaveBeenCalled();
  });

  it('calls onIncreaseHp when "+" HP button is clicked', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    const increaseButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
    fireEvent.click(increaseButton);
    expect(props.onIncreaseHp).toHaveBeenCalled();
  });

  it('calls onApplyDamage with correct amount', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    const amountInput = screen.getByPlaceholderText('Amount');
    fireEvent.change(amountInput, { target: { value: '3' } });
    fireEvent.click(screen.getByText('Apply Damage'));
    expect(props.onApplyDamage).toHaveBeenCalledWith(3);
  });

  it('calls onApplyHealing with correct amount', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    const amountInput = screen.getByPlaceholderText('Amount');
    fireEvent.change(amountInput, { target: { value: '2' } });
    fireEvent.click(screen.getByText('Apply Healing'));
    expect(props.onApplyHealing).toHaveBeenCalledWith(2);
  });

  it('calls onToggleAction when action button is clicked', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    // Find the button next to "Action:" label
    const actionLabel = screen.getByText('Action:');
    const actionButton = actionLabel.nextElementSibling; // This assumes button is immediate sibling
    fireEvent.click(actionButton);
    expect(props.onToggleAction).toHaveBeenCalled();
  });
  
  it('calls onToggleBonusAction when bonus action button is clicked', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
     // Find the button next to "Bonus Action:" label
    const bonusActionLabel = screen.getByText('Bonus Action:');
    const bonusActionButton = bonusActionLabel.nextElementSibling; // This assumes button is immediate sibling
    fireEvent.click(bonusActionButton);
    expect(props.onToggleBonusAction).toHaveBeenCalled();
  });

  it('calls onToggleAttack when attack button is clicked', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    fireEvent.click(screen.getByText(`Use ${mockCreatureBase.attack.name}`));
    expect(props.onToggleAttack).toHaveBeenCalled();
  });

  it('calls onResetActions when reset button is clicked', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    fireEvent.click(screen.getByText('Reset Actions for New Turn'));
    expect(props.onResetActions).toHaveBeenCalled();
  });

  it('calls onRemove when remove button is clicked', () => {
    const props = getMockProps();
    render(<CreatureCard {...props} />);
    fireEvent.click(screen.getByLabelText('Remove creature'));
    expect(props.onRemove).toHaveBeenCalled();
  });

  it('displays correct text and style for action button when actionAvailable is true', () => {
    const props = getMockProps({ actionAvailable: true });
    render(<CreatureCard {...props} />);
    // Find the button next to "Action:" label
    const actionLabel = screen.getByText('Action:');
    const actionButton = actionLabel.nextElementSibling; // Assumes button is immediate sibling
    expect(actionButton).toHaveTextContent('Available');
    expect(actionButton).toHaveClass('bg-green-600'); // Or whatever the 'available' class is
  });

  it('displays correct text and style for action button when actionAvailable is false', () => {
    const props = getMockProps({ actionAvailable: false });
    render(<CreatureCard {...props} />);
     // Find the button next to "Action:" label
    const actionLabel = screen.getByText('Action:');
    const actionButton = actionLabel.nextElementSibling; // Assumes button is immediate sibling
    expect(actionButton).toHaveTextContent('Used');
    expect(actionButton).toHaveClass('bg-slate-500'); // Or whatever the 'used' class is
  });
});
