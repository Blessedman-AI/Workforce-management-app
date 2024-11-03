import { useState } from 'react';
import { X as XIcon, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const ReplacementRequestPreview = ({
  isOpen,
  onClose,
  requests = [],
  onRequestClick,
  activeTab = 'received',
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const renderReceivedRequest = (request, index) => (
    <div
      key={index}
      className="mb-3 cursor-pointer hover:bg-gray-50 rounded-lg"
      onClick={() => onRequestClick(request)}
    >
      <div className="p-3 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300 text-sm font-semibold">
            {request.requesterInitials}
          </div>
          <span className="text-sm text-gray-600">
            {request.requesterName} is looking for a replacement
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
        </div>

        <div className="bg-[#81a8cc] rounded-lg p-3">
          <div className="text-sm text-white font-medium mb-1">
            {request.shiftName}
          </div>
          <div className="text-sm text-white-1 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {format(request.shiftStart, 'E, MMM d, ha')} -{' '}
            {format(request.shiftEnd, 'ha')} ({request.shiftDuration}h)
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Pending response</span>
        </div>
      </div>
    </div>
  );

  const renderSentRequest = (request, index) => (
    <div
      key={index}
      className="mb-3 cursor-pointer hover:bg-gray-50 rounded-lg"
      onClick={() => onRequestClick(request)}
    >
      <div className="p-3 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300 text-sm font-semibold">
            {request.recipientInitials || '??'}
          </div>
          <span className="text-sm text-gray-600">
            Sent to {request.recipientName || 'All Available Staff'}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-sm font-medium mb-1">{request.shiftName}</div>
          <div className="text-sm text-gray-600 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {format(request.shiftStart, 'E, MMM d, ha')} -{' '}
            {format(request.shiftEnd, 'ha')} ({request.shiftDuration}h)
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Awaiting responses</span>
          </div>
          <span className="text-sm text-gray-500">
            {request.responseCount || 0} responses
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 bg-black/60 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } z-[1]`}
    >
      <div
        className={`fixed  top-0 right-0 h-full bg-white z-[2]
        shadow-lg transition-transform duration-500 ease-in-out 
        w-[500px] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-subheading-2 ">Replacement requests</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
            aria-label="Close preview"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              currentTab === 'received'
                ? 'text-purple-1 border-b-2 border-purple-1'
                : 'text-gray-500'
            }`}
            onClick={() => setCurrentTab('received')}
          >
            Received
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              currentTab === 'sent'
                ? 'text-purple-1 border-b-2 border-purple-1'
                : 'text-gray-500'
            }`}
            onClick={() => setCurrentTab('sent')}
          >
            Sent by me
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Pending</h3>
            {requests.map((request, index) =>
              currentTab === 'received'
                ? renderReceivedRequest(request, index)
                : renderSentRequest(request, index)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplacementRequestPreview;
