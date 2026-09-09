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
      standard: { name: 'Classic Fresh Blends', pipeRate: 2800, headRate: 600 },
      reserve: { name: 'Reserve Fruit & Mint Blends (Jatin’s Signature)', pipeRate: 3800, headRate: 950 },
      imperial: { name: 'VIP Exotic Selection (Imported & Fresh Fruit)', pipeRate: 5500, headRate: 1500 }
    }
  };

  function calculateCrew(stations) {
    // 1 Dedicated Hookah Master per 2-3 hookahs
    return Math.max(1, Math.ceil(stations / 2));
  }

  function recalculate() {
    const tier = state.tierMultipliers[state.mixologyTier] || state.tierMultipliers.reserve;
    const crewCount = calculateCrew(state.stations);

    // Pricing in INR: Hookahs + Dedicated Staff + Flavor & Natural Coal refills + Transport
    const hardwareBase = state.stations * tier.pipeRate;
    const crewRate = crewCount * state.duration * 1200;
    const consumableHeads = Math.ceil(state.guests / 4) * tier.headRate;
    const logisticsBase = 3500; // Delhi NCR delivery, setup & natural coal heating equipment

    const total = hardwareBase + crewRate + consumableHeads + logisticsBase;

    // Update Slider UI labels
    if (valGuests) valGuests.textContent = `${state.guests} Guests`;
    if (valDuration) valDuration.textContent = `${state.duration} Hours`;
    if (valStations) valStations.textContent = `${state.stations} Hookahs`;

    // Update Live Receipt UI in Indian Rupees
    receiptTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (receiptGuests) receiptGuests.textContent = `${state.guests} Guests`;
    if (receiptStations) receiptStations.textContent = `${state.stations} Hookahs`;
    if (receiptDuration) receiptDuration.textContent = `${state.duration} Hours Service`;
    if (receiptSommeliers) receiptSommeliers.textContent = `${crewCount} Dedicated Staff`;
    if (receiptTier) receiptTier.textContent = tier.name;

    // Dynamically update WhatsApp CTA with configured details
    const estimatorWhatsAppBtn = document.getElementById('estimatorWhatsAppBtn') || document.querySelector('.estimator-summary-card .whatsapp-cta');
    if (estimatorWhatsAppBtn) {
      const encodedMsg = encodeURIComponent(
        `Hi Jatin, I want to book Cloudhouse Hookah Catering for my ${state.eventType} with ${state.guests} guests, ${state.stations} hookahs, ${state.duration} hours of service, and ${tier.name}. Estimated quote is ₹${total.toLocaleString('en-IN')}. Please confirm availability.`
      );
      estimatorWhatsAppBtn.href = `https://wa.me/919625748696?text=${encodedMsg}`;
    }

    // Pre-populate modal fields if present
    const modalPackageInput = document.getElementById('modalPackageSummary');
    if (modalPackageInput) {
      modalPackageInput.value = `${state.eventType} | ${state.guests} Guests | ${state.stations} Hookahs | ${tier.name} (~₹${total.toLocaleString('en-IN')})`;
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
