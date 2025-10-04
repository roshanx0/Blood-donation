import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllBloodBanks } from '../../redux/slices/adminSlice';
import { Search, Building2, Mail, Phone, MapPin, FileText } from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';

const ManageBloodBanks = () => {
  const { allBloodBanks, isLoading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    dispatch(getAllBloodBanks());
  }, [dispatch]);

  const filteredBloodBanks = allBloodBanks.filter((bank) => {
    const matchesSearch =
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity =
      !filterCity ||
      bank.city.toLowerCase().includes(filterCity.toLowerCase());

    return matchesSearch && matchesCity;
  });

  // Get unique cities
  const cities = [...new Set(allBloodBanks.map((bank) => bank.city))].sort();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage Blood Banks
          </h1>
          <p className="text-gray-600">
            View and manage all approved blood banks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {allBloodBanks.length}
            </div>
            <div className="text-sm text-gray-600">Total Blood Banks</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {cities.length}
            </div>
            <div className="text-sm text-gray-600">Cities Covered</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-full">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {allBloodBanks.filter((bank) => bank.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Banks</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, city, or license number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Filters */}
            <div>
              <label htmlFor="city" className="label">
                Filter by City
              </label>
              <select
                id="city"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="input-field"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || filterCity) && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCity('');
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <strong>{filteredBloodBanks.length}</strong> of{' '}
            <strong>{allBloodBanks.length}</strong> blood bank(s)
          </p>
        </div>

        {/* Blood Banks List */}
        {filteredBloodBanks.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Building2 className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Blood Banks Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search criteria
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBloodBanks.map((bank) => (
              <Card key={bank._id} className="hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-full flex-shrink-0">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {bank.name}
                      </h3>
                      {bank.isApproved && (
                        <span className="badge badge-success">Approved</span>
                      )}
                      {bank.isActive ? (
                        <span className="badge badge-info">Active</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{bank.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{bank.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{bank.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <span>License: {bank.licenseNumber}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-semibold">Address:</span>{' '}
                        {bank.address}
                      </div>
                    </div>

                    {/* Blood Inventory Summary */}
                    {bank.inventory && bank.inventory.length > 0 && (
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Blood Inventory:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {bank.inventory.map((item) => (
                            <div
                              key={item.bloodType}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                item.quantity > 0
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.bloodType}: {item.quantity} units
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Registered on{' '}
                      {new Date(bank.createdAt).toLocaleDateString()}
                    </div>
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

export default ManageBloodBanks;