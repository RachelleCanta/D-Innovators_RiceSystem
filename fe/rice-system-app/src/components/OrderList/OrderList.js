import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./OrderList.css";
import { StoreContext } from "../../context/StoreContext";

const OrderList = () => {
  // TODO: ONLY GET THE USER ORDERS
  // ? ADD A CANCEL ORDER FOR PENDING ORDER

  const { url } = useContext(StoreContext);

  const [combinedData, setCombinedData] = useState([]);

  const [receiptImage, setReceiptImage] = useState("");
  const [viewReceipt, setViewReceipt] = useState(false);

  // * retrieve order and delivery information
  useEffect(() => {
    const fetchData = async () => {
      try {
        //  * retrieve the token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        // * getting 1 order
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userType: "customer",
          },
        };
        const ordersResponse = await axios.get(
          `${url}/api/order/userOrder`,
          config
        );

        // * getting all users
        const usersResponse = await axios.get(`${url}/api/user/users`);

        // * getting all foods
        const foodsResponse = await axios.get(`${url}/api/food/list`);
        // * getting all delivery information
        const deliveriesResponse = await axios.get(
          `${url}/api/deliver/deliveries`
        );

        if (!ordersResponse.data.success) {
          toast.error("Error fetching orders");
          return;
        }

        if (!usersResponse.data.success) {
          toast.error("Error fetching users");
          return;
        }

        if (!foodsResponse.data.success) {
          toast.error("Error fetching foods");
          return;
        }

        if (!deliveriesResponse.data.success) {
          toast.error("Error fetching deliveries");
          return;
        }

        // * log for testint
        console.log(ordersResponse.data.orders);
        console.log(usersResponse.data.user);
        console.log(foodsResponse.data.data);
        console.log(deliveriesResponse.data.deliveries);

        const orders = ordersResponse.data.orders;
        const users = usersResponse.data.users;
        const foods = foodsResponse.data.data;
        const deliveries = deliveriesResponse.data.deliveries;

        // * combine data
        const combined = orders.map((order) => {
          const user = users.find((u) => u._id === order.userId);
          const delivery = deliveries.find((d) => d.orderId === order._id);
          const orderedItems = order.orderedItems.map((item) => {
            const food = foods.find((f) => f._id === item.food);
            return { ...item, food };
          });
          return { ...order, user, delivery, orderedItems };
        });

        // * Sort combined data by orderDate (assuming it exists in order object)
        combined.sort((a, b) => new Date(b.date) - new Date(a.date));

        setCombinedData(combined);

        toast.success(ordersResponse.data.orders);
        toast.success(usersResponse.data.users);
        toast.success(foodsResponse.data.data);
        toast.success(deliveriesResponse.data.deliveries);
        toast.success("Data fetched successfully");
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders. Please try again later.");
      }
    };
    fetchData();
  }, [url]);

  useEffect(() => {
    console.log("COMBINED DATA:");
    console.log(combinedData);
  }, [combinedData]);

  const handleViewReceiptClick = (image) => {
    setReceiptImage(image);
    setTimeout(() => {
      setViewReceipt(true);
    }, 500);
  };

  const handleStatusClick = async (e, id, items) => {
    console.log(e);
    // * updating status on db
    const updateResponse = await axios.put(`${url}/api/order/status`, {
      orderId: id,
      orderStatus: e.target.name,
      orderedItems: items,
    });

    if (!updateResponse.data.success) {
      toast.error(updateResponse.data.message);
      return;
    }
    toast.success(updateResponse.data.message);

    // * update ui
    setCombinedData((prevOrders) => {
      const order = prevOrders.find((order) => order._id === id);
      order.status = e.target.name;
      return [...prevOrders];
    });
  };

  const handleDeleteOrderClick = async (id) => {
    // * deleting order on db
    const deleteResponse = await axios.delete(`${url}/api/order/deleteOrder`, {
      data: {
        orderId: id,
      },
    });
    if (!deleteResponse.data.success) {
      toast.error(deleteResponse.data.message);
      return;
    }
    toast.success(deleteResponse.data.message);
    // * update ui
    setCombinedData((prevOrders) => {
      const updatedOrders = prevOrders.filter((order) => order._id !== id);
      return [...updatedOrders];
    });
  };

  return (
    <div className="orders-div">
      <h1>Order List</h1>
      <div className="orders-div">
        {combinedData.length <= 0 && <h1>No orders yet...</h1>}
        {combinedData.length > 0 &&
          combinedData.map((order) => {
            return (
              <div className="order-information" key={order._id}>
                <div className="primary">
                  <h3>Order{order._id}</h3>
                  <h3>P{order.totalOrderedPrice}</h3>
                  <h3>{order.user.name}</h3>
                  <span>{order.status}</span>
                </div>
                <div className="payment-delivery">
                  <div className="payment">
                    <h4>Payment</h4>
                    <p>Method: {order.delivery.customerPaymentMethod}</p>
                    <p>
                      Reference No: {order.delivery.customerPaymentReferenceNo}
                    </p>
                    <button
                      className="view-receipt-button"
                      onClick={() =>
                        handleViewReceiptClick(
                          url + "/images/" + order.delivery.customerPaymentImage
                        )
                      }
                    >
                      View Receipt
                    </button>
                  </div>
                  <div className="delivery">
                    <h4>Delivery</h4>
                    <p>
                      Est. Delivery Date: {order.delivery.estimatedDeliveryDate}
                    </p>
                    <p>Customer: {order.delivery.customerName}</p>
                    <p>City: {order.delivery.customerCity}</p>
                    <p>Country: {order.delivery.customerCountry}</p>
                    <p>Zip: {order.delivery.customerZip}</p>
                    <p>Email: {order.delivery.customerEmail}</p>
                    <p>Phone: {order.delivery.customerPhone}</p>
                  </div>
                </div>
                <div className="ordered-items">
                  <h4>Items</h4>
                  <div className="items-div">
                    {order.orderedItems.map((item) => {
                      return (
                        <div className="item" key={item._id}>
                          <p>{item.food.name}</p>
                          <p>x{item.quantity}</p>
                          <p>P{item.totalPrice}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {order.status !== "Approved" && (
                  <div className="actions">
                    {/* <h4>Actions</h4> */}
                    {order.status === "Pending" && (
                      <button
                        name="Cancelled"
                        className="cancel"
                        onClick={(e) =>
                          handleStatusClick(e, order._id, order.orderedItems)
                        }
                      >
                        Cancel
                      </button>
                    )}
                    {order.status !== "Pending" &&
                      order.status !== "Approved" && (
                        <button
                          name="Deleted"
                          className="delete"
                          onClick={() => handleDeleteOrderClick(order._id)}
                        >
                          Delete
                        </button>
                      )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {viewReceipt && (
        <div className="view-receipt">
          <button onClick={() => setViewReceipt(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3>Receipt Image</h3>
          <img src={receiptImage} alt="" />
        </div>
      )}
    </div>
  );
};

export default OrderList;
