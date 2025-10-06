const Card = ({ children, className = "", gradient = false, hover = true }) => {
  const baseClasses = gradient ? "card-gradient" : "card";
  const hoverClasses = hover ? "card-hover" : "";

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
