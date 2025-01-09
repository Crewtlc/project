import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Train } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const upperUserId = userId.trim().toUpperCase();
    if (!upperUserId) return;

    try {
      const { data: users, error: selectError } = await supabase
        .from('users')
        .select('id')
        .eq('user_id', upperUserId);

      if (!users?.length) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ user_id: upperUserId }]);

        if (insertError) throw insertError;
      }

      localStorage.setItem('userId', upperUserId);
      navigate('/quiz');
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 rounded-full mb-4">
          <img src="https://pbs.twimg.com/profile_images/1561596530166882304/2Wo87HwQ_400x400.jpg" width="170"/>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900">East Coast Railway</h1>
          <h2 className="text-xl font-semibold text-center text-gray-700 mt-2">Electrical (OP)</h2>
          <h3 className="text-lg text-center text-gray-600 mt-1">Waltair Division, Visakhapatnam</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Enter your ID (e.g., SCMN1234)"
            required
          />
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;