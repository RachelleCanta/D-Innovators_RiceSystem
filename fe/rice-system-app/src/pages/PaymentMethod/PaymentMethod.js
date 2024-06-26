import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentMethod.css";
import gcashQrCode from "../../assets/gcash_qr.png";
import mayaQrCode from "../../assets/maya_qr.png";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [referenceNo, setReferenceNo] = useState("");

  const { setCartItems, token, url, fetchFoodList } = useContext(StoreContext);

  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const {
    billingInfo,
    orderDate,
    estimatedDeliveryDate,
    actualCartItems,
    cartTotalPrice,
  } = location.state;

  const handleProceed = async () => {
    // * check if receipt image is uploaded and reference number is entered
    if (!receiptImage) {
      alert("Please upload a picture of your receipt.");
      return;
    }
    if (!referenceNo) {
      alert("Please enter the reference number.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    // * PUT THE INFORMATION ON THE DATABASE HERE
    // * NEED TO GET THE INFORMATION FROM CART, PLACEORDER, AND PAYMENT METHOD HERE
    console.log("YOU ARE REQ FOR: ");
    console.log(actualCartItems);
    console.log(cartTotalPrice);

    const orderRequestData = {
      orderedItems: actualCartItems,
      totalOrderedPrice: cartTotalPrice,
      date: formatDate(orderDate),
    };

    // * necessary if you have image to upload
    const formData = new FormData();
    formData.append("orderedItems", JSON.stringify(actualCartItems));
    formData.append("totalOrderedPrice", cartTotalPrice);
    formData.append("date", formatDate(orderDate));
    formData.append("estimatedDeliveryDate", formatDate(estimatedDeliveryDate));
    formData.append("address", billingInfo.address);
    formData.append("city", billingInfo.city);
    formData.append("country", billingInfo.country);
    formData.append("email", billingInfo.email);
    formData.append("name", billingInfo.name);
    formData.append("paymentMethod", paymentMethod);
    formData.append("phone", billingInfo.phone);
    formData.append("referenceNo", referenceNo);
    formData.append("zip", billingInfo.zip);
    formData.append("receiptImage", receiptImage);

    let newRequestOrderId = -1;

    if (token) {
      // * save the request for order (saves the order, deduct stocks, remove item from cart) on DB
      try {
        let response = await axios.post(
          url + "/api/order/requestOrder",
          orderRequestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }

        // * removes the item from cart on FE
        setCartItems([]);
        newRequestOrderId = response.data.orderId;

        // * save the request for delivery (saves the delivery information and payment) on DB
        formData.append("orderId", newRequestOrderId);

        console.log("ID:" + newRequestOrderId);

        response = await axios.post(
          url + "/api/deliver/requestDelivery",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }

        // * after successful order fetch again the foodlist to update stock on UI
        fetchFoodList();

        toast.success("Request order success!");

        navigate("/order-confirmation", {
          state: { ...location.state, referenceNo },
        });
      } catch (error) {
        toast.error(error);
        console.error("Failed to request order:", error);
      }
    }
  };

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0"); // Pad single digit days with a leading zero
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1 and pad with zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const handleQrClick = (qrCode) => {
    setSelectedQrCode(qrCode);
    setShowPaymentMethod(true);
  };

  const handleModalClose = () => {
    setSelectedQrCode(null);
    setShowPaymentMethod(false);
  };

  const handleSaveQrCode = () => {
    const link = document.createElement("a");
    link.href = selectedQrCode;
    link.download = "QR_Code.png";
    link.click();
  };

  const handleSetPaymentMethod = () => {
    console.log(selectedQrCode === gcashQrCode);
    setPaymentMethod(selectedQrCode === gcashQrCode ? "GCASH" : "MAYA");
    handleModalClose();
  };

  const handleReceiptUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceiptImage(file);
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
        <input
          name="receiptImage"
          type="file"
          className="file-input"
          id="receipt-upload"
          accept="image/*"
          onChange={handleReceiptUpload}
        />
        <label htmlFor="receipt-upload" className="choose-file-button">
          Upload Receipt
        </label>
      </div>

      <div className="reference-no">
        <label htmlFor="reference-no">Reference No:</label>
        <input
          type="text"
          id="reference-no"
          value={referenceNo}
          onChange={(e) => setReferenceNo(e.target.value)}
        />
      </div>

      <button onClick={handleProceed}>Proceed with Order</button>

      {/* {selectedQrCode && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
            <img src={selectedQrCode} alt="Selected QR Code" />
            <button onClick={handleSaveQrCode}>Save QR Code</button>
          </div>
        </div>
      )} */}
      {showPaymentMethod && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
            <img src={selectedQrCode} alt="Selected QR Code" />
            <button onClick={handleSaveQrCode}>Save QR Code</button>
            <button onClick={handleSetPaymentMethod}>
              Set sa Payment Method
            </button>
          </div>
        </div>
      )}

      {receiptImage && (
        <div className="receipt-preview">
          <h3>Receipt Preview:</h3>
          <img src={URL.createObjectURL(receiptImage)} alt="Receipt Preview" />
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
