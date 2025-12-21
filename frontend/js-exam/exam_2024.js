// Fixed exam.js - Matches your HTML structure
'use strict';

// Question Bank (using your existing data)
const questionBank = {
    Biology: [
        { id: 1, text: "What will be the sequence of RNA synthesized using the following DNA template strand? 5'-GTCTAGGCTTCTC-3'", options: ["5'-GUCUAGGCUUCUC-3'", "5'-GAGAAGCCUAGAC-3'", "5'-CAGAUCCGAAGAG-3'", "5'-CUCUUCGGAUCUG-3'"], correct: 0 },
        { id: 2, text: "The pedigree diagram shows the inheritance of a rare genetic disorder. Which is the most likely pattern of inheritance?", options: ["X-linked dominant", "X-linked recessive", "Autosomal recessive", "Autosomal dominant"], correct: 2 },
        { id: 3, text: "Which protein plays a direct role in muscle contraction?", options: ["Troponin", "Insulin", "Myoglobin", "Trypsin"], correct: 0 },
        { id: 4, text: "Which is NOT derived from epidermal cell layer in plants?", options: ["Casparian strip from rice root", "Trichomes from maize leaf", "Subsidiary cells from rice leaf", "Bulliform cells from grass"], correct: 0 },
        { id: 5, text: "Which statement about meiosis is INCORRECT?", options: ["End products of meiosis II are haploid gametes", "Four products are genetically different", "Recombination in both males and females", "Only one product survives in females"], correct: 0 },
        { id: 6, text: "Test routinely performed to detect typhoid?", options: ["Widal test", "ELISA", "Gel electrophoresis", "RT-PCR"], correct: 0 },
        { id: 7, text: "After 30 PCR cycles, 1 billion copies. Copies at 20th cycle?", options: ["1 million", "0.66 billion", "10 million", "0.1 billion"], correct: 0 },
        { id: 8, text: "Population N=400, K=500, r=0.01. What is dN/dt?", options: ["0.8", "0.05", "1", "0.4"], correct: 0 },
        { id: 9, text: "Correct statement about Hemichordata?", options: ["Not chordate, has stomochord", "Chordate with stomochord", "Chordate with notochord", "Not chordate, water vascular"], correct: 0 },
        { id: 10, text: "Match enzymes with compartments.", options: ["P-(ii); Q-(iii); R-(i); S-(iv)", "P-(iv); Q-(i); R-(iii); S-(ii)", "P-(iii); Q-(ii); R-(i); S-(v)", "P-(iii); Q-(i); R-(iv); S-(ii)"], correct: 0 },
        { id: 11, text: "Two species crossed. Which tissue has same chromosome?", options: ["Embryo", "Endosperm", "Embryo and seed coat", "Embryo and endosperm"], correct: 0 },
        { id: 12, text: "Which plasmid for cloning with BamHI, EcoRI?", options: ["Vector A", "Vector B", "Vector C", "Vector D"], correct: 1 },
        { id: 13, text: "Match conditions with processes.", options: ["P-(ii); Q-(iv); R-(iii); S-(i)", "P-(iii); Q-(iv); R-(i); S-(ii)", "P-(iv); Q-(iii); R-(i); S-(ii)", "P-(ii); Q-(i); R-(iv); S-(iii)"], correct: 0 },
        { id: 14, text: "Which graph represents light vs photosynthesis?", options: ["Graph A", "Graph B", "Graph C", "Graph D"], correct: 2 },
        { id: 15, text: "Oxygen dissociation curves statement?", options: ["Curve A at low H+", "Curve C at low pCO2", "Curve A at low pH", "Curve C at high pO2"], correct: 0 }
    ],
    Chemistry: [
        { id: 1, text: "Element Z=120, which group?", options: ["Alkaline earth", "Alkali", "Halogens", "Noble gases"], correct: 0 },
        { id: 2, text: "N2, CO, NO+ statement?", options: ["Isoelectronic, identical bond order", "Isoelectronic, different bond order", "Not isoelectronic, identical", "Neither"], correct: 0 },
        { id: 3, text: "Complex with 2 Bohr Magneton?", options: ["Only K4[Mn(CN)6]", "K2[MnCl4] and K4[Mn(CN)6]", "[Fe(H2O)6](NO3)2 and K2[MnCl4]", "K4[Mn(CN)6] and [Ni(CO)4]"], correct: 0 },
        { id: 4, text: "VSEPR shapes of XeF4 and SF4?", options: ["Square planar and see-saw", "Both see-saw", "See-saw and square planar", "Both square planar"], correct: 0 },
        { id: 5, text: "Which shows violet colour?", options: ["[CoCl(NH3)5]2+", "[Co(H2O)(NH3)5]3+", "[Co(NH3)6]3+", "[Co(CN)6]3-"], correct: 0 },
        { id: 6, text: "Relationship between structures?", options: ["Conformational", "Structural", "Enantiomers", "Positional"], correct: 2 },
        { id: 7, text: "Order of acidity?", options: ["P > N > Q > M", "P > Q > N > M", "N > P > M > Q", "N > P > Q > M"], correct: 3 },
        { id: 8, text: "Products N and Q?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 1 },
        { id: 9, text: "X and Z in reaction?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 2 },
        { id: 10, text: "Structural descriptions M and N?", options: ["M α-D-gluco, N β-D-fructo", "M β-D-gluco, N β-D-fructo", "M α-D-gluco, N α-D-fructo", "M α-D-glucofuranose, N β-D"], correct: 0 },
        { id: 11, text: "Exothermic 2A→B+C+D statement?", options: ["Spontaneous at all T", "Spontaneous high T", "Spontaneous low T", "Non-spontaneous"], correct: 1 },
        { id: 12, text: "Work function 500nm, 100W at 300nm. KE?", options: ["40 J", "2.6×10⁻¹⁹ J", "1.6×10⁻¹⁹ J", "80 J"], correct: 0 },
        { id: 13, text: "Rate constant 3×10⁻³. Which plot?", options: ["Plot A", "Plot B", "Plot C", "Plot D"], correct: 1 },
        { id: 14, text: "Osmotic pressure vs volume plot?", options: ["Plot A", "Plot B", "Plot C", "Plot D"], correct: 2 },
        { id: 15, text: "KCl limiting molar conductivity?", options: ["150.1", "149.2", "151.1", "152.1"], correct: 0 }
    ],
    Mathematics: [
        { id: 1, text: "Lines L1, L2, L3. Total elements in A?", options: ["3", "0", "1", "2"], correct: 3 },
        { id: 2, text: "If (5,y)∈B, what is y²?", options: ["9", "1", "4", "16"], correct: 3 },
        { id: 3, text: "Point on L2 closest to L1?", options: ["(3,4,3)", "(3,4,4)", "(5,4,5)", "(4,4,4)"], correct: 0 },
        { id: 4, text: "2sn=n(c+an), which statement?", options: ["AP", "a1,2a2,3a3 is AP", "GP", "a1,2a2,3a3 is GP"], correct: 0 },
        { id: 5, text: "g(t)=sin(f(t)). Which correct?", options: ["g decreasing", "g increasing", "g inc then dec", "g dec then inc"], correct: 1 },
        { id: 6, text: "Which case implies f continuous?", options: ["g=(f)³", "g=|f|", "g=(f)²", "g=sin(f)"], correct: 0 },
        { id: 7, text: "Largest rectangle area under y=1-x²?", options: ["4/(3√3)", "2/(3√3)", "4/3", "1/3"], correct: 0 },
        { id: 8, text: "Relation R on matrices?", options: ["Reflex, symmetric", "Reflex only", "Equivalence", "Symmetric, transitive"], correct: 2 },
        { id: 9, text: "²³C₀+²³C₂+...+²³C₂₂?", options: ["2²²", "2²²-1", "2²³+1", "2²³"], correct: 0 },
        { id: 10, text: "f(x+y)=f(x)+f(y), f(1)=10?", options: ["Bijective", "Injective", "Surjective", "Neither"], correct: 0 },
        { id: 11, text: "Integral value I?", options: ["eπ/²-e⁻π/²", "0", "πeπ/²/2", "eπ-1"], correct: 1 },
        { id: 12, text: "Subset S of complex?", options: ["Parabola", "Circle", "Ellipse", "Hyperbola"], correct: 0 },
        { id: 13, text: "Ship engines prob?", options: ["3/4", "1/2", "1/32", "1/4"], correct: 1 },
        { id: 14, text: "Differential equation y value?", options: ["π/6", "π/3", "π/2", "π/4"], correct: 0 },
        { id: 15, text: "Length of PQ?", options: ["2.2", "2", "√2", "3-√2"], correct: 1 }
    ],
    Physics: [
        { id: 1, text: "Abhijit and Vani on circular track?", options: ["Abhijit double", "Abhijit half", "Same distance", "Abhijit 4/3"], correct: 0 },
        { id: 2, text: "Pendulum angular momentum vs T?", options: ["A ∝ T³", "A ∝ T²", "A ∝ T", "A ∝ T⁴"], correct: 1 },
        { id: 3, text: "Angular acceleration of disc?", options: ["g/4R", "g/2R", "g/R", "g/3R"], correct: 1 },
        { id: 4, text: "Bob velocity V0?", options: ["√(5gL/2)", "√(5gL)", "√(2gL)", "√(3gL/2)"], correct: 0 },
        { id: 5, text: "Sphere oscillation period?", options: ["2π√(2R/3g)", "2π√(R/g)", "2π√(3R/2g)", "2π√(2R/g)"], correct: 0 },
        { id: 6, text: "Gas adiabatic expansion pressure?", options: ["RT/2V", "RT/4V", "RT/V", "2RT/V"], correct: 2 },
        { id: 7, text: "x=sin²(ωt)cos³(ωt) period?", options: ["2π/ω", "2π/3ω", "2π/5ω", "2π/15ω"], correct: 2 },
        { id: 8, text: "Mixed gas λ and T?", options: ["Formula A", "Formula B", "Formula C", "Formula D"], correct: 1 },
        { id: 9, text: "Charge acceleration?", options: ["(i-3√3j)", "(i-√3j)", "(3i-√3j)", "(3√3i-j)"], correct: 2 },
        { id: 10, text: "Circuit ω value?", options: ["1/√(2LC)", "1/√(LC)", "1/2√(LC)", "1/√(3LC)"], correct: 0 },
        { id: 11, text: "Wire magnetic moment?", options: ["Iab(j+k)", "Iab(j-k)", "√2Iab(j+k)", "Iab(k-j)"], correct: 0 },
        { id: 12, text: "Capacitor Q2/(Q1+Q2)?", options: ["4/5", "1/5", "1/4", "1/2"], correct: 0 },
        { id: 13, text: "Binding energy difference?", options: ["0.01307", "2.00425", "0.99559", "3.01291"], correct: 0 },
        { id: 14, text: "Slab thickness for zero shift?", options: ["1/√3", "1/√2", "1/2", "√3/2"], correct: 3 },
        { id: 15, text: "Work function value?", options: ["1 eV", "2 eV", "1.5 eV", "1.25 eV"], correct: 1 }
    ]
};

// State
let currentSection = 'Biology';
let currentQuestionIndex = 0;
let answers = {};
let markedForReview = {};
let visited = {};
let timeLeft = 10800; // 3 hours
let timerInterval = null;
let userName = 'Student';
let violations = 0; // Added violations counter

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Begin Test Button
    const beginBtn = document.getElementById('beginTestBtn');
    if (beginBtn) {
        beginBtn.addEventListener('click', startExam);
    }

    // Section Tabs
    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });

    // Action Buttons
    const markBtn = document.getElementById('markReviewBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveNextBtn');
    const submitBtn = document.getElementById('submitExamBtn');

    if (markBtn) markBtn.addEventListener('click', toggleMarkForReview);
    if (clearBtn) clearBtn.addEventListener('click', clearResponse);
    if (saveBtn) saveBtn.addEventListener('click', saveAndNext);
    if (submitBtn) submitBtn.addEventListener('click', submitExam);

    // Checkbox validation
    const agreeTerms = document.getElementById('agreeTerms');
    const beginTestBtn = document.getElementById('beginTestBtn');
    
    if (agreeTerms && beginTestBtn) {
        beginTestBtn.disabled = !agreeTerms.checked;
        agreeTerms.addEventListener('change', function() {
            beginTestBtn.disabled = !this.checked;
        });
    }

    // Get candidate name
    const nameInput = document.getElementById('candidateName');
    if (nameInput) {
        nameInput.addEventListener('change', function() {
            userName = this.value || 'Student';
        });
    }
}

// Start Exam
function startExam() {
    const instructionPage = document.getElementById('instructionPage');
    const examInterface = document.getElementById('examInterface');
    
    if (instructionPage) instructionPage.style.display = 'none';
    if (examInterface) examInterface.style.display = 'block';

    // Set user name
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = userName;

    // Load first question
    loadQuestion();
    updatePalette();
    startTimer();
    updateSectionCounts();
}

// Timer
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            autoSubmitExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    const display = `Time Left : ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) timerEl.textContent = display;
}

// Load Question
function loadQuestion() {
    const questions = questionBank[currentSection];
    const question = questions[currentQuestionIndex];
    const questionKey = `${currentSection}-${currentQuestionIndex}`;

    visited[questionKey] = true;

    // Update question number
    const qNumEl = document.getElementById('questionNumberDisplay');
    if (qNumEl) qNumEl.textContent = `Question No. ${currentQuestionIndex + 1}`;

    // Update question text
    const qTextEl = document.getElementById('questionContent');
    if (qTextEl) {
        qTextEl.innerHTML = `<p class="question-text">${question.text}</p>`;
    }

    // Load options
    const optionsContainer = document.getElementById('optionsContainer');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            if (answers[questionKey] === index) {
                optionDiv.classList.add('selected');
            }
            
            optionDiv.innerHTML = `
                <input type="radio" name="question" value="${index}" ${answers[questionKey] === index ? 'checked' : ''}>
                <span class="option-text"><strong>(${String.fromCharCode(97 + index)})</strong> ${option}</span>
            `;
            
            optionDiv.addEventListener('click', function() {
                selectAnswer(index);
            });
            
            optionsContainer.appendChild(optionDiv);
        });
    }

    // Update section title
    const sectionTitleEl = document.getElementById('sectionTitle');
    if (sectionTitleEl) sectionTitleEl.textContent = currentSection;

    updatePalette();
}

// Select Answer
function selectAnswer(optionIndex) {
    const questionKey = `${currentSection}-${currentQuestionIndex}`;
    answers[questionKey] = optionIndex;
    
    // Update UI
    document.querySelectorAll('.option-item').forEach((item, index) => {
        if (index === optionIndex) {
            item.classList.add('selected');
            item.querySelector('input').checked = true;
        } else {
            item.classList.remove('selected');
            item.querySelector('input').checked = false;
        }
    });
    
    updatePalette();
    updateSectionCounts();
}

// Switch Section
function switchSection(section) {
    currentSection = section;
    currentQuestionIndex = 0;
    
    // Update active tab
    document.querySelectorAll('.section-tab').forEach(tab => {
        if (tab.getAttribute('data-section') === section) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    loadQuestion();
}

// Toggle Mark for Review
function toggleMarkForReview() {
    const questionKey = `${currentSection}-${currentQuestionIndex}`;
    markedForReview[questionKey] = !markedForReview[questionKey];
    updatePalette();
    saveAndNext();
}

// Clear Response
function clearResponse() {
    const questionKey = `${currentSection}-${currentQuestionIndex}`;
    delete answers[questionKey];
    loadQuestion();
    updateSectionCounts();
}

// Save and Next
function saveAndNext() {
    const questions = questionBank[currentSection];
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

// Update Palette
function updatePalette() {
    const paletteEl = document.getElementById('questionPalette');
    if (!paletteEl) return;
    
    paletteEl.innerHTML = '';
    const questions = questionBank[currentSection];
    
    questions.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = 'palette-btn';
        btn.textContent = index + 1;
        
        const questionKey = `${currentSection}-${index}`;
        
        // Determine status
        if (index === currentQuestionIndex) {
            btn.classList.add('current');
        }
        
        if (markedForReview[questionKey]) {
            btn.classList.add('marked');
        } else if (answers[questionKey] !== undefined) {
            btn.classList.add('answered');
        } else if (visited[questionKey]) {
            btn.classList.add('not-answered');
        } else {
            btn.classList.add('not-visited');
        }
        
        btn.addEventListener('click', () => {
            currentQuestionIndex = index;
            loadQuestion();
        });
        
        paletteEl.appendChild(btn);
    });
}

// Update Section Counts
function updateSectionCounts() {
    const sections = ['Biology', 'Chemistry', 'Mathematics', 'Physics'];
    
    sections.forEach(section => {
        let answered = 0;
        const questions = questionBank[section];
        
        questions.forEach((_, index) => {
            const key = `${section}-${index}`;
            if (answers[key] !== undefined) answered++;
        });
        
        const countEl = document.getElementById(`${section.toLowerCase()}Count`);
        if (countEl) {
            countEl.textContent = answered;
        }
    });
}

//Submit Exam
function submitExam() {
    if (confirm('Are you sure you want to submit the exam?')) {
        autoSubmitExam();
    }
}

// Auto Submit and Manual Submit
function autoSubmitExam() {
    // Stop timers
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Compute results
    const results = calculateScore();

    // Show results
    showResults(results);

    // Console log for debugging
    console.log('Exam submitted:', {
        answers,
        markedForReview,
        violations,
        timeLeft,
        score: results.totalScore,
        maxScore: results.maxScore,
        timestamp: new Date().toISOString()
    });
}

// Score calculation
function calculateScore() {
    let totalScore = 0;
    let maxScore = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;
    let sectionBreakdown = {};

    Object.keys(questionBank).forEach(section => {
        const qArr = questionBank[section];
        const marksPerQuestion = 4; // As per standard JEE pattern
        
        sectionBreakdown[section] = {
            obtained: 0,
            max: qArr.length * marksPerQuestion,
            attempted: 0,
            correctCount: 0,
            totalQuestions: qArr.length
        };

        qArr.forEach((q, idx) => {
            totalQuestions++;
            maxScore += marksPerQuestion;
            const key = `${section}-${idx}`;
            const ans = answers[key];
            
            if (ans !== undefined && ans !== null) {
                totalAttempted++;
                sectionBreakdown[section].attempted++;
                
                if (ans === q.correct) {
                    totalCorrect++;
                    totalScore += marksPerQuestion;
                    sectionBreakdown[section].obtained += marksPerQuestion;
                    sectionBreakdown[section].correctCount++;
                } else {
                    // Negative marking: -1 for wrong answer
                    totalScore -= 1;
                    sectionBreakdown[section].obtained -= 1;
                }
            }
        });
    });

    return {
        totalScore,
        maxScore,
        totalAttempted,
        totalCorrect,
        totalQuestions,
        sectionBreakdown
    };
}

// Show results
function showResults(results) {
    // Create a results display
    const examInterface = document.getElementById('examInterface');
    if (!examInterface) {
        alert(`Exam Submitted!\n\nTotal Score: ${results.totalScore}/${results.maxScore}\nAttempted: ${results.totalAttempted}/${results.totalQuestions}\nCorrect: ${results.totalCorrect}\nViolations: ${violations}`);
        return;
    }

    // Hide exam content and show results
    examInterface.innerHTML = `
        <div style="max-width: 900px; margin: 50px auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">Exam Results</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #334155;">Overall Performance</h2>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 6px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Total Score</div>
                        <div style="font-size: 28px; font-weight: bold; color: ${results.totalScore >= 0 ? '#10b981' : '#ef4444'};">${results.totalScore} / ${results.maxScore}</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Attempted</div>
                        <div style="font-size: 28px; font-weight: bold; color: #2563eb;">${results.totalAttempted} / ${results.totalQuestions}</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Correct Answers</div>
                        <div style="font-size: 28px; font-weight: bold; color: #10b981;">${results.totalCorrect}</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Violations</div>
                        <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${violations}</div>
                    </div>
                </div>
            </div>

            <h2 style="color: #334155; margin-bottom: 20px;">Section-wise Breakdown</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <thead>
                    <tr style="background: #f1f5f9;">
                        <th style="text-align: left; padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Section</th>
                        <th style="text-align: right; padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Score</th>
                        <th style="text-align: right; padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Max Score</th>
                        <th style="text-align: right; padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Attempted</th>
                        <th style="text-align: right; padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Correct</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(results.sectionBreakdown).map(section => {
                        const s = results.sectionBreakdown[section];
                        return `
                            <tr>
                                <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; font-weight: 500;">${section}</td>
                                <td style="padding: 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: ${s.obtained >= 0 ? '#10b981' : '#ef4444'}; font-weight: 500;">${s.obtained}</td>
                                <td style="padding: 15px; text-align: right; border-bottom: 1px solid #e2e8f0;">${s.max}</td>
                                <td style="padding: 15px; text-align: right; border-bottom: 1px solid #e2e8f0;">${s.attempted} / ${s.totalQuestions}</td>
                                <td style="padding: 15px; text-align: right; border-bottom: 1px solid #e2e8f0;">${s.correctCount}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div style="text-align: center; margin-top: 40px;">
                <button onclick="location.reload()" style="background: #2563eb; color: white; padding: 12px 30px; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
                    Start New Exam
                </button>
            </div>
        </div>
    `;
}
