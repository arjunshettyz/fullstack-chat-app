import React from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`inline-block w-3 h-3 rounded-full bg-primary/70 animate-floatDot`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
      <style>{`
        @keyframes floatDot {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-12px); opacity: 1; }
        }
        .animate-floatDot {
          animation: floatDot 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AuthImagePattern;
