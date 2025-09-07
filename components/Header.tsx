
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gem-space-cadet/50 py-6 text-center shadow-lg backdrop-blur-md">
      <h1 className="text-4xl font-bold text-gem-mint tracking-wider">
        Gemini Bulk Image Editor
      </h1>
      <p className="mt-2 text-lg text-gem-teal">
        Apply one creative prompt to all your images at once with AI.
      </p>
    </header>
  );
};

export default Header;
