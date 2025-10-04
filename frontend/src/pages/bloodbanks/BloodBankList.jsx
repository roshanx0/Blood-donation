import { useEffect, useState } from 'react';
import { Search, Building2, Phone, Mail, MapPin, Droplet } from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import axios from '../../utils/axios';

const BloodBankList = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  const fetchBloodBanks = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (selectedCity) params.city = selectedCity;
      if (selectedBloodType) params.bloodType = selectedBloodType;

      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`/bloodbanks?${queryString}`);
      setBloodBanks(response.data.bloodBanks);
    } catch (error) {
      console.error('Error fetching blood banks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [selectedCity, selectedBloodType]);

  const filteredBloodBanks = bloodBanks.filter((bank) => {
    const matchesSearch =
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const cities = [...new Set(bloodBanks.map((bank) => bank.city))].sort();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Blood Banks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find blood banks in your area with real-time inventory
          </p>
        </div>

        <Card className="mb-8">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="label">
                  Filter by City
                </label>
                <select
                  id="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
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

              <div>
                <label htmlFor="bloodType" className="label">
                  Filter by Blood Type Availability
                </label>
                <select
                  id="bloodType"
                  value={selectedBloodType}
                  onChange={(e) => setSelectedBloodType(e.target.value)}
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
            </div>

            {(selectedCity || selectedBloodType || searchTerm) && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCity('');
                    setSelectedBloodType('');
                    setSearchTerm('');
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </Card>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <strong>{filteredBloodBanks.length}</strong> blood bank(s)
          </p>
        </div>

        {filteredBloodBanks.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Building2 className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Blood Banks Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search criteria
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredBloodBanks.map((bank) => (
              <Card key={bank._id} className="hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-full">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {bank.name}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>
                              {bank.address}, {bank.city}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <a
                              href={`tel:${bank.phone}`}
                              className="hover:text-red-600 dark:hover:text-red-400"
                            >
                              {bank.phone}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 flex-shrink-0" />
                            <a
                              href={`mailto:${bank.email}`}
                              className="hover:text-red-600 dark:hover:text-red-400"
                            >
                              {bank.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-dark-700 pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Droplet className="h-5 w-5 text-red-600 dark:text-red-500" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Available Blood Inventory
                        </h4>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {bank.inventory?.map((item) => (
                          <div
                            key={item.bloodType}
                            className={`text-center p-3 rounded-lg border-2 transition-all ${
                              item.quantity > 0
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            }`}
                          >
                            <div className="font-bold text-lg text-gray-900 dark:text-white">
                              {item.bloodType}
                            </div>
                            <div
                              className={`text-sm font-semibold ${
                                item.quantity > 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {item.quantity > 0
                                ? `${item.quantity} units`
                                : 'Out of stock'}
                            </div>
                          </div>
                        ))}
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

export default BloodBankList;