import { Link } from 'react-router-dom';
import { Droplet, Heart, Users, Building2, Shield, Clock } from 'lucide-react';
import Card from '../components/Card';

const Home = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Save Lives',
      description: 'Your blood donation can save up to three lives. Be a hero today.',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Connect with Donors',
      description: 'Find blood donors in your area instantly when you need them most.',
      gradient: 'from-red-600 to-red-700',
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: 'Blood Bank Network',
      description: 'Access to verified blood banks with real-time inventory updates.',
      gradient: 'from-red-700 to-red-800',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Verified',
      description: 'All users and blood banks are verified for your safety and trust.',
      gradient: 'from-pink-600 to-red-600',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Quick Response',
      description: 'Get instant notifications for blood requests in your area.',
      gradient: 'from-red-800 to-red-900',
    },
    {
      icon: <Droplet className="h-8 w-8" />,
      title: 'Track Donations',
      description: 'Keep track of your donations and make a real difference.',
      gradient: 'from-red-500 to-red-700',
    },
  ];

 return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-white dark:bg-white/10 bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
              <Droplet className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Every Drop Counts
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100 dark:text-red-200 max-w-3xl mx-auto">
            Join our community of lifesavers. Donate blood, save lives, and make a
            difference in someone's life today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register/user"
              className="px-8 py-4 bg-white text-red-600 rounded-lg font-bold text-lg hover:bg-red-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Register as Donor
            </Link>
            <Link
              to="/register/bloodbank"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-red-600 transition-all"
            >
              Register Blood Bank
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-red-50 to-white dark:from-dark-800 dark:to-dark-900 border border-red-100 dark:border-red-900/30">
              <div className="text-5xl font-bold text-red-600 dark:text-red-500 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold">Registered Donors</div>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-red-50 to-white dark:from-dark-800 dark:to-dark-900 border border-red-100 dark:border-red-900/30">
              <div className="text-5xl font-bold text-red-600 dark:text-red-500 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold">Blood Banks</div>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-red-50 to-white dark:from-dark-800 dark:to-dark-900 border border-red-100 dark:border-red-900/30">
              <div className="text-5xl font-bold text-red-600 dark:text-red-500 mb-2">25,000+</div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold">Lives Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BloodLife?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We make blood donation and request process simple, secure, and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} text-white mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple steps to start saving lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Register', desc: 'Create your account as a donor or blood bank' },
              { step: '02', title: 'Get Verified', desc: 'Complete your profile and get verified' },
              { step: '03', title: 'Connect', desc: 'Find blood requests or donors in your area' },
              { step: '04', title: 'Save Lives', desc: 'Donate blood and make a difference' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-700 dark:from-red-600 dark:to-red-800 text-white text-2xl font-bold mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 dark:from-red-700 dark:to-red-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-red-100 dark:text-red-200">
            Join thousands of donors who are saving lives every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/user"
              className="px-8 py-4 bg-white text-red-600 rounded-lg font-bold text-lg hover:bg-red-50 transition-all shadow-xl transform hover:-translate-y-1"
            >
              Get Started Now
            </Link>
            <Link
              to="/login/user"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-red-600 transition-all"
            >
              Already a Member?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;