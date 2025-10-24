
import React from 'react';
import { CelebrityDetails } from '../../types';

interface CelebrityDetailsBoxProps {
  details: CelebrityDetails;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <li className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-700">
    <span className="text-slate-400 font-medium">{label}</span>
    <span className="text-white text-left sm:text-right font-light">{value}</span>
  </li>
);

const CelebrityDetailsBox: React.FC<CelebrityDetailsBoxProps> = ({ details }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-xl font-semibold text-white mb-3">Details</h3>
      <ul className="space-y-1 text-sm">
        <DetailItem label="Born" value={new Date(details.birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} />
        <li className="flex flex-col pt-2">
          <span className="text-slate-400 font-medium mb-2">Notable Works</span>
          <div className="flex flex-wrap gap-2">
            {details.notableWorks.map(work => (
              <span key={work} className="bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1 rounded-full">
                {work}
              </span>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default CelebrityDetailsBox;
