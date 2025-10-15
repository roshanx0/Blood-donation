const StatCard = ({
  icon: Icon,
  title,
  value,
  color = "red",
  trend,
  subtitle,
}) => {
  const colorClasses = {
    red: "from-red-600 to-red-700",
    blue: "from-blue-600 to-blue-700",
    green: "from-green-600 to-green-700",
    yellow: "from-yellow-600 to-yellow-700",
    purple: "from-purple-600 to-purple-700",
    gray: "from-gray-600 to-gray-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <p
              className={`text-xs font-medium mt-2 ${
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div
          className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl shadow-sm`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
