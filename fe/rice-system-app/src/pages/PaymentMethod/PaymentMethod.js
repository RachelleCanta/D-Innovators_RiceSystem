import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentMethod.css';
import gcashQrCode from '../../assets/gcash_qr.png';
import mayaQrCode from '../../assets/maya_qr.png'; 

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [referenceNo, setReferenceNo] = useState('');

  const handleProceed = () => {
    // Check if receipt image is uploaded and reference number is entered
    if (!receiptImage) {
      alert("Please upload a picture of your receipt.");
      return;
    }
    if (!referenceNo) {
      alert("Please enter the reference number.");
      return;
    }
    navigate('/order-confirmation', { state: { ...location.state, referenceNo } });
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

  const handleReceiptUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceiptImage(URL.createObjectURL(file));
    }
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

      <p>Please scan or save the QR code before you proceed with the order.</p>

      <div className="file-input-container">
        <input type="file" className="file-input" id="receipt-upload" accept="image/*" onChange={handleReceiptUpload} />
        <label htmlFor="receipt-upload" className="choose-file-button">Upload Receipt</label>
      </div>

      <div className="reference-no">
        <label htmlFor="reference-no">Reference No:</label>
        <input type="text" id="reference-no" value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} />
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

      {receiptImage && (
        <div className="receipt-preview">
          <h3>Receipt Preview:</h3>
          <img src={receiptImage} alt="Receipt Preview" />
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
