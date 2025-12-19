// ===== IISER PYQ 2025 - QUESTION BANK =====

// Question Bank for 2025
const questionBank = {
    Biology: [
        {
            id: 1,
            text: "Which one of the following best describes peptones?",
            options: [
                "Activated form of pepsin",
                "An intestinal mixture of proteins, mucous and HCO₃⁻",
                "Partially digested proteins",
                "Zymogen form of pepsin"
            ],
            correct: 2
        },
        {
            id: 2,
            text: "Which one of the following is an example of genetic diversity?",
            options: [
                "The greater diversity of plant species found in India compared to Central Asia.",
                "Higher diversity of amphibians in the Western Ghats than in the Eastern Ghats.",
                "Greater variation of ecosystems found in India than in Scandinavia.",
                "Variation in the potency and concentration of reserpine produced by Rauwolfia vomitoria."
            ],
            correct: 3
        },
        {
            id: 3,
            text: "The primary function of mitochondria in eukaryotic cells is:",
            options: [
                "Protein synthesis",
                "ATP production through cellular respiration",
                "DNA replication",
                "Lipid synthesis"
            ],
            correct: 1
        },
        {
            id: 4,
            text: "Which of the following is NOT a characteristic of enzymes?",
            options: [
                "They are biological catalysts",
                "They are consumed in the reaction",
                "They lower the activation energy",
                "They are specific to substrates"
            ],
            correct: 1
        },
        {
            id: 5,
            text: "The process of transcription in prokaryotes occurs in:",
            options: [
                "Nucleus",
                "Cytoplasm",
                "Mitochondria",
                "Ribosome"
            ],
            correct: 1
        },
        // Add more biology questions (total 15)
        ...Array(10).fill(null).map((_, i) => ({
            id: i + 6,
            text: `Biology Question ${i + 6}: Sample question about biological concepts, processes, and principles.`,
            options: [
                "Option A - First possible answer",
                "Option B - Second possible answer",
                "Option C - Third possible answer",
                "Option D - Fourth possible answer"
            ],
            correct: Math.floor(Math.random() * 4)
        }))
    ],
    
    Chemistry: [
        {
            id: 1,
            text: "Which of the following has the highest electronegativity?",
            options: [
                "Fluorine",
                "Chlorine",
                "Oxygen",
                "Nitrogen"
            ],
            correct: 0
        },
        {
            id: 2,
            text: "The oxidation state of sulfur in H₂SO₄ is:",
            options: [
                "+4",
                "+6",
                "-2",
                "+2"
            ],
            correct: 1
        },
        {
            id: 3,
            text: "Which type of bond is present in diamond?",
            options: [
                "Ionic bond",
                "Metallic bond",
                "Covalent bond",
                "Hydrogen bond"
            ],
            correct: 2
        },
        {
            id: 4,
            text: "The pH of a neutral solution at 25°C is:",
            options: [
                "0",
                "7",
                "14",
                "1"
            ],
            correct: 1
        },
        {
            id: 5,
            text: "Which of the following is an example of a Lewis acid?",
            options: [
                "NH₃",
                "H₂O",
                "BF₃",
                "OH⁻"
            ],
            correct: 2
        },
        // Add more chemistry questions (total 15)
        ...Array(10).fill(null).map((_, i) => ({
            id: i + 6,
            text: `Chemistry Question ${i + 6}: Sample question about chemical reactions, compounds, and principles.`,
            options: [
                "Option A - First possible answer",
                "Option B - Second possible answer",
                "Option C - Third possible answer",
                "Option D - Fourth possible answer"
            ],
            correct: Math.floor(Math.random() * 4)
        }))
    ],
    
    Mathematics: [
        {
            id: 1,
            text: "Let p(x) = x² + bx + c be a quadratic polynomial with real coefficients b and c. Suppose p(1) = 5 and p(-1) = 3. What is the product of the roots of p(x) = 0?",
            options: ["1", "-1", "2", "0"],
            correct: 0
        },
        {
            id: 2,
            text: "If sin θ + cos θ = √2, then sin θ × cos θ is equal to:",
            options: [
                "1/2",
                "1",
                "√2/2",
                "0"
            ],
            correct: 0
        },
        {
            id: 3,
            text: "The derivative of x³ + 3x² - 5x + 7 with respect to x is:",
            options: [
                "3x² + 6x - 5",
                "x² + 6x - 5",
                "3x² + 3x - 5",
                "3x² + 6x + 5"
            ],
            correct: 0
        },
        {
            id: 4,
            text: "The value of ∫₀¹ x² dx is:",
            options: [
                "1/3",
                "1/2",
                "1",
                "2/3"
            ],
            correct: 0
        },
        {
            id: 5,
            text: "If log₁₀ 2 = 0.3010, then log₁₀ 8 is:",
            options: [
                "0.9030",
                "0.6020",
                "0.3010",
                "1.2040"
            ],
            correct: 0
        },
        // Add more mathematics questions (total 15)
        ...Array(10).fill(null).map((_, i) => ({
            id: i + 6,
            text: `Mathematics Question ${i + 6}: Sample question involving calculus, algebra, trigonometry, or geometry.`,
            options: [
                "Option A - First possible answer",
                "Option B - Second possible answer",
                "Option C - Third possible answer",
                "Option D - Fourth possible answer"
            ],
            correct: Math.floor(Math.random() * 4)
        }))
    ],
    
    Physics: [
        {
            id: 1,
            text: "The SI unit of electric charge is:",
            options: [
                "Ampere",
                "Coulomb",
                "Volt",
                "Ohm"
            ],
            correct: 1
        },
        {
            id: 2,
            text: "Newton's second law of motion states that F =",
            options: [
                "ma",
                "m/a",
                "a/m",
                "m + a"
            ],
            correct: 0
        },
        {
            id: 3,
            text: "The wavelength of visible light ranges approximately from:",
            options: [
                "400 nm to 700 nm",
                "100 nm to 400 nm",
                "700 nm to 1000 nm",
                "1 nm to 100 nm"
            ],
            correct: 0
        },
        {
            id: 4,
            text: "According to Ohm's law, V = IR where V is:",
            options: [
                "Current",
                "Resistance",
                "Voltage",
                "Power"
            ],
            correct: 2
        },
        {
            id: 5,
            text: "The acceleration due to gravity on Earth's surface is approximately:",
            options: [
                "9.8 m/s²",
                "10.8 m/s²",
                "8.8 m/s²",
                "11.8 m/s²"
            ],
            correct: 0
        },
        // Add more physics questions (total 15)
        ...Array(10).fill(null).map((_, i) => ({
            id: i + 6,
            text: `Physics Question ${i + 6}: Sample question about mechanics, thermodynamics, electromagnetism, or optics.`,
            options: [
                "Option A - First possible answer",
                "Option B - Second possible answer",
                "Option C - Third possible answer",
                "Option D - Fourth possible answer"
            ],
            correct: Math.floor(Math.random() * 4)
        }))
    ]
};

// ===== EXAM SYSTEM JAVASCRIPT (SAME FOR ALL YEARS) =====

// Global State
let examState = {
    candidateName: '',
    selectedLanguage: 'English',
    currentSection: 'Biology',
    currentQuestionIndex: 0,
    answers: {},
    markedForReview: {},
    visited: {},
    timeRemaining: 180 * 60, // 180 minutes
    timerInterval: null,
    violations: 0
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeInstructionPage();
});

// ===== INSTRUCTION PAGE =====
function initializeInstructionPage() {
    const beginBtn = document.getElementById('beginTestBtn');
    const nameInput = document.getElementById('candidateName');
    const languageSelect = document.getElementById('examLanguage');
    const termsCheckbox = document.getElementById('agreeTerms');

    const validateForm = () => {
        const isValid = nameInput.value.trim() !== '' && 
                       languageSelect.value !== '' && 
                       termsCheckbox.checked;
        beginBtn.disabled = !isValid;
    };

    nameInput.addEventListener('input', validateForm);
    languageSelect.addEventListener('change', validateForm);
    termsCheckbox.addEventListener('change', validateForm);

    beginBtn.addEventListener('click', () => {
        if (nameInput.value.trim() === '') {
            alert('Please enter your name');
            return;
        }
        if (!termsCheckbox.checked) {
            alert('Please agree to the terms and conditions');
            return;
        }

        examState.candidateName = nameInput.value.trim();
        examState.selectedLanguage = languageSelect.value;
        startExam();
    });

    validateForm();
}

function startExam() {
    document.getElementById('instructionPage').style.display = 'none';
    document.getElementById('examInterface').style.display = 'flex';
    document.getElementById('userName').textContent = examState.candidateName;
    
    initializeExamInterface();
    startTimer();
    loadQuestion();
    setupEventListeners();
    markQuestionAsVisited();
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// ===== EXAM INTERFACE =====
function initializeExamInterface() {
    updateSectionTabs();
    updateQuestionPalette();
    updateStatusLegend();
}

function setupEventListeners() {
    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            switchSection(section);
        });
    });

    document.getElementById('saveNextBtn').addEventListener('click', saveAndNext);
    document.getElementById('markReviewBtn').addEventListener('click', markForReviewAndNext);
    document.getElementById('clearBtn').addEventListener('click', clearResponse);
    document.getElementById('submitExamBtn').addEventListener('click', showSubmitConfirmation);
    document.getElementById('cancelSubmitBtn').addEventListener('click', closeSubmitModal);
    document.getElementById('confirmSubmitBtn').addEventListener('click', showFinalReview);
    document.getElementById('backToExamBtn').addEventListener('click', closeReviewModal);
    document.getElementById('finalSubmitBtn').addEventListener('click', submitExam);
    document.getElementById('statusLegendBtn').addEventListener('click', toggleStatusDropdown);
    document.getElementById('testNameBtn').addEventListener('click', toggleStatusDropdown);
    
    addCalculatorButton();
}

function addCalculatorButton() {
    const headerRight = document.querySelector('.header-right');
    const calcBtn = document.createElement('button');
    calcBtn.className = 'instructions-btn';
    calcBtn.innerHTML = '🧮 Calculator';
    calcBtn.style.marginRight = '1rem';
    calcBtn.addEventListener('click', openCalculator);
    headerRight.insertBefore(calcBtn, headerRight.firstChild);
}

// ===== TIMER =====
function startTimer() {
    examState.timerInterval = setInterval(() => {
        examState.timeRemaining--;
        updateTimerDisplay();
        
        if (examState.timeRemaining <= 0) {
            autoSubmitExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(examState.timeRemaining / 3600);
    const minutes = Math.floor((examState.timeRemaining % 3600) / 60);
    const seconds = examState.timeRemaining % 60;
    
    const timeString = `Time Left : ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = timeString;
    
    if (examState.timeRemaining <= 300) {
        document.getElementById('timerDisplay').style.background = '#f56565';
    } else if (examState.timeRemaining <= 600) {
        document.getElementById('timerDisplay').style.background = '#ed8936';
    }
}

// ===== QUESTION MANAGEMENT =====
function loadQuestion() {
    const question = getCurrentQuestion();
    const questionKey = getQuestionKey();
    
    document.getElementById('questionNumberDisplay').textContent = `Question No. ${examState.currentQuestionIndex + 1}`;
    document.getElementById('sectionTitle').textContent = examState.currentSection;
    document.getElementById('questionContent').innerHTML = `<p class="question-text">${question.text}</p>`;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        
        const isSelected = examState.answers[questionKey] === index;
        if (isSelected) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <input type="radio" name="question-option" value="${index}" ${isSelected ? 'checked' : ''}>
            <span class="option-text">${option}</span>
        `;
        
        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    updateQuestionPalette();
    updateStatusLegend();
}

function getCurrentQuestion() {
    return questionBank[examState.currentSection][examState.currentQuestionIndex];
}

function getQuestionKey() {
    return `${examState.currentSection}-${examState.currentQuestionIndex}`;
}

function selectOption(optionIndex) {
    const questionKey = getQuestionKey();
    examState.answers[questionKey] = optionIndex;
    loadQuestion();
}

function markQuestionAsVisited() {
    const questionKey = getQuestionKey();
    examState.visited[questionKey] = true;
}

// ===== NAVIGATION =====
function saveAndNext() {
    moveToNextQuestion();
}

function markForReviewAndNext() {
    const questionKey = getQuestionKey();
    examState.markedForReview[questionKey] = !examState.markedForReview[questionKey];
    moveToNextQuestion();
}

function clearResponse() {
    const questionKey = getQuestionKey();
    delete examState.answers[questionKey];
    loadQuestion();
}

function moveToNextQuestion() {
    const totalQuestions = questionBank[examState.currentSection].length;
    
    if (examState.currentQuestionIndex < totalQuestions - 1) {
        examState.currentQuestionIndex++;
    } else {
        const sections = ['Biology', 'Chemistry', 'Mathematics', 'Physics'];
        const currentSectionIndex = sections.indexOf(examState.currentSection);
        
        if (currentSectionIndex < sections.length - 1) {
            examState.currentSection = sections[currentSectionIndex + 1];
            examState.currentQuestionIndex = 0;
            updateSectionTabs();
        }
    }
    
    markQuestionAsVisited();
    loadQuestion();
}

function switchSection(section) {
    examState.currentSection = section;
    examState.currentQuestionIndex = 0;
    updateSectionTabs();
    markQuestionAsVisited();
    loadQuestion();
}

function jumpToQuestion(section, index) {
    examState.currentSection = section;
    examState.currentQuestionIndex = index;
    updateSectionTabs();
    markQuestionAsVisited();
    loadQuestion();
}

// ===== UI UPDATES =====
function updateSectionTabs() {
    document.querySelectorAll('.section-tab').forEach(tab => {
        const section = tab.dataset.section;
        if (section === examState.currentSection) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
        
        const count = tab.querySelector('.section-count');
        if (count) {
            if (section === examState.currentSection) {
                count.textContent = examState.currentQuestionIndex + 1;
            } else {
                count.textContent = '1';
            }
        }
    });
}

function updateQuestionPalette() {
    const palette = document.getElementById('questionPalette');
    palette.innerHTML = '';
    
    const questions = questionBank[examState.currentSection];
    
    questions.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = 'palette-btn';
        btn.textContent = index + 1;
        
        const key = `${examState.currentSection}-${index}`;
        
        if (index === examState.currentQuestionIndex) {
            btn.classList.add('current');
        }
        
        if (examState.answers[key] !== undefined && examState.markedForReview[key]) {
            btn.classList.add('answered-marked');
        } else if (examState.answers[key] !== undefined) {
            btn.classList.add('answered');
        } else if (examState.markedForReview[key]) {
            btn.classList.add('marked');
        } else if (examState.visited[key]) {
            btn.classList.add('not-answered');
        } else {
            btn.classList.add('not-visited');
        }
        
        btn.addEventListener('click', () => jumpToQuestion(examState.currentSection, index));
        palette.appendChild(btn);
    });
}

function updateStatusLegend() {
    const stats = calculateStats();
    
    const legendCircles = document.querySelectorAll('.legend-circle');
    legendCircles[0].textContent = stats.answered;
    legendCircles[1].textContent = stats.notAnswered;
    legendCircles[2].textContent = stats.notVisited;
    legendCircles[3].textContent = stats.marked;
    legendCircles[4].textContent = stats.answeredMarked;
    
    const dropdownBadges = document.querySelectorAll('.status-badge');
    if (dropdownBadges.length > 0) {
        dropdownBadges[0].textContent = stats.answered;
        dropdownBadges[1].textContent = stats.notAnswered;
        dropdownBadges[2].textContent = stats.notVisited;
        dropdownBadges[3].textContent = stats.marked;
        dropdownBadges[4].textContent = stats.answeredMarked;
    }
}

function calculateStats() {
    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let marked = 0;
    let answeredMarked = 0;
    
    const allSections = ['Biology', 'Chemistry', 'Mathematics', 'Physics'];
    
    allSections.forEach(section => {
        const questions = questionBank[section];
        questions.forEach((_, index) => {
            const key = `${section}-${index}`;
            
            if (examState.answers[key] !== undefined && examState.markedForReview[key]) {
                answeredMarked++;
            } else if (examState.answers[key] !== undefined) {
                answered++;
            } else if (examState.markedForReview[key]) {
                marked++;
            } else if (examState.visited[key]) {
                notAnswered++;
            } else {
                notVisited++;
            }
        });
    });
    
    return { answered, notAnswered, notVisited, marked, answeredMarked };
}

function toggleStatusDropdown() {
    const dropdown = document.getElementById('statusDropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
        updateStatusLegend();
    } else {
        dropdown.style.display = 'none';
    }
}

// ===== CALCULATOR =====
let calcState = {
    display: '0',
    memory: 0,
    isDegree: true,
    lastResult: 0
};

function openCalculator() {
    document.getElementById('calculatorModal').classList.add('active');
    setupCalculator();
}

function setupCalculator() {
    document.getElementById('closeCalcBtn').addEventListener('click', closeCalculator);
    document.getElementById('minimizeCalcBtn').addEventListener('click', closeCalculator);
    
    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            handleCalculatorInput(action);
        });
    });
}

function closeCalculator() {
    document.getElementById('calculatorModal').classList.remove('active');
}

function handleCalculatorInput(action) {
    const display = document.getElementById('calcDisplay');
    
    if (!action) return;
    
    if (!isNaN(action) || action === '.') {
        if (calcState.display === '0' || calcState.display === 'Error') {
            calcState.display = action;
        } else {
            calcState.display += action;
        }
    }
    else if (['+', '-', '*', '/', '(', ')'].includes(action)) {
        if (calcState.display === '0') {
            calcState.display = action;
        } else {
            calcState.display += action;
        }
    }
    else if (action === 'clear') {
        calcState.display = '0';
    }
    else if (action === 'backspace') {
        calcState.display = calcState.display.slice(0, -1) || '0';
    }
    else if (action === '=') {
        try {
            let expression = calcState.display.replace(/×/g, '*').replace(/÷/g, '/');
            calcState.display = eval(expression).toString();
            calcState.lastResult = parseFloat(calcState.display);
        } catch {
            calcState.display = 'Error';
        }
    }
    else if (action === 'sin' || action === 'cos' || action === 'tan') {
        try {
            let value = parseFloat(calcState.display);
            if (calcState.isDegree) {
                value = value * Math.PI / 180;
            }
            if (action === 'sin') calcState.display = Math.sin(value).toString();
            if (action === 'cos') calcState.display = Math.cos(value).toString();
            if (action === 'tan') calcState.display = Math.tan(value).toString();
        } catch {
            calcState.display = 'Error';
        }
    }
    else if (action === 'sqrt') {
        try {
            calcState.display = Math.sqrt(parseFloat(calcState.display)).toString();
        } catch {
            calcState.display = 'Error';
        }
    }
    else if (action === 'x^2') {
        try {
            const val = parseFloat(calcState.display);
            calcState.display = (val * val).toString();
        } catch {
            calcState.display = 'Error';
        }
    }
    else if (action === 'x^3') {
        try {
            const val = parseFloat(calcState.display);
            calcState.display = (val * val * val).toString();
        } catch {
            calcState.display = 'Error';
        }
    }
    else if (action === 'pi') {
        calcState.display = Math.PI.toString();
    }
    else if (action === 'e') {
        calcState.display = Math.E.toString();
    }
    else if (action === 'log') {
        try {
            calcState.display = Math.log10(parseFloat(calcState.display)).toString();
        } catch {
            calcState.display = 'Error';
        }
    }
    else if (action === 'ln') {
        try {
            calcState.display = Math.log(parseFloat(calcState.display)).toString();
        } catch {
            calcState.display = 'Error';
        }
    }
    else if (action === 'deg') {
        calcState.isDegree = true;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-action="deg"]').classList.add('active');
    }
    else if (action === 'rad') {
        calcState.isDegree = false;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-action="rad"]').classList.add('active');
    }
    
    display.value = calcState.display;
}

// ===== SUBMISSION =====
function showSubmitConfirmation() {
    const stats = calculateStats();
    const totalQuestions = 60;
    const attempted = stats.answered + stats.answeredMarked;
    
    const summaryHtml = `
        <div class="summary-item">
            <span class="summary-label">Total Questions:</span>
            <span class="summary-value">${totalQuestions}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Answered:</span>
            <span class="summary-value">${stats.answered}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Not Answered:</span>
            <span class="summary-value">${stats.notAnswered}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Marked for Review:</span>
            <span class="summary-value">${stats.marked}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Not Visited:</span>
            <span class="summary-value">${stats.notVisited}</span>
        </div>
    `;
    
    document.getElementById('submissionSummary').innerHTML = summaryHtml;
    document.getElementById('submitModal').classList.add('active');
}

function closeSubmitModal() {
    document.getElementById('submitModal').classList.remove('active');
}

function showFinalReview() {
    closeSubmitModal();
    
    const sections = ['Biology', 'Chemistry', 'Mathematics', 'Physics'];
    let reviewHtml = '';
    
    sections.forEach(section => {
        let sectionAnswered = 0;
        let sectionNotAnswered = 0;
        let sectionMarked = 0;
        
        questionBank[section].forEach((_, index) => {
            const key = `${section}-${index}`;
            if (examState.answers[key] !== undefined) {
                sectionAnswered++;
            } else if (examState.visited[key]) {
                sectionNotAnswered++;
            }
            if (examState.markedForReview[key]) {
                sectionMarked++;
            }
        });
        
        reviewHtml += `
            <div class="section-review">
                <div class="section-review-title">${section}</div>
                <div class="review-stats">
                    <div class="stat-item">
                        <span>Answered:</span>
                        <span>${sectionAnswered}</span>
                    </div>
                    <div class="stat-item">
                        <span>Not Answered:</span>
                        <span>${sectionNotAnswered}</span>
                    </div>
                    <div class="stat-item">
                        <span>Marked:</span>
                        <span>${sectionMarked}</span>
                    </div>
                    <div class="stat-item">
                        <span>Total:</span>
                        <span>15</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('reviewSummary').innerHTML = reviewHtml;
    document.getElementById('reviewModal').classList.add('active');
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('active');
}

function submitExam() {
    clearInterval(examState.timerInterval);
    const results = calculateResults();
    displayResults(results);
}

function autoSubmitExam() {
    clearInterval(examState.timerInterval);
    alert('Time is up! Your exam will be submitted automatically.');
    submitExam();
}

function calculateResults() {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    
    const allSections = ['Biology', 'Chemistry', 'Mathematics', 'Physics'];
    
    allSections.forEach(section => {
        questionBank[section].forEach((question, index) => {
            const key = `${section}-${index}`;
            const answer = examState.answers[key];
            
            if (answer === undefined) {
                unattempted++;
            } else if (answer === question.correct) {
                correct++;
            } else {
                incorrect++;
            }
        });
    });
    
    const totalMarks = (correct * 4) - (incorrect * 1);
    
    return { correct, incorrect, unattempted, totalMarks };
}

function displayResults(results) {
    document.getElementById('examInterface').innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="background: white; padding: 3rem; border-radius: 16px; max-width: 600px; text-