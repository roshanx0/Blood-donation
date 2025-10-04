import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createRequest } from '../../redux/slices/requestSlice';
import { Droplet, User, Phone, MapPin, Building2, FileText } from 'lucide-react';
import Card from '../../components/Card';

const CreateRequest = () => {
  const { user, userType } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodType: '',
    quantity: 1,
    urgency: 'medium',
    city: user?.city || '',
    hospital: '',
    patientName: '',
    contactNumber: user?.phone || '',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'blue' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bloodType) {
      newErrors.bloodType = 'Please select blood type';
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Phone number must be 10 digits';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const result = await dispatch(createRequest(formData));
      if (result.type === 'requests/createRequest/fulfilled') {
        navigate(
          userType === 'bloodbank'
            ? '/bloodbank/dashboard'
            : '/user/dashboard'
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-full">
              <Droplet className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Blood Request
          </h1>
          <p className="text-gray-600">
            Fill in the details to request blood donation
          </p>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Type & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bloodType" className="label">
                  Blood Type <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Droplet className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="bloodType"
                    name="bloodType"
                    required
                    value={formData.bloodType}
                    onChange={handleChange}
                    className={`input-field pl-10 ${
                      errors.bloodType ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select Blood Type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.bloodType && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodType}</p>
                )}
              </div>

              <div>
                <label htmlFor="quantity" className="label">
                  Quantity (units) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`input-field ${
                    errors.quantity ? 'border-red-500' : ''
                  }`}
                  placeholder="1"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="label">
                Urgency Level <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {urgencyLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.urgency === level.value
                        ? `border-${level.color}-500 bg-${level.color}-50`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span
                      className={`font-semibold ${
                        formData.urgency === level.value
                          ? `text-${level.color}-700`
                          : 'text-gray-700'
                      }`}
                    >
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Patient Name & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="patientName" className="label">
                  Patient Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    required
                    value={formData.patientName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${
                      errors.patientName ? 'border-red-500' : ''
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.patientName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.patientName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contactNumber" className="label">
                  Contact Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`input-field pl-10 ${
                      errors.contactNumber ? 'border-red-500' : ''
                    }`}
                    placeholder="1234567890"
                  />
                </div>
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* City & Hospital */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="label">
                  City <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className={`input-field pl-10 ${
                      errors.city ? 'border-red-500' : ''
                    }`}
                    placeholder="New York"
                  />
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="hospital" className="label">
                  Hospital (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="hospital"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="City Hospital"
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="label">
                Reason / Additional Information (Optional)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="reason"
                  name="reason"
                  rows="4"
                  value={formData.reason}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Please provide any additional information that might help potential donors..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary"
              >
                {isLoading ? (
                  <>
                    <div className="spinner border-white border-t-transparent w-5 h-5 mr-2"></div>
                    <span>Creating Request...</span>
                  </>
                ) : (
                  'Create Blood Request'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-red-600 hover:text-red-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRequest;