import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Alert = (props) => {
  const alerts = useSelector((state) => state.alert);

  const renderAlert = () => {
    if (alerts !== null && alerts.length > 0) {
      return (
        <div className="alert-wrapper">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert alert-${alert.alertType}`}>
              {alert.msg}
            </div>
          ))}
        </div>
      );
    }
  };
  return renderAlert();
};

export default Alert;
