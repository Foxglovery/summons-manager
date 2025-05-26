import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SummonsManager from './SummonsManager';
import React from 'react';

// Mocking fetch
const mockSummonsData = [
  { id: 'g1', name: 'Goblin', ac: 13, hp: 7, speed: '30ft', senses: 'Darkvision 60ft', attack: { name: 'Scimitar', toHit: '+4', damage: '1d6+2' }, traits: ['Nimble Escape'] },
  { id: 's1', name: 'Skeleton', ac: 13, hp: 13, speed: '30ft', senses: 'Darkvision 60ft', attack: { name: 'Shortsword', toHit: '+4', damage: '1d6+2' }, traits: [] },
];

// Store the original fetch implementation
const originalFetch = global.fetch;

beforeEach(() => {
  // Restore the original fetch before each test to ensure clean mocks
  global.fetch = vi.fn().mockResolvedValue({
    ok: true, // Ensure the response is marked as ok
    json: async () => mockSummonsData,
  });
});

afterEach(() => {
  // Clean up and restore original fetch after each test
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});


describe('SummonsManager', () => {
  it('renders title and fetches creature templates on mount', async () => {
    render(<SummonsManager />);
    expect(screen.getByText('Summons Manager')).toBeInTheDocument();
    expect(screen.getByText('Available Creatures')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Goblin')).toBeInTheDocument();
      expect(screen.getByText('Skeleton')).toBeInTheDocument();
    });
  });

  it('adds a creature to active summons when "Add to Tracker" is clicked', async () => {
    render(<SummonsManager />);
    await waitFor(() => expect(screen.getByText('Goblin')).toBeInTheDocument());

    const addGoblinButton = screen.getAllByText('Add to Tracker').find(button => button.closest('div').textContent.includes('Goblin'));
    fireEvent.click(addGoblinButton);

    await waitFor(() => {
      expect(screen.getByText('Tracked Summons')).toBeInTheDocument();
      const trackedSummonsSection = screen.getByText('Tracked Summons').closest('div');
      expect(trackedSummonsSection).toHaveTextContent('Goblin');
      // Check for HP display (input value and static text)
      expect(screen.getByDisplayValue('7')).toBeInTheDocument(); // Goblin's current HP
      expect(screen.getByText('/ 7')).toBeInTheDocument(); // Goblin's max HP
    });
  });

  it('removes a creature when its "Remove" button is clicked', async () => {
    render(<SummonsManager />);
    await waitFor(() => expect(screen.getByText('Goblin')).toBeInTheDocument());

    // Add Goblin
    const addGoblinButton = screen.getAllByText('Add to Tracker').find(button => button.closest('div').textContent.includes('Goblin'));
    fireEvent.click(addGoblinButton);

    // Wait for Goblin to appear in tracked summons
    await waitFor(() => {
        const trackedGoblinName = screen.getAllByText('Goblin').find(el => el.closest('.shadow-lg')?.querySelector('button[aria-label="Remove creature"]'));
        expect(trackedGoblinName).toBeInTheDocument();
    });
    
    // Find the remove button for the tracked Goblin
    // The 'X' button has aria-label="Remove creature"
    const removeButton = screen.getByLabelText('Remove creature');
    fireEvent.click(removeButton);

    await waitFor(() => {
      const trackedSummonsSection = screen.queryByText('Tracked Summons');
      if (trackedSummonsSection) { // If section still exists, check its content
        expect(trackedSummonsSection.parentNode).not.toHaveTextContent('Goblin');
      } else { // Section is gone, which also means Goblin is gone
        expect(trackedSummonsSection).toBeNull();
      }
    });
  });

  it('updates creature HP when HP is changed on CreatureCard', async () => {
    render(<SummonsManager />);
    await waitFor(() => expect(screen.getByText('Goblin')).toBeInTheDocument());

    const addGoblinButton = screen.getAllByText('Add to Tracker').find(button => button.closest('div').textContent.includes('Goblin'));
    fireEvent.click(addGoblinButton);

    await waitFor(() => {
      // Check for initial HP display
      expect(screen.getByDisplayValue('7')).toBeInTheDocument(); 
      expect(screen.getByText('/ 7')).toBeInTheDocument();
    });
    
    // Find the "-" button for the tracked Goblin's HP.
    // It's a button with text content "-" inside the CreatureCard
    const decreaseHpButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
    expect(decreaseHpButton).toBeInTheDocument();
    fireEvent.click(decreaseHpButton);

    await waitFor(() => {
      // Check for updated HP display
      expect(screen.getByDisplayValue('6')).toBeInTheDocument();
      expect(screen.getByText('/ 7')).toBeInTheDocument();
    });
  });

  it('toggles action availability when action button on CreatureCard is clicked', async () => {
    render(<SummonsManager />);
    await waitFor(() => expect(screen.getByText('Goblin')).toBeInTheDocument());

    const addGoblinButton = screen.getAllByText('Add to Tracker').find(button => button.closest('div').textContent.includes('Goblin'));
    fireEvent.click(addGoblinButton);
    
    let actionButton;
    await waitFor(() => {
      // The button has text "Available" or "Used" and is next to "Action:"
      const actionLabel = screen.getByText('Action:');
      actionButton = actionLabel.nextElementSibling;
      expect(actionButton).toHaveTextContent('Available');
    });

    fireEvent.click(actionButton);

    await waitFor(() => {
      expect(actionButton).toHaveTextContent('Used');
    });
  });
});
