import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-24 px-4 text-center">
        <h1 className="text-4xl font-semibold text-gray-800">
          Deepfake Detection Tool
        </h1>
        <p className="text-gray-500 mt-3 max-w-xl">
          Upload a media file to analyze and determine if it’s real or AI-generated.
          We support most of the common formats.
        </p>
        <div className="mt-8 w-full max-w-md">
          <FileUpload />
        </div>
      </div>
    </main>
  );
}