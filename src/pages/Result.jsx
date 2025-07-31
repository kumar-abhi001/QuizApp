import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, User, Trophy } from 'lucide-react';

export default function Result() {
  const navigate = useNavigate();
  const [resultsData, setResultsData] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
      const storedResults = sessionStorage.getItem('quizResults');
      
    if (!storedResults) {
      navigate('/');
      return;
    }

    const data = JSON.parse(storedResults);
    setResultsData(data);

    const results = data.questions.map(question => {
      const userAnswer = data.answers.find(a => a.questionId === question.id);
      return {
        question,
        userAnswer: userAnswer?.selectedOption ?? null,
        correctAnswer: question.correctAnswer,
        isCorrect: userAnswer?.selectedOption === question.correctAnswer
      };
    });

    setQuizResults(results);
  }, [navigate]);

  if (!resultsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  const correctAnswers = quizResults.filter(r => r.isCorrect).length;
  const totalQuestions = quizResults.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const timeSpentMinutes = Math.floor(resultsData.timeSpent / 60);
  const timeSpentSeconds = resultsData.timeSpent % 60;

  const scoreBadge = percentage >= 90
    ? { text: 'Excellent', color: 'bg-green-500 text-white' }
    : percentage >= 80
    ? { text: 'Good', color: 'bg-blue-500 text-white' }
    : percentage >= 60
    ? { text: 'Fair', color: 'bg-yellow-500 text-white' }
    : { text: 'Needs Improvement', color: 'bg-red-500 text-white' };

  const handleStartNewQuiz = () => {
    sessionStorage.removeItem('quizResults');
    navigate('/');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
          <p className="text-gray-500">Here's how you performed</p>
        </div>

        {/* Summary Card */}
        <div className=" shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Quiz Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <User className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-gray-500 text-sm">Participant</p>
              <p className="font-semibold">{resultsData.email}</p>
            </div>

            <div className="text-center">
              <Trophy className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-gray-500 text-sm">Score</p>
              <p className="text-2xl font-bold">{correctAnswers}/{totalQuestions}</p>
              <p className="text-lg font-semibold">{percentage}%</p>
            </div>

            <div className="text-center">
              <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-gray-500 text-sm">Time Spent</p>
              <p className="font-semibold">
                {timeSpentMinutes}m {timeSpentSeconds}s
              </p>
            </div>
          </div>
        </div>

        {/* Question-by-Question Results */}
        <div className=" shadow rounded-lg p-6 mb-8 flex flex-col text-left">
          <h2 className="text-xl font-semibold mb-6">Question-by-Question Results</h2>
          <div className="space-y-6">
            {quizResults.map((result, index) => (
              <div key={result.question.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    {result.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${result.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{result.question.question}</h3>
                    <div>
                        <span className='font-bold'>Correct Answer: </span>
                        {result.correctAnswer}
                    </div>
                    <div>
                        <span className='font-bold'>User Answer: </span>
                        {result.userAnswer}
                        {!result.userAnswer && <span>Not answered</span>}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center">
          <button
            onClick={handleStartNewQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}