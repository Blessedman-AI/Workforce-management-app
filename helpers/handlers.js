import { useCallback } from 'react';
import { format } from 'date-fns';

export const handleSelectSlot = useCallback(
  (slotInfo) => {
    const selectedResource = resources.find(
      (r) => r.id === slotInfo.resourceId
    );
    setSelectedSlot(slotInfo);
    setFormData({
      ...formData,
      date: format(slotInfo.start, 'yyyy-MM-dd'),
      startTime: format(slotInfo.start, 'HH:mm'),
      endTime: format(slotInfo.end, 'HH:mm'),
      employee: selectedResource ? selectedResource.title : '',
    });
    setIsModalOpen(true);
  },
  [formData, resources]
);
