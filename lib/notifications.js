import moment from 'moment';

// In your backend
export const getNotification = ({
  firstName,
  firstNameAvatarColour,
  status,
  action,
}) => {
  return {
    data: {
      firstName,
      firstNameAvatarColour,
      status: status ? status?.toLowerCase() : '',
      action,
    },
    plainText: `${firstName} ${
      status ? status.toLowerCase() + ' ' : ''
    }${action}`,
  };
};
