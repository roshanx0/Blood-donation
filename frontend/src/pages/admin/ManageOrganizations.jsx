import { useState, useEffect } from "react";
import {
  Building2,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  AlertCircle,
  Trash2,
} from "lucide-react";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const ManageOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, verified, unverified

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/organizations");
      if (response.data.success) {
        setOrganizations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (id, currentStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          currentStatus ? "unverify" : "verify"
        } this organization?`
      )
    ) {
      return;
    }

    try {
      const response = await axios.put(`/admin/organizations/${id}/verify`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchOrganizations();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update organization"
      );
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(`/admin/organizations/${id}`);
      if (response.data.success) {
        toast.success("Organization deleted successfully");
        fetchOrganizations();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete organization"
      );
    }
  };

  const filteredOrganizations = organizations.filter((org) => {
    if (filter === "verified") return org.isVerified;
    if (filter === "unverified") return !org.isVerified;
    return true;
  });

  const stats = {
    total: organizations.length,
    verified: organizations.filter((o) => o.isVerified).length,
    unverified: organizations.filter((o) => !o.isVerified).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage Organizations
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Verify hospitals, NGOs, and colleges to allow them to create blood
            camps
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Organizations
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Verified</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {stats.verified}
                </p>
              </div>
              <Shield className="h-12 w-12 text-green-600" />
            </div>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">
                  Pending Verification
                </p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">
                  {stats.unverified}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("verified")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === "verified"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Verified ({stats.verified})
            </button>
            <button
              onClick={() => setFilter("unverified")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === "unverified"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({stats.unverified})
            </button>
          </div>
        </Card>

        {/* Organizations List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Organizations Found
            </h3>
            <p className="text-gray-700">
              {filter === "all"
                ? "No organizations have registered yet."
                : filter === "verified"
                ? "No verified organizations yet."
                : "No pending organizations to review."}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrganizations.map((org) => (
              <Card
                key={org._id}
                className={`${
                  org.isVerified ? "border-green-200" : "border-yellow-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Organization Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {org.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              org.isVerified
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            }`}
                          >
                            {org.isVerified ? "Verified" : "Pending"}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-800 border border-purple-300 capitalize">
                            {org.type}
                          </span>
                        </div>
                        {org.description && (
                          <p className="text-sm text-gray-700 mb-3">
                            {org.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">{org.email}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">{org.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">{org.city}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          Reg: {org.registrationNumber}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          Est: {new Date(org.established).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Contact Person */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 font-bold uppercase mb-2">
                        Contact Person
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="text-gray-700">
                          <span className="font-bold">Name:</span>{" "}
                          {org.contactPerson.name}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-bold">Designation:</span>{" "}
                          {org.contactPerson.designation}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-bold">Phone:</span>{" "}
                          {org.contactPerson.phone}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-600">
                      <span className="font-medium">Address:</span>{" "}
                      {org.address}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Registered on: {new Date(org.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3">
                    <button
                      onClick={() =>
                        handleToggleVerification(org._id, org.isVerified)
                      }
                      className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
                        org.isVerified
                          ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300 hover:bg-yellow-200"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {org.isVerified ? (
                        <>
                          <X className="h-4 w-4" />
                          <span>Unverify</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Verify</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(org._id, org.name)}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-100 text-red-800 border-2 border-red-300 rounded-lg font-bold hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrganizations;
