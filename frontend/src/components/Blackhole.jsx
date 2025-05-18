import { useState } from 'react';

export default function Blackhole() {
  const [inputText, setInputText] = useState('');
  const [analyzedText, setAnalyzedText] = useState([]);
  const [detailedAnalysis, setDetailedAnalysis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contentFilter, setContentFilter] = useState('adult');

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const analyzeText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:5004/api/hate-n-offensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length >= 2) {
        setAnalyzedText(data[0]);
        setDetailedAnalysis(data[1]);
      } else {
        setAnalyzedText(data);
        setDetailedAnalysis([]);
      }
    } catch (err) {
      setError(`Error: ${err.message}. The backend service might not be running.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getReconstructedText = () => {
    return detailedAnalysis.map((sentenceEntries) => {
      const version = sentenceEntries.find(entry => entry[contentFilter]);
      return version ? version[contentFilter] : '';
    });
  };

  const copyToClipboard = () => {
    const textToCopy = getReconstructedText().join(' ');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setInputText('');
    setAnalyzedText([]);
    setDetailedAnalysis([]);
    setError(null);
  };

  const getHighlightColor = (level) => {
    switch (level) {
      case 0: return 'bg-red-600 text-white';
      case 1: return 'bg-yellow-400';
      case 2: return 'bg-green-200';
      default: return 'bg-green-200';
    }
  };

  const getStats = () => {
    if (!analyzedText.length) return null;
    
    const counts = {0: 0, 1: 0, 2: 0};
    analyzedText.forEach(item => {
      counts[item[1]] = (counts[item[1]] || 0) + 1;
    });
    
    const total = analyzedText.length;
    return {
      safe: {count: counts[2], percent: Math.round((counts[2] / total) * 100)},
      moderate: {count: counts[1], percent: Math.round((counts[1] / total) * 100)},
      offensive: {count: counts[0], percent: Math.round((counts[0] / total) * 100)}
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h1 className="text-3xl font-bold">Content Analysis Tool</h1>
          {/* <p className="mt-2 text-blue-100">Analyze text for potentially harmful content with our advanced highlighting system</p> */}
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Enter text to analyze:
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg h-52 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={inputText}
              onChange={handleTextChange}
              placeholder="Enter multiple paragraphs of text here..."
            />
            
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
                onClick={analyzeText}
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : 'Analyze Text'}
              </button>
              
              <button
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                onClick={clearText}
              >
                Clear
              </button>
            </div>
          </div>
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {analyzedText.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Content filter:</label>
                    <select
                      className="text-sm px-2 py-1 border border-gray-300 rounded bg-white focus:ring-blue-500 focus:border-blue-500"
                      value={contentFilter}
                      onChange={(e) => setContentFilter(e.target.value)}
                    >
                      <option value="child">Child</option>
                      <option value="teen">Teen</option>
                      <option value="adult">Adult</option>
                    </select>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition duration-200 flex items-center"
                  >
                    {copied ? 'Copied!' : 'Copy Text'}
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {stats && (
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-700">{stats.safe.percent}%</div>
                    <div className="text-sm text-green-800">Safe Content ({stats.safe.count})</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="text-2xl font-bold text-yellow-700">{stats.moderate.percent}%</div>
                    <div className="text-sm text-yellow-800">Moderate ({stats.moderate.count})</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="text-2xl font-bold text-red-700">{stats.offensive.percent}%</div>
                    <div className="text-sm text-red-800">Offensive ({stats.offensive.count})</div>
                  </div>
                </div>
              )}
              
              <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                <div className="mb-4 flex gap-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-200 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Safe</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Moderate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Highly offensive</span>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-gray-100 max-h-96 overflow-y-auto">
                  {getReconstructedText().map((text, index) => {
                    const originalClassification = analyzedText[index][1];
                    return (
                      <span
                        key={index}
                        className={`${getHighlightColor(originalClassification)} p-1 rounded mr-1 inline-block mb-1.5 text-sm`}
                      >
                        {text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
          Content Analysis Tool - Analyze text for potentially harmful content
        </div>
      </div>
    </div>
  );
}