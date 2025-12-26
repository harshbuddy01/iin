import { pool } from '../config/mysql.js';

export async function getResult(req, res) {
  try {
    const { attemptId } = req.params;

    if (!attemptId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attempt ID required' 
      });
    }

    // Get attempt with student and test details
    const [attempts] = await pool.query(
      `SELECT sa.*, s.email, s.roll_number, t.title, t.total_marks, t.test_id
       FROM student_attempts sa
       JOIN students s ON sa.student_id = s.id
       JOIN tests t ON sa.test_id = t.id
       WHERE sa.id = ?`,
      [attemptId]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Result not found' 
      });
    }

    const attempt = attempts[0];

    // Get all answers
    const [answers] = await pool.query(
      `SELECT 
         q.question_number,
         q.question_text,
         q.correct_answer,
         a.selected_option,
         q.marks,
         CASE WHEN a.selected_option = q.correct_answer THEN 1 ELSE 0 END as is_correct
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.attempt_id = ?
       ORDER BY q.question_number`,
      [attemptId]
    );

    res.json({
      success: true,
      data: {
        student: {
          email: attempt.email,
          rollNumber: attempt.roll_number
        },
        test: {
          testId: attempt.test_id,
          title: attempt.title,
          totalMarks: attempt.total_marks
        },
        result: {
          score: attempt.score,
          correctAnswers: attempt.correct_answers,
          totalQuestions: answers.length,
          percentage: ((attempt.score / attempt.total_marks) * 100).toFixed(2),
          status: attempt.status,
          submittedAt: attempt.submitted_at
        },
        answers: answers.map(a => ({
          questionNumber: a.question_number,
          questionText: a.question_text,
          selectedOption: a.selected_option,
          correctAnswer: a.correct_answer,
          isCorrect: a.is_correct === 1,
          marks: a.marks
        }))
      }
    });

  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get result' 
    });
  }
}
