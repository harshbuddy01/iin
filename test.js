// exam.js - PW Online Exam System

// Question Bank Database
const QUESTION_BANK = {
  Physics: [
    { id: 'P1', text: 'On a circular track, two cyclists start from opposite directions. Abhijit moves with constant speed, Vani starts from rest with constant acceleration. They meet with same speed. Which is correct?', options: ['Abhijit travelled double the distance', 'Abhijit travelled half the distance', 'Both travelled same distance', 'Abhijit travelled 4/3 distance'], correct: 0, marks: 4 },
    { id: 'P2', text: 'A simple pendulum with period T and amplitude θ₀ has angular momentum amplitude A. Which relation is correct?', options: ['A ∝ T³', 'A ∝ T²', 'A ∝ T', 'A ∝ T⁴'], correct: 1, marks: 4 },
    { id: 'P3', text: 'A disc of mass M and radius R has cord passing over it with masses M and M/2. What is angular acceleration?', options: ['g/4R', 'g/2R', 'g/R', 'g/3R'], correct: 1, marks: 4 },
    { id: 'P4', text: 'A bob (density 2× water) on string length L completes semi-circle in water. String slack at top. What is V₀?', options: ['√(5gL/2)', '√(5gL)', '√(2gL)', '√(3gL/2)'], correct: 0, marks: 4 },
    { id: 'P5', text: 'A solid sphere floats half-submerged and executes SHM when pushed. What is time period?', options: ['2π√(2R/3g)', '2π√(R/g)', '2π√(3R/2g)', '2π√(2R/g)'], correct: 0, marks: 4 },
    { id: 'P6', text: 'One mole of ideal gas expands adiabatically from V to 2V doing no work. What is final pressure?', options: ['RT/2V', 'RT/4V', 'RT/V', '2RT/V'], correct: 2, marks: 4 },
    { id: 'P7', text: 'Particle motion: x(t) = sin²(ωt)cos³(ωt). What is time period?', options: ['2π/ω', '2π/3ω', '2π/5ω', '2π/15ω'], correct: 2, marks: 4 },
    { id: 'P8', text: 'Two identical boxes with ideal gas (n₁,λ₁,T₁) and (n₂,λ₂,T₂). One emptied into other. What are λ and T?', options: ['λ=λ₁λ₂/(λ₁+λ₂), T=(n₁T₁+n₂T₂)/(n₁+n₂)', 'λ=(n₁λ₁+n₂λ₂)/(n₁+n₂), T=(n₁T₁+n₂T₂)/(n₁+n₂)', 'λ=(n₁λ₁+n₂λ₂)/(n₁+n₂), T=√(T₁T₂)', 'λ=λ₁λ₂/(λ₁+λ₂), T=√(T₁T₂)'], correct: 1, marks: 4 },
    { id: 'P9', text: 'Charges +q at (-ℓ/2,0) and +2q at (ℓ/2,0). Charge -q (mass m) released from (0,√3ℓ/2). What is acceleration?', options: ['(q²/8πε₀mℓ²)(î-3√3ĵ)', '(q²/8πε₀mℓ²)(î-√3ĵ)', '(q²/8πε₀mℓ²)(3î-√3ĵ)', '(q²/8πε₀mℓ²)(3√3î-ĵ)'], correct: 2, marks: 4 },
    { id: 'P10', text: 'RLC circuit with V=V₀sinωt. Current through resistor A in phase with source. What is ω?', options: ['1/√(2LC)', '1/√(LC)', '1/(2√(LC))', '1/√(3LC)'], correct: 0, marks: 4 },
    { id: 'P11', text: 'Current loop with segments at right angles. What is magnetic moment?', options: ['Iab(ĵ+k̂)', 'Iab(ĵ-k̂)', '√2Iab(ĵ+k̂)', 'Iab(k̂-ĵ)'], correct: 0, marks: 4 },
    { id: 'P12', text: 'Capacitors C1=2μF and C2=8μF. C1 charged then connected to C2. What is Q₂/(Q₁+Q₂)?', options: ['4/5', '1/5', '1/4', '1/2'], correct: 0, marks: 4 },
    { id: 'P13', text: 'Binding energy difference between ¹⁸O and ¹⁶O nuclei in uc² units?', options: ['0.01307', '2.00425', '0.99559', '3.01291'], correct: 0, marks: 4 },
    { id: 'P14', text: 'Two slabs (n=2, n=2/√3) in medium n=√2. Upper slab 1cm. What lower thickness for zero lateral shift?', options: ['1/√3', '1/√2', '1/2', '√3/2'], correct: 3, marks: 4 },
    { id: 'P15', text: 'Light at λ and λ/2 give stopping potentials 1V and 3V. What is work function?', options: ['1 eV', '2 eV', '1.5 eV', '1.25 eV'], correct: 1, marks: 4 }
  ],
  Chemistry: [
    { id: 'C1', text: 'If element with Z=120 is discovered, which group will it belong to?', options: ['Alkaline earth metals', 'Alkali metals', 'Halogens', 'Noble gases'], correct: 3, marks: 4 },
    { id: 'C2', text: 'Which statement is correct about N₂, CO, and NO⁺?', options: ['Isoelectronic with identical bond order', 'Isoelectronic with different bond orders', 'Not isoelectronic but identical bond order', 'Neither isoelectronic nor identical bond order'], correct: 0, marks: 4 },
    { id: 'C3', text: 'Which complexes exhibit magnetic moment close to 2 Bohr Magneton?', options: ['Only K₄[Mn(CN)₆]', 'K₂[MnCl₄] and K₄[Mn(CN)₆]', '[Fe(H₂O)₆](NO₃)₂ and K₂[MnCl₄]', 'K₄[Mn(CN)₆] and [Ni(CO)₄]'], correct: 0, marks: 4 },
    { id: 'C4', text: 'According to VSEPR theory, what are shapes of XeF₄ and SF₄?', options: ['Square planar and see-saw', 'Both see-saw', 'See-saw and square planar', 'Both square planar'], correct: 0, marks: 4 },
    { id: 'C5', text: 'Which complex ion shows violet colour?', options: ['[CoCl(NH₃)₅]²⁺', '[Co(H₂O)(NH₃)₅]³⁺', '[Co(NH₃)₆]³⁺', '[Co(CN)₆]³⁻'], correct: 0, marks: 4 },
    { id: 'C6', text: 'What is the relationship between the depicted structures?', options: ['Conformational isomers', 'Structural isomers', 'Enantiomers', 'Positional isomers'], correct: 2, marks: 4 },
    { id: 'C7', text: 'What is correct order of acidity for given compounds?', options: ['P > N > Q > M', 'P > Q > N > M', 'N > P > M > Q', 'N > P > Q > M'], correct: 3, marks: 4 },
    { id: 'C8', text: 'What are products N and Q in the reaction sequence?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 1, marks: 4 },
    { id: 'C9', text: 'What are X and Z in the reaction sequence?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 2, marks: 4 },
    { id: 'C10', text: 'What are correct structural descriptions for M and N?', options: ['M is α-D-(+)-glucopyranose, N is β-D-(-)-fructofuranose', 'M is β-D-(+)-glucopyranose, N is β-D-(-)-fructofuranose', 'M is α-D-(+)-glucopyranose, N is α-D-(-)-fructofuranose', 'M is α-D-(+)-glucofuranose, N is β-D-(-)-fructopyranose'], correct: 0, marks: 4 },
    { id: 'C11', text: 'For reaction 2A(s)→B(s)+C(g)+D(g), correct statement is:', options: ['Spontaneous at all temperatures', 'Spontaneous only at very high temperatures', 'Spontaneous only at very low temperatures', 'Non-spontaneous at all temperatures'], correct: 1, marks: 4 },
    { id: 'C12', text: 'Work function 500nm. 100W bulb at 300nm. What is total KE of photoelectrons per second?', options: ['40 J', '2.6×10⁻¹⁹ J', '1.6×10⁻¹⁹ J', '80 J'], correct: 0, marks: 4 },
    { id: 'C13', text: 'Reaction R→P with rate constant 3×10⁻³ mol L⁻¹ s⁻¹. Which plot is correct?', options: ['Plot A', 'Plot B', 'Plot C', 'Plot D'], correct: 1, marks: 4 },
    { id: 'C14', text: 'Which plot correctly describes osmotic pressure (π) vs volume (V) at fixed T?', options: ['Plot A', 'Plot B', 'Plot C', 'Plot D'], correct: 2, marks: 4 },
    { id: 'C15', text: 'For KCl solution data, what is limiting molar conductivity?', options: ['150.1 S cm² mol⁻¹', '149.2 S cm² mol⁻¹', '151.1 S cm² mol⁻¹', '152.1 S cm² mol⁻¹'], correct: 0, marks: 4 }
  ],
  Mathematics: [
    { id: 'M1', text: 'Lines L₁: 5x-2y=1, L₂ through (0,1) and (100,101), L₃ through (1,11) parallel to -î+2ĵ. Total elements in A?', options: ['3', '0', '1', '2'], correct: 3, marks: 4 },
    { id: 'M2', text: 'Set A: points equidistant from P(-1,0) and Q(1,0). Set B: points equidistant from A and Q. If (5,y)∈B, what is y²?', options: ['9', '1', '4', '16'], correct: 3, marks: 4 },
    { id: 'M3', text: 'Lines L₁ and L₂. If (2,3,4) on L₁ is closest to L₂, which point on L₂ is closest?', options: ['(3,4,3)', '(3,4,4)', '(5,4,5)', '(4,4,4)'], correct: 0, marks: 4 },
    { id: 'M4', text: 'Sequence a₁,a₂,a₃,... with sₙ=a₁+a₂+...+aₙ. If 2sₙ=n(c+aₙ), which statement is correct?', options: ['a₁,a₂,a₃,... is AP', 'a₁,2a₂,3a₃,... is AP', 'a₁,a₂,a₃,... is GP', 'a₁,2a₂,3a₃,... is GP'], correct: 0, marks: 4 },
    { id: 'M5', text: 'f:ℝ→ℝ strictly decreasing with |f(t)|<π/2. g(t)=sin(f(t)). Which is correct?', options: ['g decreasing on [0,π]', 'g increasing on [0,π]', 'g increasing on (0,π/2), decreasing on (π/2,π)', 'g decreasing on (0,π/2), increasing on (π/2,π)'], correct: 1, marks: 4 },
    { id: 'M6', text: 'f,g:ℝ→ℝ. If g continuous, which case implies f is continuous?', options: ['g(x)=(f(x))³', 'g(x)=|f(x)|', 'g(x)=(f(x))²', 'g(x)=sin(f(x))'], correct: 0, marks: 4 },
    { id: 'M7', text: 'Largest area of rectangle under y=1-x² and above x-axis?', options: ['4/(3√3)', '2/(3√3)', '4/3', '1/3'], correct: 0, marks: 4 },
    { id: 'M8', text: 'R={(A,B)∈M×M: det(A-B) is integer} on 3×3 matrices. Which is correct?', options: ['Reflexive and symmetric, not transitive', 'Reflexive, not symmetric/transitive', 'Equivalence relation', 'Symmetric and transitive, not reflexive'], correct: 2, marks: 4 },
    { id: 'M9', text: 'Value of ²³C₀+²³C₂+²³C₄+...+²³C₂₂?', options: ['2²²', '2²²-1', '2²³+1', '2²³'], correct: 0, marks: 4 },
    { id: 'M10', text: 'f:ℚ→ℚ with f(x+y)=f(x)+f(y) and f(1)=10. Which is correct?', options: ['f is bijective', 'f is injective but not surjective', 'f is surjective but not injective', 'f is neither injective nor surjective'], correct: 0, marks: 4 },
    { id: 'M11', text: 'Integral from e⁻π/² to eπ/² of [sin²(log x)+sin(log x²)]dx. Value of I?', options: ['eπ/²-e⁻π/²', '0', 'πeπ/²/2', 'eπ-1'], correct: 1, marks: 4 },
    { id: 'M12', text: 'S={(|z-iz|, |z|²): z complex}. Which is correct?', options: ['S is a parabola', 'S is a circle', 'S is an ellipse but not circle', 'S is a hyperbola'], correct: 0, marks: 4 },
    { id: 'M13', text: 'Ship with 3 engines. Needs ≥2 working. P(A breaks)=1/4, P(B breaks)=1/4, P(C breaks)=1/2. P(completes)?', options: ['3/4', '1/2', '1/32', '1/4'], correct: 1, marks: 4 },
    { id: 'M14', text: 'cos(y)dy/dx + (1/x)sin(y)=x, y=π/2 at x=√3. Value of y at x=√(3/2)?', options: ['π/6', 'π/3', 'π/2', 'π/4'], correct: 0, marks: 4 },
    { id: 'M15', text: '∠BAQ=∠CPQ=∠CBQ=π/2, QA=3, AB=4, BC=1. Length of PQ?', options: ['2.2', '2', '√2', '3-√2'], correct: 1, marks: 4 }
  ],
  Biology: [
    { id: 'B1', text: 'What will be the sequence of RNA synthesized using the DNA template strand 5-GTCTAGGCTTCTC-3?', options: ['5-GAGAAGCCUAGAC-3', '5-GUCUAGGCUUCUC-3', '5-CAGAUCCGAAGAG-3', '5-CUCUUCGGAUCUG-3'], correct: 0, marks: 4 },
    { id: 'B2', text: 'Most likely pattern of inheritance of a rare genetic disorder?', options: ['X-linked dominant', 'X-linked recessive', 'Autosomal recessive', 'Autosomal dominant'], correct: 2, marks: 4 },
    { id: 'B3', text: 'Which protein plays a direct role in muscle contraction?', options: ['Troponin', 'Insulin', 'Myoglobin', 'Trypsin'], correct: 0, marks: 4 },
    { id: 'B4', text: 'Which is NOT derived from epidermal cell layer in plants?', options: ['Casparian strip from rice root', 'Trichomes from maize leaf', 'Subsidiary cells from rice leaf', 'Bulliform cells from grass'], correct: 0, marks: 4 },
    { id: 'B5', text: 'Which statement about meiosis is INCORRECT?', options: ['End products of meiosis II are haploid gametes', 'Four products are genetically different', 'Recombination in both males and females', 'Only one product survives in females'], correct: 0, marks: 4 },
    { id: 'B6', text: 'Test routinely performed to detect typhoid?', options: ['Widal test', 'ELISA', 'Gel electrophoresis', 'RT-PCR'], correct: 0, marks: 4 },
    { id: 'B7', text: 'After 30 PCR cycles, 1 billion copies produced. Copies at 20th cycle?', options: ['1 million', '0.66 billion', '10 million', '0.1 billion'], correct: 0, marks: 4 },
    { id: 'B8', text: 'Population N=400, K=500, r=0.01. What is dN/dt?', options: ['0.8', '0.05', '1', '0.4'], correct: 0, marks: 4 },
    { id: 'B9', text: 'Correct statement about Hemichordata?', options: ['Not chordate, has stomochord', 'Chordate sub-phylum with stomochord', 'Chordate sub-phylum with notochord', 'Not chordate due to water vascular system'], correct: 0, marks: 4 },
    { id: 'B10', text: 'Correct about oxygen dissociation curves?', options: ['Curve A: favorable at low H+', 'Curve C: favorable at low pCO2', 'Curve A: favorable at low pH', 'Curve C: favorable at high pO2'], correct: 0, marks: 4 },
    { id: 'B11', text: 'Match enzymes with cellular compartments correctly.', options: ['P-(ii); Q-(iii); R-(i); S-(iv)', 'P-(iv); Q-(i); R-(iii); S-(ii)', 'P-(iii); Q-(ii); R-(i); S-(v)', 'P-(iii); Q-(i); R-(iv); S-(ii)'], correct: 0, marks: 4 },
    { id: 'B12', text: 'Two species P (2n=20) and Q (2n=30) crossed. Which seed tissue has same chromosome numbers?', options: ['Embryo', 'Endosperm', 'Embryo and seed coat', 'Embryo and endosperm'], correct: 0, marks: 4 },
    { id: 'B13', text: 'Which plasmid vector for cloning with BamHI, EcoRI, and ampicillin selection?', options: ['Vector A', 'Vector B', 'Vector C', 'Vector D'], correct: 1, marks: 4 },
    { id: 'B14', text: 'Match conditions with affected physiological processes correctly.', options: ['P-(ii); Q-(iv); R-(iii); S-(i)', 'P-(iii); Q-(iv); R-(i); S-(ii)', 'P-(iv); Q-(iii); R-(i); S-(ii)', 'P-(ii); Q-(i); R-(iv); S-(iii)'], correct: 1, marks: 4 },
    { id: 'B15', text: 'Which graph represents correct relationship between light intensity and photosynthesis rate?', options: ['Graph A', 'Graph B', 'Graph C', 'Graph D'], correct: 2, marks: 4 }
  ]
};

// Global State
let currentSection = 'Physics';
let currentQuestionIndex = 0;
let answers = {};
let markedForReview = {};
let visited = {};
let violations = 0;
let timeLeft = 7200; // 2 hours in seconds
let timerInterval = null;
let syncInterval = null;
let lastSyncTime = Date.now();

// Initialize
function init() {
  generateStudentID();
  setupEventListeners();
  generateRulerMarks();
}

// Generate Random Student ID
function generateStudentID() {
  const id = 'PW2024-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  document.getElementById('studentId').textContent = 'Student ID: ' + id;
}

// Start Exam
function startExam() {
  document.getElementById('instructionsScreen').style.display = 'none';
  document.getElementById('examScreen').style.display = 'block';
  
  loadQuestion();
  updatePalette();
  startTimer();
  startSecurityMonitoring();
  
  console.log('Exam started at:', new Date().toISOString());
}

// Timer Functions
function startTimer() {
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      autoSubmitExam();
    }
  }, 1000);
  
  // Server time sync every 30 seconds
  syncInterval = setInterval(() => {
    const currentTime = Date.now();
    const expectedTime = lastSyncTime + 30000;
    const drift = Math.abs(currentTime - expectedTime);
    
    if (drift > 5000) {
      alert('⚠️ Time sync error detected. Test will be auto-submitted for security.');
      autoSubmitExam();
    }
    
    lastSyncTime = currentTime;
    console.log('Time sync check:', new Date().toISOString());
  }, 30000);
}

function updateTimerDisplay() {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  
  const display = 
    hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');
  
  document.getElementById('timerDisplay').textContent = display;
}

// Security Monitoring
function startSecurityMonitoring() {
  // Tab switch detection
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // DevTools detection
  document.addEventListener('keydown', handleKeyPress);
  
  // Right-click disable
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

function handleVisibilityChange() {
  if (document.hidden) {
    violations++;
    updateViolationsDisplay();
    alert(`⚠️ WARNING: Tab switching detected!\nViolation #${violations}\nYour test may be invalidated if you continue.`);
    
    if (violations >= 3) {
      alert('❌ Multiple violations detected. Test will be auto-submitted.');
      autoSubmitExam();
    }
  }
}

function handleKeyPress(e) {
  // Detect F12 or Ctrl+Shift+I
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
    e.preventDefault();
    violations++;
    updateViolationsDisplay();
    alert(`⚠️ Developer tools detected! Violation #${violations}`);
  }
}

function updateViolationsDisplay() {
  const box = document.getElementById('violationsBox');
  const count = document.getElementById('violationsCount');
  
  if (violations > 0) {
    box.classList.remove('hidden');
    count.textContent = `Violations: ${violations}`;
  }
}

// Question Navigation
function loadQuestion() {
  const questions = QUESTION_BANK[currentSection];
  const question = questions[currentQuestionIndex];
  const questionKey = `${currentSection}-${currentQuestionIndex}`;
  
  // Mark as visited
  visited[questionKey] = true;
  
  // Update question display
  document.getElementById('questionNumber').textContent = 
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  document.getElementById('questionText').textContent = question.text;
  
  // Update mark for review button
  const markBtn = document.getElementById('markReviewBtn');
  if (markedForReview[questionKey]) {
    markBtn.classList.add('marked');
    markBtn.querySelector('span').textContent = 'Marked for Review';
  } else {
    markBtn.classList.remove('marked');
    markBtn.querySelector('span').textContent = 'Mark for Review';
  }
  
  // Load options
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'option-label';
    if (answers[questionKey] === index) {
      label.classList.add('selected');
    }
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'question';
    input.value = index;
    input.checked = answers[questionKey] === index;
    input.onchange = () => selectAnswer(index);
    
    const optionText = document.createElement('span');
    optionText.innerHTML = `<strong>(${String.fromCharCode(97 + index)})</strong> ${option}`;
    
    label.appendChild(input);
    label.appendChild(optionText);
    container.appendChild(label);
  });
  
  // Update navigation buttons
  document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
  document.getElementById('nextBtn').disabled = currentQuestionIndex === questions.length - 1;
  
  updatePalette();
}

function selectAnswer(optionIndex) {
  const questionKey = `${currentSection}-${currentQuestionIndex}`;
  answers[questionKey] = optionIndex;
  
  // Auto-save (simulate AJAX)
  console.log('Auto-saving answer:', {
    questionKey,
    answer: optionIndex,
    timestamp: new Date().toISOString()
  });
  
  // Update UI
  document.querySelectorAll('.option-label').forEach((label, index) => {
    if (index === optionIndex) {
      label.classList.add('selected');
    } else {
      label.classList.remove('selected');
    }
  });
  
  updatePalette();
}

function navigateQuestion(direction) {
  const questions = QUESTION_BANK[currentSection];
  const newIndex = currentQuestionIndex + direction;
  
  if (newIndex >= 0 && newIndex < questions.length) {
    currentQuestionIndex = newIndex;
    loadQuestion();
  }
}

function toggleMarkForReview() {
  const questionKey = `${currentSection}-${currentQuestionIndex}`;
  markedForReview[questionKey] = !markedForReview[questionKey];
  loadQuestion();
}

// Section Switching
function switchSection(section) {
  currentSection = section;
  currentQuestionIndex = 0;
  
  // Update tab styling
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update palette title
  document.getElementById('paletteTitle').textContent = `${section} - Question Palette`;
  
  loadQuestion();
  updatePalette();
}

// Question Palette
function updatePalette() {
  const grid = document.getElementById('paletteGrid');
  const questions = QUESTION_BANK[currentSection];
  
  grid.innerHTML = '';
  
  questions.forEach((_, index) => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = index + 1;
    btn.onclick = () => jumpToQuestion(index);
    
    const questionKey = `${currentSection}-${index}`;
    
    // Apply status class
    if (markedForReview[questionKey]) {
      btn.classList.add('marked');
    } else if (answers[questionKey] !== undefined) {
      btn.classList.add('answered');
    } else if (visited[questionKey]) {
      btn.classList.add('not-answered');
    } else {
      btn.classList.add('not-visited');
    }
    
    // === Completed exam.js (continuation / final) ===

// (Place this after the existing code you pasted — this block continues and completes the file.)

    // Highlight current
    if (index === currentQuestionIndex) {
      btn.classList.add('current');
    }

    grid.appendChild(btn);
  });
}

// Jump to a specific question from palette
function jumpToQuestion(index) {
  const questions = QUESTION_BANK[currentSection];
  if (index >= 0 && index < questions.length) {
    currentQuestionIndex = index;
    loadQuestion();
  }
}

// Auto-submit and manual submit
function autoSubmitExam() {
  // Stop timers / monitoring
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }

  // Remove critical listeners (to avoid multiple alerts)
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  document.removeEventListener('keydown', handleKeyPress);

  // Lock UI if elements exist
  const examScreen = document.getElementById('examScreen');
  if (examScreen) {
    // disable inputs in exam screen
    examScreen.querySelectorAll('input, button, textarea, select').forEach(el => {
      el.disabled = true;
    });
  }

  // Compute results
  const results = calculateScore();

  // Show results (prefer a dedicated results panel if present, else alert)
  showResults(results);

  // Simulate send to server (console)
  console.log('Auto/Manual submit payload:', {
    studentId: document.getElementById('studentId')?.textContent || null,
    answers,
    markedForReview,
    violations,
    timeLeft,
    score: results.totalScore,
    maxScore: results.maxScore,
    timestamp: new Date().toISOString()
  });
}

function finishExam() {
  // Called when user clicks "Submit" manually
  const confirmSubmit = confirm('Are you sure you want to submit the exam? You will not be able to change answers after submission.');
  if (confirmSubmit) {
    autoSubmitExam();
  }
}

// Score calculation
function calculateScore() {
  let totalScore = 0;
  let maxScore = 0;
  let sectionBreakdown = {};

  Object.keys(QUESTION_BANK).forEach(section => {
    const qArr = QUESTION_BANK[section];
    sectionBreakdown[section] = {
      obtained: 0,
      max: qArr.reduce((s, q) => s + (q.marks || 0), 0),
      attempted: 0,
      correctCount: 0,
      totalQuestions: qArr.length
    };

    qArr.forEach((q, idx) => {
      maxScore += q.marks || 0;
      const key = `${section}-${idx}`;
      const ans = answers[key];

      if (ans !== undefined && ans !== null) {
        sectionBreakdown[section].attempted++;
        if (ans === q.correct) {
          totalScore += q.marks || 0;
          sectionBreakdown[section].obtained += q.marks || 0;
          sectionBreakdown[section].correctCount++;
        }
      }
    });
  });

  return {
    totalScore,
    maxScore,
    sectionBreakdown
  };
}

// Show results UI (if results container exists, populate it; else use an alert)
function showResults(results) {
  const resultsPanel = document.getElementById('resultsPanel');

  if (resultsPanel) {
    // Clear and fill results panel
    resultsPanel.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = 'Exam Results';
    resultsPanel.appendChild(title);

    const scoreLine = document.createElement('p');
    scoreLine.innerHTML = `<strong>Score:</strong> ${results.totalScore} / ${results.maxScore}`;
    resultsPanel.appendChild(scoreLine);

    const violationsLine = document.createElement('p');
    violationsLine.innerHTML = `<strong>Violations:</strong> ${violations}`;
    resultsPanel.appendChild(violationsLine);

    // Section breakdown table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
      <thead>
        <tr>
          <th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Section</th>
          <th style="text-align:right;padding:6px;border-bottom:1px solid #ccc;">Obtained</th>
          <th style="text-align:right;padding:6px;border-bottom:1px solid #ccc;">Max</th>
          <th style="text-align:right;padding:6px;border-bottom:1px solid #ccc;">Attempted</th>
          <th style="text-align:right;padding:6px;border-bottom:1px solid #ccc;">Correct</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    Object.keys(results.sectionBreakdown).forEach(sec => {
      const s = results.sectionBreakdown[sec];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding:6px;border-bottom:1px solid #eee;">${sec}</td>
        <td style="padding:6px;text-align:right;border-bottom:1px solid #eee;">${s.obtained}</td>
        <td style="padding:6px;text-align:right;border-bottom:1px solid #eee;">${s.max}</td>
        <td style="padding:6px;text-align:right;border-bottom:1px solid #eee;">${s.attempted}/${s.totalQuestions}</td>
        <td style="padding:6px;text-align:right;border-bottom:1px solid #eee;">${s.correctCount}</td>
      `;
      tbody.appendChild(tr);
    });

    resultsPanel.appendChild(table);

    // Optionally provide a "Download JSON" button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download Results (JSON)';
    downloadBtn.onclick = () => {
      const payload = {
        studentId: document.getElementById('studentId')?.textContent || null,
        results,
        answers,
        markedForReview,
        violations,
        timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exam_results.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };
    resultsPanel.appendChild(document.createElement('br'));
    resultsPanel.appendChild(downloadBtn);

    // Reveal results panel and hide exam screen if present
    const examScreen = document.getElementById('examScreen');
    if (examScreen) examScreen.style.display = 'none';
    resultsPanel.style.display = 'block';
  } else {
    // fallback
    alert(`Exam submitted.\nScore: ${results.totalScore} / ${results.maxScore}\nViolations: ${violations}`);
  }
}

// Save & restore state to localStorage (helps accidental reload)
function saveState() {
  try {
    const state = {
      currentSection,
      currentQuestionIndex,
      answers,
      markedForReview,
      visited,
      violations,
      timeLeft,
      lastSaved: Date.now()
    };
    localStorage.setItem('pw_exam_state', JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state to localStorage:', e);
  }
}

function restoreState() {
  try {
    const raw = localStorage.getItem('pw_exam_state');
    if (!raw) return;
    const state = JSON.parse(raw);

    // Merge restored state carefully
    if (state.currentSection && QUESTION_BANK[state.currentSection]) currentSection = state.currentSection;
    if (typeof state.currentQuestionIndex === 'number') currentQuestionIndex = state.currentQuestionIndex;
    answers = state.answers || answers;
    markedForReview = state.markedForReview || markedForReview;
    visited = state.visited || visited;
    violations = state.violations || violations;
    if (typeof state.timeLeft === 'number') timeLeft = state.timeLeft;
  } catch (e) {
    console.warn('Could not restore state from localStorage:', e);
  }
}

// Periodic auto-save
setInterval(saveState, 10000); // every 10s

// Warn user before unloading if exam in progress
window.addEventListener('beforeunload', (e) => {
  // If exam started and not yet submitted
  if (timerInterval) {
    const confirmationMessage = 'Leaving will submit your exam automatically — are you sure?';
    (e || window.event).returnValue = confirmationMessage; // Gecko + IE
    return confirmationMessage; // Webkit, Safari, Chrome
  }
});

// Accessibility: keyboard navigation for palette (optional)
document.addEventListener('keydown', (e) => {
  if (!timerInterval) return; // only while exam ongoing
  if (e.key === 'ArrowRight') {
    navigateQuestion(1);
  } else if (e.key === 'ArrowLeft') {
    navigateQuestion(-1);
  }
});

// Initialize and restore any saved state
restoreState();
init();

// Expose some functions to global scope for UI buttons (if referenced in HTML)
window.startExam = startExam;
window.finishExam = finishExam;
window.switchSection = switchSection;
window.jumpToQuestion = jumpToQuestion;
window.toggleMarkForReview = toggleMarkForReview;