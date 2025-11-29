// js/gems.js
// 🧙 Dynamic Gem Dropdown Management for Cab's Avabur Gem Calc

// Load gem data from JSON
async function loadGems() {
  const response = await fetch('data/gems.json');
  const data = await response.json();
  return data.gems;
}

// Populate all gem dropdowns dynamically
async function populateGemDropdowns() {
  const gems = await loadGems();

  // Cells that contain gem selections
  const activeCells = ['cell-1', 'cell-2', 'cell-4', 'cell-5', 'cell-6', 'cell-8'];

  activeCells.forEach(cellId => {
    const cell = document.getElementById(cellId);
    const pairs = cell.querySelectorAll('.gem-pair');

    // Filter gems allowed in this specific cell
    const allowedGems = gems.filter(gem => gem.allowedCells.includes(cellId));

    pairs.forEach(pair => {
      const primarySelect = pair.querySelector('.primary');
      const secondarySelect = pair.querySelector('.secondary');

      // Populate both dropdowns initially
      populateDropdown(primarySelect, allowedGems);
      populateDropdown(secondarySelect, allowedGems);

      // Change listeners for synchronization and restrictions
      primarySelect.addEventListener('change', () => {
        syncPairedDropdowns(primarySelect, secondarySelect, allowedGems, cellId);
      });
      secondarySelect.addEventListener('change', () => {
        syncPairedDropdowns(secondarySelect, primarySelect, allowedGems, cellId);
      });
    });
  });
}

// Populate a dropdown with gem options
function populateDropdown(select, gems) {
  select.innerHTML = ''; // clear existing
  const defaultOption = document.createElement('option');
  defaultOption.textContent = select.classList.contains('primary') ? 'Primary Gem' : 'Secondary Gem';
  select.appendChild(defaultOption);

  gems.forEach(gem => {
    const option = document.createElement('option');
    option.value = gem.name;
    option.textContent = gem.name;

    // 🔹 Mark restricted gems (those with limited allowed cells)
    if (gem.allowedCells.length < 6) {
      option.dataset.restricted = "true";
    }

    select.appendChild(option);
  });
}

// Synchronize two paired dropdowns (Primary ↔ Secondary)
function syncPairedDropdowns(changedSelect, pairedSelect, allowedGems, cellId) {
  const changedValue = changedSelect.value;

  // Identify restricted gems (those allowed in fewer than all 6 active cells)
  const restrictedGems = allowedGems
    .filter(gem => gem.allowedCells.length < 6)
    .map(g => g.name);

  // Re-populate paired dropdown to reset availability
  const previousValue = pairedSelect.value;
  populateDropdown(pairedSelect, allowedGems);

  // Restore previous selection if still valid
  if (previousValue && previousValue !== changedValue) {
    pairedSelect.value = previousValue;
  }

  // If restricted gem selected, remove all other restricted gems from the paired dropdown
  if (restrictedGems.includes(changedValue)) {
    restrictedGems.forEach(rg => {
      if (rg !== changedValue) {
        const opt = pairedSelect.querySelector(`option[value="${rg}"]`);
        if (opt) opt.remove();
      }
    });
  }

  // Remove the selected gem itself from the paired dropdown
  if (changedValue && changedValue !== 'Primary Gem' && changedValue !== 'Secondary Gem') {
    const opt = pairedSelect.querySelector(`option[value="${changedValue}"]`);
    if (opt) opt.remove();
  }

  // Trigger summary update (if function exists globally)
  if (typeof updateSummaryTables === 'function') {
    updateSummaryTables();
  }
}

// Initialize population after DOM is ready
window.addEventListener('DOMContentLoaded', populateGemDropdowns);