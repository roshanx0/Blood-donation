const UrgencyBadge = ({ urgency }) => {
  const urgencyClasses = {
    low: 'urgency-low',
    medium: 'urgency-medium',
    high: 'urgency-high',
    critical: 'urgency-critical',
  };

  return (
    <span className={`badge ${urgencyClasses[urgency] || ''}`}>
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </span>
  );
};

export default UrgencyBadge;