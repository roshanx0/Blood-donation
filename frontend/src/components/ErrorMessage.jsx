import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-slide-down">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800 font-medium leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
