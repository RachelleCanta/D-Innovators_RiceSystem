import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentMethod.css';
import gcashQrCode from '../../assets/gcash_qr.png';
import mayaQrCode from '../../assets/maya_qr.png'; 

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedQrCode, setSelectedQrCode] = useState(null);

  const handleProceed = () => {
    navigate('/order-confirmation', { state: location.state });
  };

  const handleQrClick = (qrCode) => {
    setSelectedQrCode(qrCode);
  };

  const handleModalClose = () => {
    setSelectedQrCode(null);
  };

  const handleSaveQrCode = () => {
    const link = document.createElement('a');
    link.href = selectedQrCode;
    link.download = 'QR_Code.png';
    link.click();
  };

  return (
    <div className="payment-method">
      <h2>Payment Method</h2>
      <div className="qr-code-container">
        <div className="qr-code" onClick={() => handleQrClick(gcashQrCode)}>
          <h3>GCASH</h3>
          <img src={gcashQrCode} alt="GCASH QR Code" />
        </div>
        <div className="qr-code" onClick={() => handleQrClick(mayaQrCode)}>
          <h3>MAYA</h3>
          <img src={mayaQrCode} alt="MAYA QR Code" />
        </div>
      </div>
      
      <p>Please scan or save the QR code before you proceed with order</p>
      <div className="cod-payment">
        <h2>Cash on Delivery</h2>
        <p></p>
        <p>PHONE NUMBER: +639776214501</p>
      </div>
      <button onClick={handleProceed}>Proceed with Order</button>
     
      {selectedQrCode && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <img src={selectedQrCode} alt="Selected QR Code" />
            <button onClick={handleSaveQrCode}>Save QR Code</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
