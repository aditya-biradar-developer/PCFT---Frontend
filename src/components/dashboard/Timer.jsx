import { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeDiff = tomorrow - now;
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer-card">
      <div className="timer-header">
        <h3>Time Left Today</h3>
        <div className="timer-icon">⏰</div>
      </div>
      <div className="timer-display">
        <span className="time-value">{timeLeft}</span>
        <span className="time-label">Hours : Minutes : Seconds</span>
      </div>
      <div className="timer-message">
        <p>Make the most of your remaining time today!</p>
      </div>
    </div>
  );
};

export default Timer;