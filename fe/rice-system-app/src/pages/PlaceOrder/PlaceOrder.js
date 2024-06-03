import React, { useContext } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';


    const PlaceOrder = () => {


      const {getTotalCartAmount} = useContext(StoreContext)
     
      return(
      <form className='place-order'>
       <div className="place-order-left">
        <p className="title">Delivery Information</p>
       <div className="multi-fields">
         <input type="text" placeholder='First name' />
         <input type="text" placeholder='Last name' />
      </div>
      <input type="email" placeholder='Email address' />
      <input type="text" placeholder='Street' />
      <div className="multi-fields">
         <input type="text" placeholder='City' />
         <input type="text" placeholder='State' />
      </div> I
      <div className="multi-fields">
         <input type="text" placeholder='Zip code' />
         <input type="text" placeholder='Country' />
     </div>
     <input type="text" placeholder='Phone' />
     </div>
     <div className="place-order-right">
     <div className="cart-botton">
        <div className="cart-total"></div>
       </div>
         <h2>Cart Totals</h2>
       <div>
         <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>  I
      </div>
      <hr />
       <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{2}</p>
      </div>
      <hr />
       <div className="cart-total-details">
           <b>Total</b>
           <b>{0}</b>
        </div>
    </div>
       <button>PROCEED TO PAYMENT</button>
      </div>
    </form>
  )
}


export default PlaceOrder

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './PlaceOrder.css';

// const PlaceOrder = () => {
//   const [billingInfo, setBillingInfo] = useState({
//     name: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     country: '',
//     email: '',
//     phone: ''
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setBillingInfo({ ...billingInfo, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const currentDate = new Date();
//     const estimatedDeliveryDate = new Date();
//     estimatedDeliveryDate.setDate(currentDate.getDate() + 2);

//     console.log('Order placed:', billingInfo);
//     navigate('/payment-method', {
//       state: {
//         billingInfo,
//         orderDate: currentDate.toISOString(),
//         estimatedDeliveryDate: estimatedDeliveryDate.toISOString()
//       }
//     });
//   };

//   return (
//     <div className="place-order">
//   <h2>Delivery Information</h2>
//   <form onSubmit={handleSubmit} className="billing-form">
//   <label>
//           Name:
//           <input type="text" name="name" value={billingInfo.name} onChange={handleChange} required />
//         </label>
//         <label>
//           Address:
//           <input type="text" name="address" value={billingInfo.address} onChange={handleChange} required />
//         </label>
//         <label>
//           City:
//           <input type="text" name="city" value={billingInfo.city} onChange={handleChange} required />
//         </label>
//         <label>
//           Zip:
//           <input type="text" name="zip" value={billingInfo.zip} onChange={handleChange} required />
//         </label>
//         <label>
//           Country:
//           <input type="text" name="country" value={billingInfo.country} onChange={handleChange} required />
//         </label>
//         <label>
//           Email:
//           <input type="email" name="email" value={billingInfo.email} onChange={handleChange} required />
//         </label>
//         <label>
//           Phone:
//           <input type="text" name="phone" value={billingInfo.phone} onChange={handleChange} required />
//         </label>
       
//     <div className="button-container">
//       <button type="button" onClick={() => navigate('/cart')}>Back</button>
//       <button type="submit">Place Order</button>
//     </div>
//   </form>
// </div>

    
//   );
// };

// export default PlaceOrder;
