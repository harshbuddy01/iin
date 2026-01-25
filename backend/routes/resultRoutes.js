import express from 'express';
import StudentAttempt from '../models/StudentAttempt.js';
import Student from '../models/Student.js';

const router = express.Router();

// ==================== GET ALL RESULTS ====================
// GET /api/admin/results?testId=xyz&search=student@email.com
router.get('/results', async (req, res) => {
    try {
        const { testId, search = '', page = 1, limit = 50 } = req.query;
        
        console.log(`📊 [RESULTS] Fetching results... TestID: "${testId || 'all'}" Search: "${search}"`);
        
        let query = {};
        
        if (testId) {
            query.testId = testId;
        }
        
        // If searching by email, need to find student first
        if (search) {
            const students = await Student.find({
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { fullName: { $regex: search, $options: 'i' } }
                ]
            });
            
            const studentIds = students.map(s => s._id);
            query.studentId = { $in: studentIds };
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const attempts = await StudentAttempt.find(query)
            .sort({ attemptDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const totalCount = await StudentAttempt.countDocuments(query);
        
        // Populate student details
        const resultsWithStudents = await Promise.all(
            attempts.map(async (attempt) => {
                const student = await Student.findById(attempt.studentId);
                
                return {
                    id: attempt._id,
                    testId: attempt.testId,
                    studentId: attempt.studentId,
                    studentEmail: student?.email || 'Unknown',
                    studentName: student?.fullName || 'N/A',
                    score: attempt.score,
                    totalQuestions: attempt.totalQuestions,
                    correctAnswers: attempt.correctAnswers,
                    wrongAnswers: attempt.wrongAnswers,
                    unattempted: attempt.unattempted,
                    percentage: ((attempt.correctAnswers / attempt.totalQuestions) * 100).toFixed(2),
                    timeTaken: attempt.timeTaken,
                    attemptDate: attempt.attemptDate,
                    completed: attempt.completed
                };
            })
        );
        
        console.log(`✅ [RESULTS] Found ${resultsWithStudents.length} results`);
        
        res.json({
            success: true,
            results: resultsWithStudents,
            pagination: {
                total: totalCount,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalCount / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('❌ [RESULTS] Error fetching results:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== GET SINGLE RESULT ====================
// GET /api/admin/results/:id
router.get('/results/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`📊 [RESULTS] Fetching result: ${id}`);
        
        const attempt = await StudentAttempt.findById(id);
        
        if (!attempt) {
            return res.status(404).json({
                success: false,
                error: 'Result not found'
            });
        }
        
        const student = await Student.findById(attempt.studentId);
        
        res.json({
            success: true,
            result: {
                id: attempt._id,
                testId: attempt.testId,
                studentId: attempt.studentId,
                studentEmail: student?.email || 'Unknown',
                studentName: student?.fullName || 'N/A',
                score: attempt.score,
                totalQuestions: attempt.totalQuestions,
                correctAnswers: attempt.correctAnswers,
                wrongAnswers: attempt.wrongAnswers,
                unattempted: attempt.unattempted,
                percentage: ((attempt.correctAnswers / attempt.totalQuestions) * 100).toFixed(2),
                timeTaken: attempt.timeTaken,
                attemptDate: attempt.attemptDate,
                completed: attempt.completed,
                answers: attempt.answers,
                sectionScores: attempt.sectionScores
            }
        });
    } catch (error) {
        console.error('❌ [RESULTS] Error fetching result:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== GET RESULTS STATISTICS ====================
// GET /api/admin/results/stats/overview?testId=xyz
router.get('/results/stats/overview', async (req, res) => {
    try {
        const { testId } = req.query;
        
        console.log(`📊 [RESULTS] Fetching statistics... TestID: "${testId || 'all'}"`);
        
        let query = {};
        if (testId) {
            query.testId = testId;
        }
        
        const totalAttempts = await StudentAttempt.countDocuments(query);
        const completedAttempts = await StudentAttempt.countDocuments({ ...query, completed: true });
        
        // Average score
        const avgScoreData = await StudentAttempt.aggregate([
            { $match: query },
            { $group: { _id: null, avgScore: { $avg: '$score' } } }
        ]);
        
        // Highest score
        const highestScoreData = await StudentAttempt.find(query)
            .sort({ score: -1 })
            .limit(1);
        
        // Average percentage
        const avgPercentageData = await StudentAttempt.aggregate([
            { $match: query },
            {
                $project: {
                    percentage: {
                        $multiply: [
                            { $divide: ['$correctAnswers', '$totalQuestions'] },
                            100
                        ]
                    }
                }
            },
            { $group: { _id: null, avgPercentage: { $avg: '$percentage' } } }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalAttempts,
                completedAttempts,
                pendingAttempts: totalAttempts - completedAttempts,
                averageScore: avgScoreData[0]?.avgScore?.toFixed(2) || 0,
                highestScore: highestScoreData[0]?.score || 0,
                averagePercentage: avgPercentageData[0]?.avgPercentage?.toFixed(2) || 0
            }
        });
    } catch (error) {
        console.error('❌ [RESULTS] Error fetching stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== GET SCORE DISTRIBUTION ====================
// GET /api/admin/results/stats/distribution?testId=xyz
router.get('/results/stats/distribution', async (req, res) => {
    try {
        const { testId } = req.query;
        
        console.log(`📈 [RESULTS] Fetching score distribution... TestID: "${testId || 'all'}"`);
        
        let query = {};
        if (testId) {
            query.testId = testId;
        }
        
        const distribution = await StudentAttempt.aggregate([
            { $match: query },
            {
                $bucket: {
                    groupBy: {
                        $multiply: [
                            { $divide: ['$correctAnswers', '$totalQuestions'] },
                            100
                        ]
                    },
                    boundaries: [0, 20, 40, 60, 80, 100],
                    default: '100+',
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);
        
        const labels = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'];
        const data = distribution.map(d => d.count);
        
        res.json({
            success: true,
            distribution: {
                labels,
                data
            }
        });
    } catch (error) {
        console.error('❌ [RESULTS] Error fetching distribution:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== GET TOP PERFORMERS ====================
// GET /api/admin/results/stats/top-performers?testId=xyz&limit=10
router.get('/results/stats/top-performers', async (req, res) => {
    try {
        const { testId, limit = 10 } = req.query;
        
        console.log(`🏆 [RESULTS] Fetching top performers... TestID: "${testId || 'all'}"`);
        
        let query = { completed: true };
        if (testId) {
            query.testId = testId;
        }
        
        const topAttempts = await StudentAttempt.find(query)
            .sort({ score: -1 })
            .limit(parseInt(limit));
        
        const topPerformers = await Promise.all(
            topAttempts.map(async (attempt) => {
                const student = await Student.findById(attempt.studentId);
                
                return {
                    rank: topAttempts.indexOf(attempt) + 1,
                    studentEmail: student?.email || 'Unknown',
                    studentName: student?.fullName || 'N/A',
                    score: attempt.score,
                    percentage: ((attempt.correctAnswers / attempt.totalQuestions) * 100).toFixed(2),
                    attemptDate: attempt.attemptDate
                };
            })
        );
        
        res.json({
            success: true,
            topPerformers
        });
    } catch (error) {
        console.error('❌ [RESULTS] Error fetching top performers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== DELETE RESULT ====================
// DELETE /api/admin/results/:id
router.delete('/results/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`🗑️ [RESULTS] Deleting result: ${id}`);
        
        const deletedResult = await StudentAttempt.findByIdAndDelete(id);
        
        if (!deletedResult) {
            return res.status(404).json({
                success: false,
                error: 'Result not found'
            });
        }
        
        console.log(`✅ [RESULTS] Result deleted: ${id}`);
        
        res.json({
            success: true,
            message: 'Result deleted successfully'
        });
    } catch (error) {
        console.error('❌ [RESULTS] Error deleting result:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

console.log('✅ Result routes loaded');

export default router;