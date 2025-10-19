import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, AlertCircle, Settings, RefreshCw } from "lucide-react";

const QRScanner = ({ onScanSuccess, onClose, isOpen }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [cameraList, setCameraList] = useState([]);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const [processing, setProcessing] = useState(false); // Prevent duplicate scans
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const lastScannedRef = useRef(null); // Track last scanned code

  // Check if we're in a secure context on mount
  useEffect(() => {
    // Check for secure context and camera API support
    const checkSecureContext = () => {
      const isSecure = window.isSecureContext !== false; // undefined means true for localhost
      const hasMediaDevices = !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      );

      setIsSecureContext(hasMediaDevices);

      if (!hasMediaDevices && !isSecure) {
        console.warn("Camera API not available. Not in secure context.");
      }
    };

    checkSecureContext();
  }, []);

  useEffect(() => {
    // Don't auto-start, let user click button
    // This ensures better permission handling
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const requestCameraPermission = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          "Camera API not supported. Please use a modern browser (Chrome, Safari, Firefox) or access via HTTPS."
        );
        return false;
      }

      // Request camera permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      // Permission granted, stop test stream
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Camera permission error:", error);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setPermissionDenied(true);
        setError(
          "Camera permission denied. Click 'Allow' when your browser asks for camera access."
        );
      } else if (error.name === "NotFoundError") {
        setError(
          "No camera found on this device. Please use a device with a camera."
        );
      } else if (error.name === "NotReadableError") {
        setError(
          "Camera is already in use by another app. Please close other apps using the camera."
        );
      } else if (error.name === "TypeError") {
        setError(
          "Camera API not available. Please ensure you're using HTTPS or a modern browser."
        );
      } else {
        setError(`Camera error: ${error.message || "Unable to access camera"}`);
      }
      return false;
    }
  };

  const startScanner = async () => {
    try {
      setError(null);
      setPermissionDenied(false);

      // Check if scanner element exists
      if (!scannerRef.current) {
        setError("Scanner element not found. Please refresh the page.");
        return;
      }

      // First, request camera permission explicitly
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return; // Error already set in requestCameraPermission
      }

      // Initialize scanner
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();
      setCameraList(cameras);

      if (cameras && cameras.length > 0) {
        // Prefer back camera on mobile
        const backCamera = cameras.find(
          (camera) =>
            camera.label.toLowerCase().includes("back") ||
            camera.label.toLowerCase().includes("rear") ||
            camera.label.toLowerCase().includes("environment")
        );
        const cameraId = backCamera ? backCamera.id : cameras[0].id;

        // Start scanning with better config
        await html5QrCodeRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [0], // QR_CODE
          },
          (decodedText) => {
            // Success callback
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Error callback (ignore - occurs frequently during scanning)
          }
        );

        setScanning(true);
      } else {
        setError("No cameras found. Please check camera permissions.");
      }
    } catch (err) {
      console.error("Scanner error:", err);

      // Provide specific error messages
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermissionDenied(true);
        setError(
          "Camera permission denied. Please allow camera access in your browser settings."
        );
      } else if (err.name === "NotFoundError") {
        setError("No camera detected on this device.");
      } else if (err.name === "NotReadableError") {
        setError("Camera is being used by another application.");
      } else if (err.name === "OverconstrainedError") {
        setError("Camera constraints not supported.");
      } else {
        setError(
          err.message || "Unable to access camera. Please check permissions."
        );
      }
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current && scanning) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        setScanning(false);
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  const handleScanSuccess = async (decodedText) => {
    // Prevent multiple scans - only process if currently scanning and not already processing
    if (!scanning || processing) {
      return;
    }

    // Check if this is a duplicate scan (same code within 2 seconds)
    const now = Date.now();
    if (
      lastScannedRef.current?.code === decodedText &&
      now - lastScannedRef.current?.timestamp < 2000
    ) {
      return; // Ignore duplicate scan
    }

    try {
      // Mark as processing and update last scanned
      setProcessing(true);
      lastScannedRef.current = { code: decodedText, timestamp: now };

      // Stop scanner immediately after successful scan
      setScanning(false); // Set state immediately to prevent re-entry
      await stopScanner();

      // Parse QR data
      const qrData = JSON.parse(decodedText);

      // Call parent callback
      if (onScanSuccess) {
        await onScanSuccess(qrData);
      }
    } catch (err) {
      console.error("Error processing QR code:", err);
      setError("Invalid QR code format");
      setScanning(false);
      // Don't auto-restart on error
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = async () => {
    await stopScanner();
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="h-6 w-6 text-white" />
            <h3 className="text-xl font-bold text-white">Scan QR Code</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-red-800 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-6">
          {/* Secure context warning */}
          {!isSecureContext && !error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2 text-yellow-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold mb-2">Camera API Not Available</p>
                  <p className="mb-2">
                    Your browser doesn't support camera access from this URL.
                  </p>
                  <p className="font-medium">Try these solutions:</p>
                  <ol className="list-decimal list-inside space-y-1 mt-1">
                    <li>Use Chrome or Safari (latest version)</li>
                    <li>
                      Access via{" "}
                      <code className="bg-yellow-100 px-1 rounded">
                        localhost
                      </code>{" "}
                      on same device
                    </li>
                    <li>Check if camera works in other apps</li>
                    <li>Update your browser to the latest version</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{error}</p>

                  {/* Show instructions if permission denied */}
                  {permissionDenied && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold text-red-900">
                        How to enable camera:
                      </p>
                      <ol className="text-xs text-red-700 space-y-1 list-decimal list-inside">
                        <li>
                          Click the lock/info icon in your browser's address bar
                        </li>
                        <li>Find "Camera" permissions</li>
                        <li>Select "Allow" or "Ask"</li>
                        <li>Click "Retry" button below</li>
                      </ol>
                    </div>
                  )}

                  {/* Retry button */}
                  {permissionDenied && (
                    <button
                      onClick={startScanner}
                      className="mt-3 flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Retry Camera Access</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* QR Reader Container */}
          <div className="relative">
            <div
              id="qr-reader"
              ref={scannerRef}
              className="rounded-lg overflow-hidden"
            ></div>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center">
            {scanning ? (
              <>
                <p className="text-sm text-gray-600 font-medium">
                  📷 Position the QR code within the frame
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  The scanner will automatically detect and process the code
                </p>
                {cameraList.length > 1 && (
                  <p className="text-xs text-blue-600 mt-2">
                    Using: {cameraList.find((c) => c.id)?.label || "Camera"}
                  </p>
                )}
              </>
            ) : !error ? (
              <div className="space-y-3 py-4">
                <Camera className="h-16 w-16 text-blue-600 mx-auto" />
                <p className="text-sm text-gray-700 font-medium">
                  Ready to scan QR code
                </p>
                <p className="text-xs text-gray-500">
                  Click the button below to start your camera
                </p>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2">
            {!scanning && (
              <button
                onClick={startScanner}
                disabled={scanning}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="h-5 w-5" />
                <span>Start Camera & Scan</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
