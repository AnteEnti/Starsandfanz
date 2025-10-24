

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl animate-page-enter">
      <h1 className="text-4xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">About Fanz Adda</h1>
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          Welcome to <span className="font-bold text-purple-300">Fanz Adda</span>, the ultimate celebration hub for fans! We believe that fandom is about celebration, not criticism. Our platform is a dedicated space for you to connect with fellow fans, share your excitement, and celebrate the stars and movies you love.
        </p>
        <p>
          In a world full of hot takes and critiques, we wanted to create a positive sanctuary. Here, every movie is a cherished memory, every star is an emotion, and every fan's voice matters. This isn't a place for reviews or negativity; it's a place for pure, unadulterated fan excitement.
        </p>
        <h2 className="text-2xl font-semibold text-white pt-4">Our Mission</h2>
        <p>
          Our mission is simple: to provide a vibrant, positive, and engaging social media experience where fans can come together to celebrate their passions. We aim to foster a community built on respect, enthusiasm, and a shared love for cinema and its creators.
        </p>
        <h2 className="text-2xl font-semibold text-white pt-4">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><span className="font-semibold">Exclusive Content:</span> Stay updated with the latest announcements, behind-the-scenes glimpses, and milestone celebrations, all curated by our admin team.</li>
          <li><span className="font-semibold">Engage & React:</span> Express your feelings with unique reactions and join the conversation in our "Fanz Say" sections.</li>
          <li><span className="font-semibold">Deep Dives:</span> Explore detailed pages for movies and celebrities, including filmographies, cast and crew, and related buzz.</li>
          <li><span className="font-semibold">A Positive Community:</span> Connect with a global community of fans who share your enthusiasm and passion.</li>
        </ul>
        <p>
          Thank you for being a part of our sphere. Let's celebrate together!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;