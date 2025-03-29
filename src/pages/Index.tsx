
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Directly navigate to portfolio (About Me)
    navigate('/portfolio', { replace: true });
  }, [navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2">Redirecting to Portfolio...</span>
    </div>
  );
};

export default Index;
