import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function Task1() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError(null);
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setOcrText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await fetch('http://127.0.0.1:5004/api/ocr', {
        method: 'POST',
        body: formData,
      }, {withCredentials: true});
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setOcrText(data.ocr_text);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Error uploading image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Image OCR Tool</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept="image/*"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </label>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {selectedFile && (
            <div className="text-sm text-gray-500">
              Selected: {selectedFile.name}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${!selectedFile || isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </span>
            ) : (
              "Extract Text"
            )}
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Preview */}
        {preview && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              Image Preview
            </h2>
            <div className="border rounded-md overflow-hidden">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          </div>
        )}
        
        {/* OCR Results */}
        {(ocrText || isLoading) && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Extracted Text
            </h2>
            <div className="border rounded-md p-4 bg-gray-50 h-64 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm">{ocrText}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}