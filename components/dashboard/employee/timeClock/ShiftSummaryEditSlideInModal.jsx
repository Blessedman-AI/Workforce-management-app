import React, { useEffect, useState } from 'react';
import { X as XIcon, Save } from 'lucide-react';

const ShiftSummaryEditSlideInModal = ({
  isOpen,
  onClose,
  onSendForApproval,
  shiftTitles,
  initialData = {
    shiftDate,
    clockIn,
    clockOut,
    shiftName,
    totalHours,
    note,
  },
}) => {
  const [formData, setFormData] = useState(initialData);

  // Function to format the date to 'YYYY-MM-DD' format
  const formatDateToInputValue = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert initial date format when the component loads
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      shiftDate: formatDateToInputValue(prevData.shiftDate),
    }));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Remove handleOverlayClick since we'll handle it differently
  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  if (!isOpen) return null;

  return (
    // <div className={`fixed z-[20] inset-0 ${isOpen ? '' : 'hidden'}`}>
    <div className={`fixed z-[20] inset-0 ${isOpen ? '' : 'hidden'}`}>
      {/* Overlay for closing modal when clicking outside */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose} // Closes modal when clicking on the overlay only
      />

      {/* Slide-in Panel */}
      <div
        onClick={handleModalClick} // Prevents modal from closing on inner clicks
        className={`absolute rounded-xl right-0 top-0 h-full w-full max-w-[550px] 
        bg-white shadow-xl transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Main container with max height */}
        <div className="flex flex-col min-h-full max-h-screen">
          {/* Header section - fixed height */}
          <div className="border-b flex-none px-6 py-4">
            <div className="flex justify-between items-center ">
              <h2 className="text-subheading-2">Edit a shift request</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <form
            onSubmit={onSendForApproval}
            className="flex flex-col flex-1 px-6 py-4 overflow-x-auto"
          >
            {/* Form content with flex-grow */}
            <div className="flex flex-col flex-grow">
              <div className="flex">
                <div className="flex-[0.70]">
                  <div className="flex items-center space-x-6 mb-4">
                    <label htmlFor="project" className="">
                      Job:
                    </label>
                    <select
                      id="Job"
                      value={formData.shiftName}
                      onChange={(e) =>
                        setFormData({ ...formData, shiftName: e.target.value })
                      }
                      className=" bg-white border rounded-md text-gray-800 px-4 py-2"
                    >
                      <option value={formData.shiftName}>
                        {formData.shiftName}
                      </option>
                      {shiftTitles &&
                        shiftTitles
                          .filter((title) => title !== formData.shiftName)
                          .map((title, index) => (
                            <option key={index} value={title}>
                              {title}
                            </option>
                          ))}
                    </select>
                  </div>

                  {/* Date Field */}
                  <div className="flex items-center mb-4 space-x-2">
                    <label htmlFor="startDate" className="">
                      Starts:
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      name="shiftDate"
                      value={formData.shiftDate}
                      onChange={handleChange}
                      className="bg-white border rounded-md text-gray-800 px-4 py-2 "
                    />

                    {/* Time Fields */}
                    <label className="space-x-2 ">At:</label>
                    <input
                      id="startTime"
                      type="text"
                      name="clockIn"
                      value={formData.clockIn}
                      onChange={handleChange}
                      className="bg-white w-[18%] items-center justify-center border inline-flex rounded-md
           text-gray-800 pl-3 py-2"
                    />
                  </div>

                  <div className="flex items-center mb-4">
                    <label htmlFor="endDate" className="mr-4">
                      Ends:
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      name="shiftDate"
                      value={formData.shiftDate}
                      onChange={handleChange}
                      className="bg-white border rounded-md text-gray-800 px-4 py-2 "
                    />
                    <span className="mx-2">At:</span>
                    <input
                      id="endTime"
                      type="text"
                      name="clockOut"
                      value={formData.clockOut}
                      onChange={handleChange}
                      className="bg-white w-[18%] text-gray-800 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div
                  className="flex flex-col flex-[0.30] bg-purple-2 rounded-lg
           items-center justify-center"
                >
                  <div className="text-purple-1 text-[18px]">Total hours</div>
                  <div className="text-purple-1 font-bold text-[30px]">
                    {formData.totalHours}
                  </div>
                </div>
              </div>

              {/* Note Field */}
              <div className="my-6 border-t border-t-gray-400">
                <label htmlFor="note" className="block my-4 text-subheading-2">
                  Shift attachments
                </label>
                <div className="flex flex-col items-start justify-start">
                  <div className="mb-2"> 📝Note</div>
                  <input
                    id="note"
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={4}
                    className="bg-white w-full text-gray-800 px-4 py-2 border rounded-md flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Button aligned at the bottom */}
            <div className="flex  mt-6">
              <button type="submit" className="button-primary">
                Send for approval
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShiftSummaryEditSlideInModal;
