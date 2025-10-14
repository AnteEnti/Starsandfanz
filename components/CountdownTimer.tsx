import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeStatus {
  isCountingDown: boolean;
  totalHours?: number;
  minutes?: number;
  seconds?: number;
  countUpText?: string;
}

const calculateTimeStatus = (targetDate: string): TimeStatus => {
  const difference = +new Date(targetDate) - +new Date();

  if (difference > 0) {
    // Counting down
    const totalHours = Math.floor(difference / (1000 * 60 * 60));
    return {
      isCountingDown: true,
      totalHours: Math.min(totalHours, 99),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    // Counting up
    const elapsed = +new Date() - +new Date(targetDate);
    const elapsedDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const elapsedYears = Math.floor(elapsedDays / 365.25);
    const elapsedMonths = Math.floor(elapsedDays / 30.44); // Average month length

    let countUpText = "Released Today!";
    if (elapsedYears >= 1) {
      countUpText = `${elapsedYears} Year${elapsedYears > 1 ? 's' : ''} Of Release`;
    } else if (elapsedMonths >= 1) {
      countUpText = `${elapsedMonths} Month${elapsedMonths > 1 ? 's' : ''} Of Release`;
    } else if (elapsedDays >= 1) {
      if (elapsedDays === 1) {
        countUpText = "1st Day Of Release";
      } else {
        countUpText = `${elapsedDays} Days Of Release`;
      }
    }
    
    return {
      isCountingDown: false,
      countUpText: countUpText,
    };
  }
};

const TimeBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-8 h-8 md:w-9 md:h-9 bg-white rounded-md shadow-inner flex items-center justify-center overflow-hidden">
        <div className="absolute w-full h-[1px] bg-slate-400 top-1/2 z-10"></div>
        <span className="text-lg md:text-xl font-bold text-black tracking-wider relative z-0">{String(value).padStart(2, '0')}</span>
    </div>
    <span className="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest mt-1">{label}</span>
  </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeStatus, setTimeStatus] = useState(calculateTimeStatus(targetDate));

  useEffect(() => {
    // Update every second for countdown, but less frequently for count up
    const interval = timeStatus.isCountingDown ? 1000 : 60000; // 1 sec for countdown, 1 min for countup
    const timer = setInterval(() => {
      setTimeStatus(calculateTimeStatus(targetDate));
    }, interval);

    return () => clearInterval(timer);
  }, [targetDate, timeStatus.isCountingDown]);

  if (timeStatus.isCountingDown) {
    return (
      <div className="flex justify-center items-center space-x-1 md:space-x-1.5">
        <TimeBox value={timeStatus.totalHours!} label="Hours" />
        <TimeBox value={timeStatus.minutes!} label="Mins" />
        <TimeBox value={timeStatus.seconds!} label="Secs" />
      </div>
    );
  }

  // Count up display
  return (
    <div className="bg-amber-500 text-white font-bold px-3 py-1.5 rounded-md text-xs md:text-sm shadow-lg text-center">
        {timeStatus.countUpText}
    </div>
  );
};

export default CountdownTimer;