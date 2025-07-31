import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    
    setTimeout(() => {
      toast.success('Starting your quiz...');
      navigate(`/quiz?email=${encodeURIComponent(email)}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-white text-transparent">
              QuizApp
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge with our comprehensive quiz platform. 
            Challenge yourself and see how you perform!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Quiz Info */}
          <div className="space-y-6">
            <div className='card1 flex flex-col text-left border-2 rounded-2xl p-3 '>
                          <div className='flex flex-center gap-2 text-3xl font-bold mb-2'><CheckCircle className='size-10' />
                              Quiz Details</div>
                          <div className='flex flex-center gap-2'>
                            <div className='mt-2'>
                                <Clock/>
                            </div>
                            <div>
                                <div className='text-xl'>Duration: 30 minutes</div>
                                <div className='text-md font-light'>Auto-submit when time expires</div>
                            </div>
                          </div >
                          <div className='flex flex-center gap-2'>
                              <div className='mt-2'><Users/></div>
                              <div>
                                <div className='text-xl'> Question type </div>
                                <div className='text-md font-light'>Multiple choice format</div>
                              </div>
                          </div>
                          <div className='flex flex-center gap-2'>
                              <div className='mt-2'><Brain /></div>
                              <div>
                                <div className='text-xl'> Instant Results</div>
                                <div className='text-md font-light'>Detail report with correct answers</div>
                              </div>
                              
                          </div>
            </div>
            <div className='flex flex-col text-left border-2 rounded-2xl p-3'>
                <div className='flex flex-center gap-2 text-3xl font-bold mb-2'>Instructions</div>
                   <div className="flex gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
                  <p className="text-sm">Enter your email address to begin</p>
                </div>
                <div className="flex gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
                  <p className="text-sm">Answer all questions within the time limit</p>
                </div>
                <div className="flex gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
                  <p className="text-sm">Review your results and performance</p>
                </div>
                
            </div>
          </div>

          {/* Start Quiz Form */}
          <div className="lg:pl-8">
            <div className="shadow-card-shadow border-2 border-white rounded-2xl justify-center p-2">
              <div>
                <div className="text-2xl text-center">Ready to Start?</div>
              </div>
              <div className=''>
                <form onSubmit={handleStartQuiz} className="space-y-6">
                  <div className="space-y-2 flex flex-col text-left">
                    <label htmlFor="email" className="text-base font-medium">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base border-2 p-2 rounded-md focus-visible:outline-none focus:border-indigo-600"
                      disabled={isLoading}
                    />
                    <p className="text-sm text-muted-foreground">
                      We'll use this to identify your quiz session
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Starting Quiz...
                      </div>
                    ) : (
                      'Start Quiz'
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-center text-muted-foreground">
                <strong>Note:</strong> Once started, the timer cannot be paused. 
                Make sure you have 30 minutes available before beginning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;