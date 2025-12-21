// Fixed exam.js - Matches your HTML structure
'use strict';

// Question Bank (using your existing data)
// IISER Aptitude Test 2025 (Derived from User PDF)
// IISER Aptitude Test 2025 (Derived from User PDF)
const questionBank = {
    Biology: [
        {
            id: 1,
            // Added HTML Table Grid for matching [cite: 6]
            text: `Match the entries in column I and column II.<br><br>
            <table border="1" style="width:100%; border-collapse: collapse; text-align: left;">
              <tr>
                <th style="padding: 8px;">Column I</th>
                <th style="padding: 8px;">Column II</th>
              </tr>
              <tr>
                <td style="padding: 8px;">P. Notochord and hollow nerve cord present</td>
                <td style="padding: 8px;">i. Cyclostomata</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Q. Ectoparasite with 6-15 pairs of gills and closed circulation</td>
                <td style="padding: 8px;">ii. Chondrichthyes</td>
              </tr>
              <tr>
                <td style="padding: 8px;">R. Marine animals with persistent notochord and placoid scales</td>
                <td style="padding: 8px;">iii. Hemichordata</td>
              </tr>
              <tr>
                <td style="padding: 8px;">S. Animals with open circulatory systems, and stomochord</td>
                <td style="padding: 8px;">iv. Chordata</td>
              </tr>
            </table>`,
            options: [
                "P-iv; Q-ii; R-i; S-iii",
                "P-iv; Q-i; R-ii; S-iii", // Original (a) [cite: 8, 9]
                "P-iii; Q-i; R-ii; S-iv",
                "P-i; Q-iii; R-ii; S-iv"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 2,
            text: "Chromosomes are classified as metacentric, sub-metacentric, acrocentric and telocentric. This classification is based on the position of which one of the following structures? [cite: 19]",
            options: [
                "Centrosome",
                "Centriole",
                "Telomere",
                "Centromere" // Original (a) [cite: 20, 21]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 3,
            text: "Which one of the following options describes a triglyceride? [cite: 30]",
            options: [
                "Three glycerol molecules linked to a fatty acid chain",
                "Three fatty acid chains linked to a molecule of glycerol", // Original (a) [cite: 31, 32]
                "Three saturated fatty acid chains linked to a molecule of cholesterol",
                "Three glyceride molecules linked to a molecule of phospholipid"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 4,
            text: "Which one of the following statements about a plant carotenoid is FALSE? [cite: 41]",
            options: [
                "It accumulates in chromoplasts during fruit ripening.",
                "It protects chlorophyll a from photo-oxidation.",
                "It is an accessory pigment which absorbs light at 600-700 nm.", // Original (a) [cite: 42, 43]
                "It provides precursor for the synthesis of stress hormone in plants."
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 5,
            text: "A cell suspension of actively respiring mitochondria is treated with chemical X (Exp 1), chemical Y (Exp 2), or left untreated (Exp 3). Chemical X inhibits electron transport from Complex I to ubiquinone. Chemical Y inhibits transport from Complex III to cytochrome C. Which option represents the correct order of relative number of ATP synthesised? [cite: 52, 53]",
            options: [
                "Experiment 2 < Experiment 1 < Experiment 3", // Original (a) [cite: 55, 56]
                "Experiment 1 < Experiment 2 < Experiment 3",
                "Experiment 1 = Experiment 2 = Experiment 3",
                "Experiment 2 < Experiment 1 = Experiment 3"
            ],
            correct: 0,
            marks: 4
        },
        {
            id: 6,
            text: "Which one of the following autoregulatory mechanisms is employed by the kidney when glomerular filtration rate is reduced? [cite: 65]",
            options: [
                "Levels of renin and aldosterone are reduced.",
                "Levels of renin, angiotensin I and II and aldosterone are increased.", // Original (a) [cite: 66, 67]
                "Levels of renin are increased, while those of angiotensin I and II and aldosterone are reduced.",
                "Levels of angiotensin I and II are increased, while that of aldosterone are reduced."
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 7,
            text: "Which one of the following conditions will favour maximum dissociation of oxygen from the oxyhaemoglobin in the tissues? [cite: 76]",
            options: [
                "higher [H+] lower temperature",
                "lower [H+] higher temperature",
                "higher [H+] higher temperature", // Original (a) [cite: 77, 78]
                "lower [H+] lower temperature"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 8,
            text: "Which one of the following statements is correct? [cite: 87]",
            options: [
                "Mitochondria are more in white than in red muscle fibres.",
                "Red muscle fibres produce ATP aerobically under normal oxygen conditions.", // Original (a) [cite: 88, 89]
                "Lactic acid accumulates more in red than in white muscle fibres under similar conditions.",
                "All muscle fibres primarily produce ATP anaerobically."
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 9,
            text: "Which one of the following organisms produces the female gamete by mitosis of haploid cells? [cite: 98]",
            options: [
                "Honey bee",
                "Garden pea", // Original (a) [cite: 99, 100]
                "Fruit fly",
                "Chicken"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 10,
            text: "Which amino acid will be charged on the tRNA with anticodon 5'-GUU-3'? [cite: 109]",
            options: [
                "Valine (codon GUU)",
                "Leucine (codon UUG)",
                "Asparagine (codon AAC)", // Original (a) [cite: 110, 111]
                "Glutamine (codon CAA)"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 11,
            // Added HTML Table for genetics data [cite: 120, 121, 122, 123, 124, 125, 126, 127, 128]
            text: `Two double heterozygous plants (PpQq) derived from two different pairs of true-breeding parents of unknown genotype, produce gametes in the proportions as given below.<br><br>
            <table border="1" style="width:100%; border-collapse: collapse; text-align: center;">
              <tr>
                <th style="padding: 5px;">Cross</th>
                <th style="padding: 5px;">F1 Genotype</th>
                <th style="padding: 5px;">Gamete Proportions</th>
              </tr>
              <tr>
                <td style="padding: 5px;">R1 X R2</td>
                <td style="padding: 5px;">PpQq</td>
                <td style="padding: 5px;">35% pQ, 35% Pq, 15% PQ, 15% pq</td>
              </tr>
              <tr>
                <td style="padding: 5px;">R3 X R4</td>
                <td style="padding: 5px;">PpQq</td>
                <td style="padding: 5px;">35% PQ, 35% pq, 15% pQ, 15% Pq</td>
              </tr>
            </table><br>
            Which one of the following options correctly represents the genotype of the parents? [cite: 129]`,
            options: [
                "R1=PPQQ; R2=ppqq; R3=ppQQ; R4=PPqq",
                "R1=ppQQ; R2=PPqq; R3=PPQQ; R4=ppqq", // Original (a) [cite: 130, 131]
                "R1=ppQQ; R2=PPqq; R3=PPqq; R4=ppQQ",
                "R1=PPQQ; R2=R3; R4=PPQQ"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 12,
            text: "What are retroviruses? [cite: 141]",
            options: [
                "A group of viruses with DNA genome and no reverse transcriptase activity",
                "A group of viruses with DNA genome and reverse transcriptase activity",
                "A group of viruses with RNA genome and reverse transcriptase activity", // Original (a) [cite: 142, 143]
                "A group of viruses with RNA genome and no reverse transcriptase activity"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 13,
            text: "The given picture was obtained from an agarose gel electrophoresis of a plasmid after digestion with restriction enzymes either X, Y or both X and Y. Which diagram correctly represents the position of the restriction enzyme sites (X, Y) on the 10,000 bp plasmid? [cite: 152, 159]",
            image: "biology_q13_electrophoresis.jpg",
            options: [
                "Diagram C",
                "Diagram B",
                "Diagram D",
                "Diagram A (Y at 9235bp, X at 1235bp)" // Original (a) [cite: 160-166]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 14,
            text: "Honey bee males are haploid and females are diploid. Which one of the following statements is INCORRECT about honey bees? [cite: 200]",
            options: [
                "Honey bee males cannot have daughters but can have sons.", // Original (a) [cite: 201, 202]
                "Honey bee males are produced from unfertilized eggs and females are produced from fertilized eggs.",
                "A honey bee male does not have a father but has a grandfather.",
                "Honey bee males form gametes by mitosis and females form gametes by meiosis."
            ],
            correct: 0,
            marks: 4
        },
        {
            id: 15,
            text: "Which one of the following statements is FALSE? [cite: 211]",
            options: [
                "Only 10% of energy is transferred to each of the higher trophic levels in grazing food chain.",
                "More than 80% of the solar energy incident on earth is captured by plants and photosynthetic bacteria.", // Original (a) [cite: 212, 213]
                "All organisms of a trophic level should be included for estimation of energy content of that trophic level.",
                "The movement of energy is unidirectional in the ecological pyramid of energy."
            ],
            correct: 1,
            marks: 4
        }
    ],

    Chemistry: [
        {
            id: 1,
            text: "Which one of the following statements best describes the acidic/basic/amphoteric nature of ZnO and CaO? [cite: 223]",
            options: [
                "ZnO is basic, while CaO is amphoteric.",
                "Both ZnO and CaO are amphoteric.",
                "ZnO is amphoteric, while CaO is basic.", // Original (a) [cite: 224, 225]
                "ZnO is acidic, while CaO is basic."
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 2,
            text: "Which among the following processes is/are associated with increasing bond order but no change in diamagnetic/paramagnetic behaviour? [cite: 235] (i) N2 -> N2+ + e- (ii) O2 -> O2+ + e- (iii) O2 + e- -> O2-",
            options: [
                "(i) and (ii)",
                "(ii) and (iii)",
                "(iii) only",
                "(ii) only" // Original (a) [cite: 239, 240]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 3,
            text: "What is the value of E°(Fe3+/Fe0)? [The standard reduction potential values are E°(Fe3+/Fe2+) = 0.77 V, and E°(Fe2+/Fe0) = -0.44 V] [cite: 249, 250]",
            options: [
                "-0.04 V", // Original (a) [cite: 251, 252]
                "0.33 V",
                "0.11 V",
                "-0.11 V"
            ],
            correct: 0,
            marks: 4
        },
        {
            id: 4,
            text: "What are the correct orders of stability for the following compounds? [cite: 261]",
            options: [
                "VCl5 > VF5; CuCl2 > CuI2",
                "VF5 > VCl5; CuCl2 > CuI2", // Original (a) [cite: 262, 263]
                "VCl5 > VF5; CuI2 > CuCl2",
                "VF5 > VCl5; CuI2 > CuCl2"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 5,
            text: "Consider the reaction scheme: CrCl3.6H2O (P) --NH3(excess)--> Q. P + excess AgNO3 -> 1 mole AgCl ppt. Q + excess AgNO3 -> 3 moles AgCl ppt. Which statement is correct? [cite: 272-281]",
            options: [
                "Both P and Q show geometrical isomerism and P absorbs light of higher wavelength than Q.",
                "P shows geometrical isomerism and absorbs light of higher wavelength than that of Q.", // Original (a) [cite: 283, 287]
                "Q shows geometrical isomerism and absorbs light of higher wavelength than that of P.",
                "P shows geometrical isomerism and absorbs light of lower wavelength than that of Q."
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 6,
            text: "How many beta-hydrogen is/are present in 2-methyl-3-phenyl-pentan-1-al? [cite: 293]",
            options: [
                "1",
                "3",
                "4", // Original (a) [cite: 294, 295]
                "2"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 7,
            text: "Which of the following reactions do NOT provide an aldehyde as a product? [cite: 304]",
            image: "chemistry_q7_reactions.jpg",
            options: [
                "Reaction (b) (Pd-BaSO4/H2)",
                "Reaction (c) (SnCl2, HCl)",
                "Reaction (a) ((C6H5CH2)2Cd)", // Original (a) [cite: 305, 307]
                "Reaction (d) (CrO2Cl2, CS2)"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 8,
            text: "What are the major products formed in the following reaction sequence? 1. (Ph-CH=C(CH3)-Ph) -> (i) O3 (ii) Zn dust -> (iii) PhMgBr (excess) -> (iv) H3O+ [cite: 319-324]",
            image: "chemistry_q8_sequence.jpg",
            options: [
                "Option (c)",
                "Option (a)", // Original (a) [cite: 325, 330]
                "Option (d)",
                "Option (b)"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 9,
            text: "What is the major product in the reaction sequence given below? Ph-CN -> (i) DIBAL-H -> (ii) H2O -> (iii) Zn-Hg/conc. HCl [cite: 349-354]",
            image: "chemistry_q9_reaction.jpg",
            options: [
                "Ph-CH2-NH2",
                "Ph-CHO",
                "Ph-OH",
                "Ph-CH3" // Original (a) [cite: 355, 357]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 10,
            text: "Compound I undergoes hydroboration-oxidation reaction with (BH3)2 followed by treatment with H2O2 and aqueous NaOH to produce compound II, which upon oxidation with CrO3 gives 2,3-dimethyl-cyclohexanone. What is the structure of I? [cite: 369, 370]",
            image: "chemistry_q10_structure.jpg",
            options: [
                "Structure (b)",
                "Structure (c)",
                "Structure (a)", // Original (a) [cite: 371-373]
                "Structure (d)"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 11,
            text: "The work done when one mole of an ideal gas expands at constant temperature T from volume V to 2V (in two equal steps of volume in a linear fashion) is 7/12 RT. How much more work would be done by the gas if it expands in three equal steps? [cite: 384]",
            options: [
                "RT",
                "1/30 RT", // Original (a) [cite: 386, 387]
                "-RT ln()",
                "RT"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 12,
            text: "At a particular temperature, the magnitude of the rate constant is 5x10^-5 and the unit of the pre-exponential factor is mol L^-1 min^-1. Which of the following plots is correct? [cite: 396]",
            image: "chemistry_q12_plots.jpg",
            options: [
                "Plot (d)",
                "Plot (b)",
                "Plot (c)",
                "Plot (a) (t1/2 vs [R]0 is linear increasing)" // Original (a) [cite: 398-400]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 13,
            text: "What is the time period of revolution of an electron in the fourth Bohr orbit of He+? [cite: 413]",
            options: [
                "4.8 femtoseconds",
                "24 femtoseconds",
                "2.4 femtoseconds", // Original (a) [cite: 415, 416]
                "0.24 femtoseconds"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 14,
            text: "The dipole moments of three AB3 type molecules I, II, and III are measured to be 0.0 D, 0.2 D, and 1.5 D, respectively. Which option is correct regarding identity of I, II, III? [cite: 425, 426]",
            options: [
                "I: BF3, II: NF3, III: NH3",
                "I: BF3, II: NH3, III: NF3", // Original (a) [cite: 427, 428]
                "I: ClF3, II: NF3, III: NH3",
                "I: BCl3, II: NH3, III: NF3"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 15,
            text: "During the charging and discharging of a lead-acid battery... which of the following redox reactions does NOT occur? [cite: 437]",
            options: [
                "Pb -> Pb2+ + 2e-",
                "Pb4+ + 4e- -> Pb", // Original (a) [cite: 439]
                "Pb2+ -> Pb4+ + 2e-",
                "2Pb2+ -> Pb4+ + Pb"
            ],
            correct: 1,
            marks: 4
        }
    ],

    Mathematics: [
        {
            id: 1,
            text: "How many three digit numbers divisible by 5 are there in which no digits are repeated? [cite: 449]",
            options: [
                "128",
                "144",
                "162",
                "136" // Original (a) [cite: 450, 451]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 2,
            text: "Let A be a 3x3 matrix [[4, -1, cos x], [-1, 5x, 25], [x^2+1, 25, 7]]. For how many values of x is the matrix A symmetric? [cite: 460-462]",
            options: [
                "2",
                "infinitely many",
                "1", // Original (a) [cite: 463, 464]
                "4"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 3,
            text: "Let n = Sum(r=0 to 10) of (-1)^r * 10Cr * (2/3)^2r * 3^20. Which statement is TRUE? [cite: 474, 475]",
            options: [
                "n is divisible by 5", // Original (a) [cite: 477, 478]
                "n is divisible by 6",
                "n is divisible by 8",
                "n is divisible by 9"
            ],
            correct: 0,
            marks: 4
        },
        {
            id: 4,
            text: "Let f: R -> R be f(x) = cos(tan^-1 x). Which statement is TRUE? [cite: 487]",
            options: [
                "f is decreasing on R",
                "f is decreasing for x < 0",
                "f is decreasing for x > 0", // Original (a) [cite: 489]
                "f is decreasing on the interval (-1, 1)"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 5,
            text: "Let A = {x in R | -31 < det([[3x-1, 2], [-2, 5]]) <= 29}. Which statement is TRUE? [cite: 498]",
            options: [
                "A = (-2, 2]", // Original (a) [cite: 500]
                "A = (-2, 2)",
                "A = [-2, 2)",
                "A = [-2, 2]"
            ],
            correct: 0,
            marks: 4
        },
        {
            id: 6,
            text: "Let z1, z2, z3 be complex numbers satisfying 2 = |2z1| = |z2 - 1| = |z3 + 1| = |1/z1 + 1/(z2-1) + 1/(z3+1)|. What is the value of |4z1 + z2 + z3|? [cite: 506-508]",
            options: [
                "4",
                "8", // Original (a) [cite: 509]
                "1/4",
                "1/8"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 7,
            text: "Let f(x) = |x^3 - 3x|[x], where [ ] denotes the greatest integer function. Which statement is TRUE? [cite: 518]",
            options: [
                "f is continuous at every real number",
                "Every integer is a point of discontinuity of f",
                "Every non-zero integer is a point of discontinuity of f", // Original (a) [cite: 520, 521]
                "f is continuous at every real number except 0, +/- sqrt(3)"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 8,
            text: "Let L be the tangent line to the ellipse x^2 + 16y^2 = 4 at (1, sqrt(3)/4). What is the equation of the line perpendicular to L passing through (2, 0)? [cite: 529, 531]",
            options: [
                "y = 2sqrt(3)(x-2)",
                "y = 4sqrt(3)(x-2)", // Original (a) [cite: 532, 533]
                "y = sqrt(3)(x-2)",
                "4sqrt(3)y = (x-2)"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 9,
            text: "Let a and b be two vectors such that |a + b| = 15 and a x (3i - 4j + 5k) = (3i - 4j + 5k) x b. What is the value of |(a + b).(2i + 3j + k)|? [cite: 541-543]",
            options: [
                "0",
                "sqrt(2)",
                "3",
                "3/sqrt(2)" // Original (a) [cite: 544, 545]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 10,
            text: "What is the derivative of log(sin^2 x) with respect to sin x? [cite: 553]",
            options: [
                "sin 2x",
                "2 cosec x", // Original (a) [cite: 554, 555]
                "4 cosec x",
                "cot x cosec 2x"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 11,
            text: "Let Sn denote the sum of first n terms of a sequence. If S(n+3) - Sn = 13n + 7 for all n, what is a13 - a10? [cite: 564]",
            options: [
                "13", // Original (a) [cite: 565, 566]
                "137",
                "46",
                "12"
            ],
            correct: 0,
            marks: 4
        },
        {
            id: 12,
            text: "Five fair coins are tossed independently. What is the probability that at least two heads appear? [cite: 575]",
            options: [
                "7/16",
                "5/16",
                "13/16", // Original (a) [cite: 576-578]
                "11/16"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 13,
            text: "Let f(x) = {x^2 - 4x - 5 if x >= 1, 2x if x < 1}. Which statement is TRUE? [cite: 586-588]",
            options: [
                "f is one-one but not onto",
                "f is neither one-one nor onto",
                "f is one-one and onto",
                "f is onto but not one-one" // Original (a) [cite: 589, 590]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 14,
            text: "Solution of differential equation x^2 dy/dx + 9xy = x^4 (x > 0), given y=0 when x=1? [cite: 599-601]",
            options: [
                "12y = x^9 - 1/x^3",
                "9y = x^21 - 1/x^3",
                "12y = x^3 - 1/x^9", // Original (a) [cite: 602]
                "9y = x^3 - 1/x^21"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 15,
            text: "What is the value of integral x cos x sin x dx? [cite: 608]",
            options: [
                "pi/2",
                "pi/4", // Original (a) [cite: 609, 610]
                "12",
                "pi/6"
            ],
            correct: 1,
            marks: 4
        }
    ],

    Physics: [
        {
            id: 1,
            text: "Elastic collision between particles A and B (same mass). Which graph describes the motion most accurately? [cite: 619-621]",
            image: "physics_q1_collision_graph.jpg",
            options: [
                "Graph B",
                "Graph A", // Original (a) [cite: 622]
                "Graph D",
                "Graph C"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 2,
            text: "Block M attached to spring k. Bullet m hits with speed v and sticks. Maximum compression? [cite: 659-661]",
            options: [
                "sqrt((mv^2)/k)",
                "sqrt((Mv^2)/k)",
                "sqrt((m^2 v^2)/(k(M+m)))", // Original (a) [cite: 662]
                "sqrt((mMv^2)/(k(M+m)))"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 3,
            text: "Cart M released from height h1, enters loop of radius R. Which quantity does not play a role in ensuring cart does not leave track? [cite: 674-676]",
            options: [
                "h1",
                "h2",
                "R",
                "M" // Original (a) [cite: 677]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 4,
            text: "Disk M, R rotating clockwise with omega. Torque T applied to oppose. Angular displacement theta before rotating counterclockwise? [cite: 694-696]",
            options: [
                "theta = (omega^2 M R^2) / 8T",
                "theta = (omega^2 M R^2) / 4T", // Original (a) [cite: 697]
                "theta = -(omega^2 M R^2) / 4T",
                "theta = -(omega^2 M R^2) / 8T"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 5,
            text: "Cube at T emits black body radiation Power P. If T increased by 1%, P increases by 4.5%. Approx percentage increase in volume? [cite: 707-709]",
            options: [
                "0.75%", // Original (a) [cite: 710]
                "0.50%",
                "1.56 x 10^-6 %",
                "6.25 x 10^-6 %"
            ],
            correct: 0,
            marks: 4
        },
        {
            id: 6,
            text: "Pipe A (one end closed), Pipe B (both open). Same length. nA-th harmonic A equals nB-th harmonic B. Relation between temperatures? [cite: 721-724]",
            options: [
                "TA = (4nA^2 / nB^2) TB",
                "TA = (nA^2 / 4nB^2) TB",
                "TA = (nB^2 / 4nA^2) TB",
                "TA = (4nB^2 / nA^2) TB" // Original (a) [cite: 725]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 7,
            text: "Superposition of y1 = A sin(kx-wt) and y2 = sqrt(3)A cos(kx-wt). Resultant As and phase phi? [cite: 735-737]",
            options: [
                "As = 2A and phi = pi/6",
                "As = A/2 and phi = pi/3",
                "As = 2A and phi = pi/3", // Original (a) [cite: 738]
                "As = A/2 and phi = pi/6"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 8,
            text: "Particle q, m, KE K enters E-field between plates (length l, separation d, potential 1V). Minimum K to not hit plates? [cite: 749-751]",
            image: "physics_q8_plates.jpg",
            options: [
                "d^2 / 2l^2",
                "l^2 / d^2",
                "d^2 / l^2",
                "l^2 / 2d^2" // Original (a) [cite: 753]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 9,
            text: "Potential difference between P and Q in capacitor bridge circuit (4uF, 2uF, 2uF, 4uF) with 12V source? [cite: 770]",
            image: "physics_q9_circuit.jpg",
            options: [
                "0 V",
                "4 V", // Original (a) [cite: 772]
                "8 V",
                "12 V"
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 10,
            text: "Particle m, q, v = v0(i+j-k) in B = B0(i+j+k). Helical radius r and pitch p? [cite: 788, 789]",
            options: [
                "r = (2sqrt(2)mv0)/(3qB0) and p = (2pi mv0)/(3qB0)", // Original (a) [cite: 792]
                "r = (mv0)/(3qB0) and p = (2pi mv0)/(3qB0)",
                "r = (2sqrt(2)mv0)/(3qB0) and p = (4sqrt(2)pi mv0)/(3qB0)",
                "r = (2pi mv0)/(3qB0) and p = (2sqrt(2)mv0)/(3qB0)"
            ],
            correct: 0,
            marks: 4
        },
        {
            id: 11,
            text: "Charged particle in circular orbit in B field enclosed by shrinking metallic frame. What changes occur? [cite: 800-802]",
            options: [
                "Radius increases, frequency decreases.",
                "Radius decreases, frequency increases.", // Original (a) [cite: 803]
                "Radius remains same, frequency increases.",
                "Both remain unchanged."
            ],
            correct: 1,
            marks: 4
        },
        {
            id: 12,
            text: "Equilateral prism (n=1.5) and parallelepiped (n=2.0). Light enters prism parallel to base. Angle of emergence theta? [cite: 813-815]",
            image: "physics_q12_prism.jpg",
            options: [
                "sin^-1 (1/3)",
                "sin^-1 (1/2)",
                "sin^-1 (3/4)", // Original (a) [cite: 816]
                "sin^-1 (sqrt(3)/2)"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 13,
            text: "Polaroid P1 aligned y-axis. P2 placed between source and P1. Intensity after P1 is 3I0/16. Angle of P2? [cite: 829-831]",
            image: "physics_q13_polaroid.jpg",
            options: [
                "15 deg",
                "45 deg",
                "75 deg",
                "60 deg" // Original (a) [cite: 832]
            ],
            correct: 3,
            marks: 4
        },
        {
            id: 14,
            text: "Electron in ground state E1 absorbs photon Ea, excites to level n. Value of n? [cite: 848]",
            options: [
                "sqrt(E1 / (E1 - Ea))",
                "sqrt(Ea / (E1 - Ea))",
                "sqrt(E1 / (E1 + Ea))", // Original (a) [cite: 849]
                "sqrt(Ea / (E1 + Ea))"
            ],
            correct: 2,
            marks: 4
        },
        {
            id: 15,
            text: "Particle m, q accel by E distance d1. Particle M, q accel by E distance d2. Same de Broglie wavelength. Ratio d2/d1? [cite: 859, 860]",
            options: [
                "M/m",
                "sqrt(m/M)",
                "m/M", // Original (a) [cite: 861]
                "sqrt(M/m)"
            ],
            correct: 2,
            marks: 4
        }
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

// Submit Exam
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