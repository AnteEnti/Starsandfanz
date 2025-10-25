import React from 'react';

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

export const ShootingStarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="star-tail-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" style={{stopColor: '#f97316', stopOpacity: 1}} />
        <stop offset="60%" style={{stopColor: '#a855f7', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#a855f7', stopOpacity: 0}} />
      </linearGradient>
    </defs>
    <path d="M12.8718 2.00331C12.5271 1.15731 11.4729 1.15731 11.1282 2.00331L9.73602 5.50971C9.59688 5.86177 9.29419 6.13823 8.92182 6.22381L5.19232 7.07591C4.30037 7.28113 3.95562 8.34211 4.6047 8.97008L7.66981 11.936C7.93512 12.1924 8.05191 12.5647 7.97155 12.9238L7.20379 16.7371C7.01452 17.6534 7.91572 18.342 8.74235 17.882L12.0163 16.0827C12.338 15.9083 12.723 15.9083 13.0447 16.0827L16.3186 17.882C17.1453 18.342 18.0465 17.6534 17.8572 16.7371L17.0894 12.9238C17.0091 12.5647 17.1259 12.1924 17.3912 11.936L20.4563 8.97008C21.1054 8.34211 20.7606 7.28113 19.8687 7.07591L16.1392 6.22381C15.7668 6.13823 15.4641 5.86177 15.325 5.50971L13.9328 2.00331H12.8718Z" fill="#FACC15"/>
    <path d="M1 10C13.2958 11.5833 16.4868 14.5312 18 22" stroke="url(#star-tail-gradient)" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);