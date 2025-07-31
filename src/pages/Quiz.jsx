import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const QUIZ_DURATION = 30 * 60;

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quizState, setQuizState] = useState({
    userEmail: email || '',
    currentQuestionIndex: 0,
    userAnswers: [],
    visited: [],
    timeRemaining: QUIZ_DURATION,
    isSubmitted: false,
    startTime: new Date()
  });
    const decodeHtml = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };
    
  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=15&type=multiple");
      if (response.ok) {
        const data = await response.json();
        const formattedQuestions = data.results.map((q, index) => ({
        id: index + 1,
        question: decodeHtml(q.question),
        options: [...q.incorrect_answers, q.correct_answer]
        .map(opt => decodeHtml(opt))
        .sort(() => Math.random() - 0.5),
        correctAnswer: decodeHtml(q.correct_answer)
    }));

          setQuestions(formattedQuestions);
          console.log(questions);
        setQuizState(prev => ({
          ...prev,
          userAnswers: formattedQuestions.map(q => ({ questionId: q.id, selectedOption: null }))
        }));
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
    };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (quizState.timeRemaining <= 0 || quizState.isSubmitted) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setQuizState(prev => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState.timeRemaining, quizState.isSubmitted]);

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (option) => {
    const newAnswers = quizState.userAnswers.map(answer =>
      answer.questionId === questions[quizState.currentQuestionIndex].id
        ? { ...answer, selectedOption: option }
        : answer
    );
    setQuizState(prev => ({
      ...prev,
      userAnswers: newAnswers
    }));
  };

  const goToQuestion = (index) => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      visited: [...new Set([...prev.visited, index])]
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      goToQuestion(quizState.currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      goToQuestion(quizState.currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (quizState.isSubmitted) return;
    setQuizState(prev => ({ ...prev, isSubmitted: true }));
    sessionStorage.setItem('quizResults', JSON.stringify({
      email: quizState.userEmail,
      answers: quizState.userAnswers,
      questions,
      timeSpent: QUIZ_DURATION - quizState.timeRemaining,
      totalTime: QUIZ_DURATION
    }));
    alert('Quiz submitted successfully!');
    navigate('/results');
  };

  const getButtonColor = (index) => {
    const answered = quizState.userAnswers[index]?.selectedOption !== null;
    const visited = quizState.visited.includes(index);
    if (answered) return 'bg-green-500';
    if (visited) return 'bg-yellow-400';
    return 'bg-gray-300';
  };

  if (!email) return null;
  if (loading) return <div className="p-5 text-center text-lg">Loading questions...</div>;

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const currentAnswer = quizState.userAnswers.find(a => a.questionId === currentQuestion.id);
  const progress = ((quizState.currentQuestionIndex + 1) / questions.length) * 100;
  const isTimeRunningOut = quizState.timeRemaining <= 300;

  return (
    <div className="p-4 sm:p-5 max-w-full sm:max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Quiz Assessment</h1>
        <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg mt-2 inline-block text-black font-bold ${isTimeRunningOut ? 'bg-yellow-200' : 'bg-gray-100'}`}>
          Time Remaining: {formatTime(quizState.timeRemaining)}
        </div>
        <div className="mt-3 text-sm sm:text-base">
          Question {quizState.currentQuestionIndex + 1} of {questions.length} ({Math.round(progress)}% Complete)
        </div>
        <div className="h-2 bg-gray-300 mt-2 rounded">
          <div className="h-2 bg-black rounded" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question Box */}
<div className="p-4 border rounded-lg shadow mb-6 text-black bg-white h-[350px] overflow-y-auto w-full sm:w-[768px] mx-auto">
  <h3 className="font-semibold mb-4 text-sm sm:text-base">
    {currentQuestion?.question}
  </h3>
  <div className="space-y-2 flex flex-col text-left">
    {currentQuestion?.options.map((option, index) => (
      <label 
        key={index} 
        className="block cursor-pointer border rounded px-2 sm:px-3 py-2 hover:bg-gray-100 transition text-sm sm:text-base"
      >
        <input
          type="radio"
          name={`question-${currentQuestion.id}`}
          checked={currentAnswer?.selectedOption === option}
          onChange={() => handleAnswerSelect(option)}
          className="mr-2"
        />
        <span>{option}</span>
      </label>
    ))}
  </div>
</div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <button
          onClick={handlePrevious}
          disabled={quizState.currentQuestionIndex === 0}
          className="px-3 sm:px-4 py-2 bg-gray-600 rounded-xl text-white disabled:opacity-50 flex-1 sm:flex-none"
        >
          Previous
        </button>
        {quizState.currentQuestionIndex === questions.length - 1 ? (
          <button onClick={handleSubmit} className="px-3 sm:px-4 py-2 bg-blue-500  text-white rounded flex-1 sm:flex-none">
            Submit Quiz
          </button>
        ) : (
          <button onClick={handleNext} className="px-3 sm:px-4 py-2 bg-black rounded-xl text-white flex-1 sm:flex-none">
            Next
          </button>
        )}
      </div>

      {/* Question Navigation Grid */}
      <div className="p-3 sm:p-4 border rounded-lg shadow mb-6 text-black bg-white overflow-y-auto w-full sm:w-[768px] mx-auto">
        <h4 className="mb-3 font-semibold text-sm sm:text-base">Question Navigation</h4>
        <div className="grid grid-cols-10 xs:grid-cols-10 sm:grid-cols-8 md:grid-cols-15 gap-2 sm">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`aspect-square rounded text-xs sm:text-sm ${getButtonColor(index)}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

    
        <div className="flex flex-wrap gap-3 mt-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 rounded"></div> Answered
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div> Visited
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 rounded"></div> Unvisited
          </div>
        </div>
      </div>

      {/* Time Warning */}
      {isTimeRunningOut && (
        <div className="mt-4 p-3 bg-yellow-200 rounded text-sm sm:text-base">
          ⚠️ Warning: Less than 5 minutes remaining!
        </div>
      )}
    </div>
  );
}
