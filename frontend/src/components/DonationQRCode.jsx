import { useState } from "react";
import { useSelector } from "react-redux";
import QRCode from "react-qr-code";
import { QrCode, Download, X } from "lucide-react";
import toast from "react-hot-toast";

const DonationQRCode = () => {
  const { user } = useSelector((state) => state.auth);
  const [showQRModal, setShowQRModal] = useState(false);

  const generateQRData = () => {
    return JSON.stringify({
      type: "blood-donation",
      userId: user._id,
      userName: user.name,
      bloodType: user.bloodType,
      phone: user.phone,
      email: user.email,
      timestamp: new Date().toISOString(),
    });
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("donation-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `blood-donation-qr-${user.name.replace(/\s+/g, "-")}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success("QR code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <>
      <button
        onClick={() => setShowQRModal(true)}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
      >
        <QrCode className="h-5 w-5" />
        <span>My Donation QR Code</span>
      </button>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Your Donation QR Code
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
              Show this QR code at any blood bank to verify your identity and record your donation
            </p>

            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-4 flex justify-center">
              <QRCode
                id="donation-qr-code"
                value={generateQRData()}
                size={220}
                level="H"
              />
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-800 font-medium">Name:</span>
                <span className="text-purple-900 font-bold">{user.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-purple-800 font-medium">Blood Type:</span>
                <span className="text-purple-900 font-bold text-lg">{user.bloodType}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-purple-800 font-medium">Total Donations:</span>
                <span className="text-purple-900 font-bold">{user.totalDonations || 0}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadQRCode}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              💡 Save this QR code to your phone for easy access at blood banks
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationQRCode;
