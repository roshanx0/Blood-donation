import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers } from '../../redux/slices/adminSlice';
import { Search, User, Mail, Phone, MapPin, Droplet } from 'lucide-react';
import Card from '../../components/Card';
import BloodTypeBadge from '../../components/BloodTypeBadge';
import Loader from '../../components/Loader';

const ManageUsers = () => {
  const { allUsers, isLoading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBloodType =
      !filterBloodType || user.bloodType === filterBloodType;

    const matchesCity =
      !filterCity ||
      user.city.toLowerCase().includes(filterCity.toLowerCase());

    return matchesSearch && matchesBloodType && matchesCity;
  });

  // Get unique cities
  const cities = [...new Set(allUsers.map((user) => user.city))].sort();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage Users
          </h1>
          <p className="text-gray-600">
            View and manage all registered blood donors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {allUsers.length}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-full">
                <Droplet className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {bloodTypes.length}
            </div>
            <div className="text-sm text-gray-600">Blood Types</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {cities.length}
            </div>
            <div className="text-sm text-gray-600">Cities</div>
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
                placeholder="Search by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bloodType" className="label">
                  Filter by Blood Type
                </label>
                <select
                  id="bloodType"
                  value={filterBloodType}
                  onChange={(e) => setFilterBloodType(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Blood Types</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            {/* Clear Filters */}
            {(searchTerm || filterBloodType || filterCity) && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBloodType('');
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
            Showing <strong>{filteredUsers.length}</strong> of{' '}
            <strong>{allUsers.length}</strong> user(s)
          </p>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-4">
              <User className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Users Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search criteria
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <BloodTypeBadge bloodType={user.bloodType} size="lg" />

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {user.name}
                        </h3>
                        {user.role === 'admin' && (
                          <span className="badge badge-danger">Admin</span>
                        )}
                        {user.isActive ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{user.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Droplet className="h-4 w-4 flex-shrink-0" />
                          <span>Blood Type: {user.bloodType}</span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Registered on{' '}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
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

export default ManageUsers;