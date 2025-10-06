import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Phone,
  User,
  Building2,
} from "lucide-react";
import Card from "../../components/Card";
import ErrorMessage from "../../components/ErrorMessage";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const CreateBloodCamp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bloodBanks, setBloodBanks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    address: "",
    city: "",
    expectedDonors: "",
    facilities: [],
    requirements: "",
    bloodBankPartner: "",
    contactPersonName: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
  });

  const facilitiesOptions = [
    "Free Health Checkup",
    "Refreshments",
    "Medical Staff",
    "Ambulance Available",
    "Certificates",
    "Parking Available",
    "Wheelchair Accessible",
  ];

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  const fetchBloodBanks = async () => {
    try {
      const response = await axios.get("/bloodbanks");
      if (response.data.success && response.data.data) {
        setBloodBanks(response.data.data || []);
      } else {
        setBloodBanks([]);
      }
    } catch (error) {
      console.error("Error fetching blood banks:", error);
      setBloodBanks([]); // Ensure it's always an array
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFacilityToggle = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (new Date(formData.date) <= new Date()) {
      setError("Camp date must be in the future");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
      return;
    }

    if (formData.expectedDonors < 10) {
      setError("Expected donors must be at least 10");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        contactPerson: {
          name: formData.contactPersonName,
          phone: formData.contactPersonPhone,
          email: formData.contactPersonEmail,
        },
      };

      // Remove individual contact person fields
      delete dataToSend.contactPersonName;
      delete dataToSend.contactPersonPhone;
      delete dataToSend.contactPersonEmail;

      const response = await axios.post("/camps", dataToSend);

      if (response.data.success) {
        toast.success(
          "Blood camp created successfully! Awaiting admin approval."
        );
        navigate("/organization/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blood camp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Blood Donation Camp
          </h1>
          <p className="text-gray-700 font-medium">
            Organize a blood donation drive in your community
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <ErrorMessage message={error} />}

            {/* Camp Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-purple-600" />
                Camp Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Camp Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field pl-4"
                    placeholder="e.g., Blood Donation Drive 2024"
                    required
                    minLength={5}
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Description *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 h-5 w-5 text-gray-500" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field pl-11"
                      rows="4"
                      placeholder="Describe the purpose and details of the blood camp..."
                      required
                      maxLength={1000}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="input-field pl-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Start Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="input-field pl-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      End Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="input-field pl-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                Location Details
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="input-field pl-4"
                      placeholder="e.g., City Community Hall"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input-field pl-11"
                        placeholder="Enter city name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field pl-4"
                    rows="2"
                    placeholder="Full address with landmarks"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Camp Capacity & Partners */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Capacity & Partners
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Expected Donors *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="number"
                      name="expectedDonors"
                      value={formData.expectedDonors}
                      onChange={handleChange}
                      className="input-field pl-11"
                      placeholder="Minimum 10"
                      min="10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Blood Bank Partner (Optional)
                  </label>
                  <select
                    name="bloodBankPartner"
                    value={formData.bloodBankPartner}
                    onChange={handleChange}
                    className="input-field pl-4"
                  >
                    <option value="">Select a blood bank (optional)</option>
                    {bloodBanks && bloodBanks.length > 0 ? (
                      bloodBanks.map((bank) => (
                        <option key={bank._id} value={bank._id}>
                          {bank.name} - {bank.city}
                        </option>
                      ))
                    ) : (
                      <option disabled>No blood banks available</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Facilities Available
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {facilitiesOptions.map((facility) => (
                  <label
                    key={facility}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.facilities.includes(facility)
                        ? "bg-purple-50 border-purple-600"
                        : "bg-white border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() => handleFacilityToggle(facility)}
                      className="text-purple-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {facility}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="border-t pt-8">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Special Requirements (Optional)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="input-field pl-4"
                rows="3"
                placeholder="Any special requirements or instructions for donors..."
              />
            </div>

            {/* Contact Person */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Contact Person
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    className="input-field pl-4"
                    placeholder="Contact person name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="tel"
                      name="contactPersonPhone"
                      value={formData.contactPersonPhone}
                      onChange={handleChange}
                      className="input-field pl-11"
                      placeholder="1234567890"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="contactPersonEmail"
                    value={formData.contactPersonEmail}
                    onChange={handleChange}
                    className="input-field pl-4"
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
              >
                {loading ? "Creating Blood Camp..." : "Create Blood Camp"}
              </button>
              <p className="text-sm text-gray-600 text-center mt-4">
                Your camp will be reviewed and approved by admin before it
                appears publicly.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateBloodCamp;
