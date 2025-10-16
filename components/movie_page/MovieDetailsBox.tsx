import React from 'react';
import { MovieDetails } from '../../types';

interface MovieDetailsBoxProps {
  details: MovieDetails;
}

const DetailItem: React.FC<{ label: string; value: string | string[] }> = ({ label, value }) => (
  <li className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-700">
    <span className="text-slate-400 font-medium">{label}</span>
    <span className="text-white text-left sm:text-right font-light">
      {Array.isArray(value) ? value.join(', ') : value}
    </span>
  </li>
);

const MovieDetailsBox: React.FC<MovieDetailsBoxProps> = ({ details }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-xl font-semibold text-white mb-3">Details</h3>
      <ul className="space-y-1 text-sm">
        <DetailItem label="Release Date" value={new Date(details.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} />
        <DetailItem label="Director" value={details.director} />
        <DetailItem label="Country of Origin" value={details.country} />
        <DetailItem label="Language" value={details.language} />
        {details.productionCompanies.length > 0 && (
          <DetailItem label="Production" value={details.productionCompanies} />
        )}
      </ul>
    </div>
  );
};

export default MovieDetailsBox;
