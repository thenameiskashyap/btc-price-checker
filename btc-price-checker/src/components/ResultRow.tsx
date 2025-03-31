import React from 'react';

interface ResultRowProps {
  providerName: string;
  btc: string;
}

const ResultRow: React.FC<ResultRowProps> = ({ providerName, btc }) => {
  return (
    <div className="flex justify-between p-2 border-b">
      <span>{providerName}</span>
      <span>{btc}</span>
    </div>
  );
};

export default ResultRow;