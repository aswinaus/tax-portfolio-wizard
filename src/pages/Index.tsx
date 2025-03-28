
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted) {
      navigate('/portfolio/blogs', { replace: true });
    }
  }, [mounted, navigate]);

  if (!mounted) return null;

  return null;
};

export default Index;
