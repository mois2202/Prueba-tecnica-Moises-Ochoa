import React from 'react';

interface DashboardTemplateProps {
  header: React.ReactNode;
  summaryCards: React.ReactNode;
  chartsSection: React.ReactNode;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  header,
  summaryCards,
  chartsSection,
}) => {
  return (
    <div>
      {header}

      {summaryCards}

      {chartsSection}
    </div>
  );
};
