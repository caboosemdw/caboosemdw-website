document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('data/gems.json');
  const data = await response.json();
  const gems = data.gems;

  // Build gem map for easy lookup
  const gemMap = {};
  gems.forEach(gem => {
    gemMap[gem.name] = gem;
  });

  // Initialize each slot pair
  const allSlots = document.querySelectorAll('.pair');
  allSlots.forEach(pair => {
    const primarySelect = pair.querySelector('.primary-gem');
    const secondarySelect = pair.querySelector('.secondary-gem');

    // Find which cell this belongs to
    const cellId = pair.closest('.grid-cell').id;

    // Populate dropdowns
    populateDropdown(primarySelect, gems, cellId);
    populateDropdown(secondarySelect, gems, cellId);

    // Set up listeners
    primarySelect.addEventListener('change', () => {
      updatePairedDropdowns(primarySelect, secondarySelect, gems, cellId);
    });
    secondarySelect.addEventListener('change', () => {
      updatePairedDropdowns(secondarySelect, primarySelect, gems, cellId);
    });
  });

  /**
   * Populates a dropdown with valid gems for a given cell
   */
  function populateDropdown(selectEl, gemList, cellId) {
    selectEl.innerHTML = ''; // reset

    // Default option
    const defaultOpt = document.createElement('option');
    defaultOpt.textContent =
      selectEl.classList.contains('primary-gem') ? 'Primary Gem' : 'Secondary Gem';
    defaultOpt.value = '';
    selectEl.appendChild(defaultOpt);

    // Add valid gems for this cell
    gemList.forEach(gem => {
      if (gem.allowedCells.includes(cellId)) {
        const opt = document.createElement('option');
        opt.value = gem.name;
        opt.textContent = gem.name;
        selectEl.appendChild(opt);
      }
    });
  }

  /**
   * Update both dropdowns when one changes
   */
  function updatePairedDropdowns(changedSelect, pairedSelect, gemList, cellId) {
    const selectedValue = changedSelect.value;

    // Rebuild the paired dropdown from scratch
    const prevSelection = pairedSelect.value;
    populateDropdown(pairedSelect, gemList, cellId);

    // Reapply filters:
    // 1. Remove restricted duplicates if applicable
    const restrictedGems = gemList.filter(
      g => g.allowedCells.length === 1 && g.allowedCells.includes(cellId)
    );

    restrictedGems.forEach(rGem => {
      // If the selected gem is restricted, remove all restricted ones from paired
      if (selectedValue === rGem.name) {
        disableRestrictedGems(pairedSelect, restrictedGems);
      }
    });

    // 2. Prevent same gem in both selects
    if (selectedValue) {
      const opt = pairedSelect.querySelector(`option[value="${selectedValue}"]`);
      if (opt) opt.disabled = true;
    }

    // 3. Re-select the previous gem in paired dropdown if still valid
    if (pairedSelect.querySelector(`option[value="${prevSelection}"]:not([disabled])`)) {
      pairedSelect.value = prevSelection;
    } else {
      pairedSelect.value = '';
    }
  }

  /**
   * Disable restricted gems in the dropdown
   */
  function disableRestrictedGems(selectEl, restrictedList) {
    restrictedList.forEach(rGem => {
      const opt = selectEl.querySelector(`option[value="${rGem.name}"]`);
      if (opt) opt.disabled = true;
    });
  }
});