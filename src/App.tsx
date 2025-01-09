import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Quiz from './components/Quiz';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-100 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-4 py-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Knowledge Test on Automatic Section</h1>
            <p className="text-gray-600">Challenge yourself with these knowledge-based questions!</p>
          </div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;