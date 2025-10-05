import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getRequestById,
  updateRequestStatus,
  respondToRequest,
  deleteRequest,
} from "../../redux/slices/requestSlice";
import {
  MapPin,
  Calendar,
  Phone,
  Building2,
  User,
  Mail,
  MessageCircle,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import Card from "../../components/Card";
import BloodTypeBadge from "../../components/BloodTypeBadge";
import UrgencyBadge from "../../components/UrgencyBadge";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentRequest, isLoading } = useSelector((state) => state.requests);
  const { user, userType } = useSelector((state) => state.auth);

  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getRequestById(id));
  }, [dispatch, id]);

  const isOwner =
    currentRequest?.requestedBy?._id === user?._id ||
    currentRequest?.requestedBy === user?._id;

  const handleStatusChange = async (status) => {
    const confirmMessage =
      status === "fulfilled"
        ? "Mark this request as fulfilled?"
        : "Cancel this request?";

    if (window.confirm(confirmMessage)) {
      await dispatch(updateRequestStatus({ id, status }));
      dispatch(getRequestById(id));
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this request? This action cannot be undone."
      )
    ) {
      const result = await dispatch(deleteRequest(id));
      if (result.type === "requests/deleteRequest/fulfilled") {
        navigate(
          userType === "bloodbank"
            ? "/bloodbank/dashboard"
            : userType === "admin"
            ? "/admin/dashboard"
            : "/user/dashboard"
        );
      }
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    const result = await dispatch(
      respondToRequest({ id, message: responseMessage })
    );
    setIsSubmitting(false);

    if (result.type === "requests/respondToRequest/fulfilled") {
      setResponseMessage("");
      setShowResponseForm(false);
      dispatch(getRequestById(id));
    }
  };

  if (isLoading || !currentRequest) {
    return <Loader fullScreen />;
  }

  const hasResponded = currentRequest.responses?.some(
    (response) => response.responderId?._id === user?._id
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back</span>
          </button>
        </div>

        {/* Main Request Card */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex items-start space-x-4">
              <BloodTypeBadge bloodType={currentRequest.bloodType} size="lg" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentRequest.patientName}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <UrgencyBadge urgency={currentRequest.urgency} />
                  <StatusBadge status={currentRequest.status} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isOwner && currentRequest.status === "pending" && (
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => handleStatusChange("fulfilled")}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark Fulfilled</span>
                </button>
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Request Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-semibold text-gray-900">
                    {currentRequest.city}
                  </p>
                </div>
              </div>

              {currentRequest.hospital && (
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hospital</p>
                    <p className="font-semibold text-gray-900">
                      {currentRequest.hospital}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="font-semibold text-gray-900">
                    {currentRequest.contactNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity Needed</p>
                  <p className="font-semibold text-gray-900">
                    {currentRequest.quantity} unit(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posted On</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(currentRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {currentRequest.reason && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Additional Information
                </h3>
                <p className="text-gray-600">{currentRequest.reason}</p>
              </div>
            )}
          </div>

          {/* Requester Info */}
          {currentRequest.requestedBy && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Requested By
              </h2>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-full">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {currentRequest.requestedBy.name}
                  </p>
                  {currentRequest.requestedBy.email && (
                    <p className="text-sm text-gray-600">
                      {currentRequest.requestedBy.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Response Section */}
        {!isOwner && currentRequest.status === "pending" && (
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Respond to Request
            </h2>

            {hasResponded ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  ✓ You have already responded to this request
                </p>
              </div>
            ) : !showResponseForm ? (
              <button
                onClick={() => setShowResponseForm(true)}
                className="btn-primary"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Send Response
              </button>
            ) : (
              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows="4"
                  className="input-field pl-4"
                  placeholder="Enter your message to the requester..."
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner border-white border-t-transparent w-4 h-4 mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Response"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResponseForm(false);
                      setResponseMessage("");
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-red-600 hover:text-red-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Card>
        )}

        {/* Responses */}
        {currentRequest.responses && currentRequest.responses.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Responses ({currentRequest.responses.length})
            </h2>
            <div className="space-y-4">
              {currentRequest.responses.map((response, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-full">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">
                          {response.responderId?.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(response.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {response.responderId?.email && (
                        <p className="text-sm text-gray-600 mb-2">
                          {response.responderId.email}
                        </p>
                      )}
                      {response.responderId?.phone && (
                        <p className="text-sm text-gray-600 mb-2">
                          📞 {response.responderId.phone}
                        </p>
                      )}
                      <p className="text-gray-700">{response.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestDetail;
