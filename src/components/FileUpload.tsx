"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";


const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setApiResponse(null); // Reset previous response
      setError(null); // Reset error
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      setApiResponse(null);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setApiResponse(null);
    setError(null);

    try {
      // Convert file to Base64
      const base64String = await toBase64(selectedFile);

      // API Request Body
      const requestBody = {
        doc_base64: base64String,
        req_id: uuidv4(),
        isIOS: false,
        doc_type: "image", // Change to "video" if uploading a video
        orientation: 0,
      };

      // Use Next.js API as proxy
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        setApiResponse(data.result); // Display Real/Fake
      } else {
        setError(data.error_message || "Failed to process file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("An error occurred while processing the file.");
    } finally {
      setLoading(false);
    }
  };

  // Function to convert file to Base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(",")[1] || "");
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white shadow-xl rounded-2xl w-full max-w-xl mx-auto mt-12">
      <div
        className="border-2 border-dashed border-gray-300 p-10 w-full text-center rounded-lg transition hover:border-blue-400 cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="text-gray-500 mb-2">Drag & drop your file here</p>
        <label className="text-blue-600 font-medium underline cursor-pointer">
          or click to browse
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {selectedFile && (
        <div className="text-gray-700 text-sm">
          <span className="font-medium">Selected File:</span> {selectedFile.name}
        </div>
      )}

      {selectedFile && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Analyze"}
        </button>
      )}

      {/* Show Result */}
      {apiResponse && (
        <div
          className={`w-full text-center py-4 px-6 rounded-lg font-semibold shadow-md transition ${
            apiResponse === "real"
              ? "bg-green-50 text-green-700 border border-green-300"
              : "bg-red-50 text-red-700 border border-red-300"
          }`}
        >
          {apiResponse === "real" ? "✅ The media appears to be authentic." : "⚠️ Warning: This may be a deepfake!"}
        </div>
      )}

      {/* Show Error */}
      {error && (
        <div className="text-red-600 text-sm mt-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
