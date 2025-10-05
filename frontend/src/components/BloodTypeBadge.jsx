const BloodTypeBadge = ({ bloodType, size = "md" }) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`blood-type-badge ${sizeClasses[size]} transition-transform hover:scale-105`}
    >
      {bloodType}
    </div>
  );
};

export default BloodTypeBadge;
