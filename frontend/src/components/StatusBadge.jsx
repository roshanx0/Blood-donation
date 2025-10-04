const StatusBadge = ({ status }) => {
  const statusClasses = {
    pending: 'status-pending',
    fulfilled: 'status-fulfilled',
    cancelled: 'status-cancelled',
  };

  return (
    <span className={`badge ${statusClasses[status] || ''}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;