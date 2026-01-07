import { X, Download, Copy } from 'lucide-react';

export default function QRCodeModal({ selectedQR, onClose, onDownload, onCopy }) {
  if (!selectedQR) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            QR Code
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition touch-target"
            aria-label="Close QR code"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center">
          <img
            src={selectedQR.qrDataUrl}
            alt="QR Code"
            className="w-full h-auto max-w-[300px]"
          />
        </div>
        
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 break-all mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {selectedQR.url}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onDownload}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 touch-target"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => onCopy(selectedQR.url, selectedQR.shortCode)}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 touch-target"
          >
            <Copy className="w-4 h-4" />
            Copy URL
          </button>
        </div>
      </div>
    </div>
  );
}