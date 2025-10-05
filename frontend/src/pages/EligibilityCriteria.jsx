import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Heart,
  Scale,
  Calendar,
  Activity,
  Clock,
  Thermometer,
  Droplet,
  Shield,
} from "lucide-react";
import Card from "../components/Card";

const EligibilityCriteria = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const eligibleCriteria = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Age",
      description: "Between 18 to 65 years old",
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: "Weight",
      description: "Minimum 50 kg (110 lbs)",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Health",
      description: "Good overall health condition",
    },
    {
      icon: <Droplet className="h-5 w-5" />,
      title: "Hemoglobin",
      description: "Minimum 12.5 g/dL for women, 13.0 g/dL for men",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Donation Gap",
      description: "3 months since last donation",
    },
    {
      icon: <Thermometer className="h-5 w-5" />,
      title: "Body Temperature",
      description: "Normal body temperature (98.6°F / 37°C)",
    },
  ];

  const notEligible = [
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Pregnancy & Breastfeeding",
      description: "Pregnant women or mothers who are breastfeeding",
    },
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Recent Illness",
      description: "Had cold, flu, or infection in the last 2 weeks",
    },
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Recent Surgery",
      description: "Had major surgery in the last 6 months",
    },
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Chronic Diseases",
      description:
        "Heart disease, diabetes, hypertension (uncontrolled), cancer",
    },
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Blood-borne Diseases",
      description:
        "HIV, Hepatitis B/C, Malaria, or other transmissible diseases",
    },
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Recent Tattoo/Piercing",
      description: "Got a tattoo or piercing in the last 3 months",
    },
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Certain Medications",
      description: "Taking antibiotics, blood thinners, or immunosuppressants",
    },
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Alcohol/Substance Use",
      description: "Under influence of alcohol or drugs",
    },
  ];

  const beforeDonation = [
    "Get a good night's sleep (at least 7-8 hours)",
    "Eat a healthy meal before donating",
    "Drink plenty of water (at least 3-4 glasses)",
    "Avoid fatty foods before donation",
    "Bring a valid ID proof",
    "Wear comfortable clothing with short sleeves",
  ];

  const afterDonation = [
    "Rest for 10-15 minutes after donation",
    "Drink plenty of fluids for the next 24 hours",
    "Avoid heavy exercise for 24 hours",
    "Keep the bandage on for at least 4 hours",
    "Eat iron-rich foods to replenish blood",
    "If you feel dizzy, sit or lie down immediately",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 rounded-2xl shadow-md">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blood Donation Eligibility Criteria
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Check if you meet the requirements to become a blood donor and save
            lives
          </p>
        </div>

        {/* Eligible Criteria */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              You Can Donate If You Meet These Criteria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleCriteria.map((item, index) => (
              <Card
                key={index}
                className="bg-green-50 border-2 border-green-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Not Eligible */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              You Cannot Donate If You Have
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notEligible.map((item, index) => (
              <Card key={index} className="bg-red-50 border-2 border-red-200">
                <div className="flex items-start space-x-3">
                  <div className="text-red-600 flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Before & After Donation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Before Donation */}
          <Card className="bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Before Donation
              </h2>
            </div>

            <ul className="space-y-3">
              {beforeDonation.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* After Donation */}
          <Card className="bg-purple-50 border-2 border-purple-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                After Donation
              </h2>
            </div>

            <ul className="space-y-3">
              {afterDonation.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Important Note */}
        <Card className="bg-yellow-50 border-2 border-yellow-300 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                Important Notice
              </h3>
              <p className="text-gray-800 leading-relaxed mb-3">
                This information is for general guidance only. The final
                decision on eligibility will be made by medical professionals at
                the blood donation center after a thorough screening and health
                check.
              </p>
              <p className="text-gray-800 font-semibold">
                Always consult with healthcare providers if you have any
                specific health concerns before donating blood.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Save Lives?</h3>
            <p className="text-red-100 mb-6">
              If you meet the eligibility criteria, register now and become a
              lifesaver
            </p>
            <Link
              to="/register/user"
              className="inline-flex items-center px-8 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all shadow-lg"
            >
              Register as Donor
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EligibilityCriteria;
