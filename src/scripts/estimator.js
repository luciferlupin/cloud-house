/**
 * Cloudhouse Interactive Tender Estimator & Booking Engine
 * Tailored for Delhi NCR & Destination Celebrations (Weddings, Diwali Parties, House Parties)
 */

export function initTenderEstimator() {
  const guestSlider = document.getElementById('sliderGuests');
  const durationSlider = document.getElementById('sliderDuration');
  const stationsSlider = document.getElementById('sliderStations');
  const eventTypeBtns = document.querySelectorAll('.setting-chip');
  const tierSelect = document.getElementById('selectMixologyTier');

  const valGuests = document.getElementById('valGuests');
  const valDuration = document.getElementById('valDuration');
  const valStations = document.getElementById('valStations');

  const receiptTotal = document.getElementById('receiptTotal');
  const receiptGuests = document.getElementById('receiptGuests');
  const receiptStations = document.getElementById('receiptStations');
  const receiptDuration = document.getElementById('receiptDuration');
  const receiptSommeliers = document.getElementById('receiptSommeliers');
  const receiptTier = document.getElementById('receiptTier');

  if (!guestSlider || !receiptTotal) return;

  let state = {
    eventType: 'House / Terrace Party',
    guests: parseInt(guestSlider.value, 10) || 35,
    duration: parseInt(durationSlider?.value, 10) || 4,
    stations: parseInt(stationsSlider?.value, 10) || 4,
    mixologyTier: 'reserve',
    tierMultipliers: {
      standard: { name: 'Atelier Signature', pipeRate: 2800, headRate: 600 },
      reserve: { name: 'Reserve Botanicals (Jatin’s Curated)', pipeRate: 3800, headRate: 950 },
      imperial: { name: 'Imperial Royal Gold (Rare Blends & Caviar)', pipeRate: 5500, headRate: 1500 }
    }
  };

  function calculateCrew(stations) {
    // 1 Master Tender & Charcoal Specialist per 2-3 stations
    return Math.max(1, Math.ceil(stations / 2));
  }

  function recalculate() {
    const tier = state.tierMultipliers[state.mixologyTier] || state.tierMultipliers.reserve;
    const crewCount = calculateCrew(state.stations);

    // Pricing in INR: Hardware Fleet + Sommelier Crew + Botanical & Charcoal refills
    const hardwareBase = state.stations * tier.pipeRate;
    const crewRate = crewCount * state.duration * 1200; // Trained Delhi shisha mixologists
    const consumableHeads = Math.ceil(state.guests / 4) * tier.headRate;
    const logisticsBase = 3500; // Delhi NCR rapid transport & laser ignition setup

    const total = hardwareBase + crewRate + consumableHeads + logisticsBase;

    // Update Slider UI labels
    if (valGuests) valGuests.textContent = `${state.guests} Guests`;
    if (valDuration) valDuration.textContent = `${state.duration} Hours`;
    if (valStations) valStations.textContent = `${state.stations} Titanium Units`;

    // Update Live Receipt UI in Indian Rupees
    receiptTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (receiptGuests) receiptGuests.textContent = `${state.guests} Curated Guests`;
    if (receiptStations) receiptStations.textContent = `${state.stations} Titanium Units`;
    if (receiptDuration) receiptDuration.textContent = `${state.duration} Hours Service`;
    if (receiptSommeliers) receiptSommeliers.textContent = `${crewCount} Certified Tenders`;
    if (receiptTier) receiptTier.textContent = tier.name;

    // Pre-populate modal fields if present
    const modalPackageInput = document.getElementById('modalPackageSummary');
    if (modalPackageInput) {
      modalPackageInput.value = `${state.eventType} | ${state.guests} Guests | ${state.stations} Pipes | ${tier.name} (~₹${total.toLocaleString('en-IN')})`;
    }
  }

  // Event Type Buttons
  eventTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      eventTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.eventType = btn.dataset.type || btn.textContent.trim();
      recalculate();
    });
  });

  // Slider Listeners
  guestSlider.addEventListener('input', (e) => {
    state.guests = parseInt(e.target.value, 10);
    const recommendedStations = Math.min(14, Math.max(2, Math.ceil(state.guests / 12)));
    if (stationsSlider && Math.abs(parseInt(stationsSlider.value, 10) - recommendedStations) > 2) {
      stationsSlider.value = recommendedStations;
      state.stations = recommendedStations;
    }
    recalculate();
  });

  if (durationSlider) {
    durationSlider.addEventListener('input', (e) => {
      state.duration = parseInt(e.target.value, 10);
      recalculate();
    });
  }

  if (stationsSlider) {
    stationsSlider.addEventListener('input', (e) => {
      state.stations = parseInt(e.target.value, 10);
      recalculate();
    });
  }

  if (tierSelect) {
    tierSelect.addEventListener('change', (e) => {
      state.mixologyTier = e.target.value;
      recalculate();
    });
  }

  recalculate();
}
