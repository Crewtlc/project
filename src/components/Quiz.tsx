import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, QuizState } from '../types';
import { questions as allQuestions } from '../data/questions';
import { shuffle } from '../utils';
import { supabase } from '../lib/supabase';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    answers: [],
    isFinished: false,
    questions: [],
  });

  // Timer state (initially set to 60 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false); // Track if results have been submitted

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    const shuffledQuestions = shuffle([...allQuestions]).slice(0, 3);
    setQuizState((prev) => ({ ...prev, questions: shuffledQuestions }));

    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the timer if time reaches 0
          finishQuiz(); // Mark quiz as finished when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  const handleAnswer = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQuestion.correctAnswer;

    // Save the answer and move to next question
    setQuizState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, answer], // Save answer
      currentQuestion: prev.currentQuestion + 1,
      isFinished: prev.currentQuestion === prev.questions.length - 1,
    }));
  };

  const finishQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      isFinished: true,
    }));
  };

  const saveResults = async () => {
    // Prevent submitting if already submitted
    if (hasSubmitted) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      // Construct the results data including questions with answers
      const results = quizState.questions.map((question, index) => {
        const userAnswer = quizState.answers[index];
        return {
          id: question.id, // Store question ID
          question: question.question, // Store question text
          selected_answer: userAnswer ?? null, // If no answer, store null
          correct_answer: question.correctAnswer, // Store correct answer
          is_correct: userAnswer === question.correctAnswer || userAnswer === null, // Mark as incorrect if not answered
        };
      });

      // Store quiz results, including the questions with the answers
      await supabase.from('quiz_results').insert([
        {
          user_id: userId,
          score: quizState.score,
          total_questions: quizState.questions.length,
          answers: quizState.answers, // Saving the answers
          questions: results, // Store the detailed questions with answers
          completed_at: new Date().toISOString(),
        },
      ]);

      setHasSubmitted(true); // Mark as submitted
      navigate('/');
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  // If the quiz is finished, prevent new answers from being selected
  if (quizState.questions.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  if (quizState.isFinished || timeLeft === 0) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg h-[calc(100vh-200px)] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-4">
          Your score: {quizState.score} out of {quizState.questions.length}
        </p>

        <div className="space-y-4 mb-6">
          {quizState.questions.map((question, index) => (
            <div key={question.id} className="p-4 rounded-lg bg-gray-50">
              <p className="font-medium">{question.question}</p>
              <p className="text-sm mt-2">
                Your answer:{' '}
                <span
                  className={
                    quizState.answers[index] === question.correctAnswer
                      ? 'text-green-600'
                      : quizState.answers[index] === null
                      ? 'text-gray-600'
                      : 'text-red-600'
                  }
                >
                  {quizState.answers[index] ?? 'No answer'}
                </span>
              </p>
              {quizState.answers[index] !== question.correctAnswer && quizState.answers[index] !== null && (
                <p className="text-sm text-green-600">
                  Correct answer: {question.correctAnswer}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={saveResults}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Results
        </button>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600 font-bold">
            Question {quizState.currentQuestion + 1} of {quizState.questions.length}
          </span>
          <span className="text-sm text-gray-600 font-bold">Score: {quizState.score}</span>
          <span className="text-xl text-sm text-gray-600 font-extra-bold">Time Left: {timeLeft}s</span>
        </div>
        <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            disabled={timeLeft === 0 || quizState.isFinished} // Disable button if time is up or quiz is finished
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
