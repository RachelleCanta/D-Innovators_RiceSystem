import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const [receiptImage, setReceiptImage] = useState("");
  const [viewReceipt, setViewReceipt] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [orderIds, setOrderIds] = useState([]);

  // TODO: FILTER BY DAY
  // TODO: FILTER BY STATUS WHICH ALSO REFLECTS THE ID WITH IT
  // TODO: FILTER BY AVAILABLE ID BASED ON STATUS

  // ? APPROVED CAN BE PENDING
  // ? NOTE : REJECTED CANNOT BE APPROVED OR PENDING

  const fetchOrders = async () => {
    try {
      let queryString = `${url}/api/order/orders?`;

      if (selectedDate) {
        queryString += `date=${formatDate(new Date(selectedDate))}&`;
      }
      if (selectedStatus) {
        queryString += `status=${selectedStatus}&`;
      }
      if (selectedId) {
        queryString += `id=${selectedId}&`;
      }

      // Remove trailing '&' or '?' if present
      queryString = queryString.slice(0, -1);

      // * getting all orders
      const ordersResponse = await axios.get(queryString);

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
      console.log(usersResponse.data.users);
      console.log(foodsResponse.data.data);
      console.log(deliveriesResponse.data.deliveries);

      const orders = ordersResponse.data.orders;
      const users = usersResponse.data.users;
      const foods = foodsResponse.data.data;
      const deliveries = deliveriesResponse.data.deliveries;

      // * combine data
      const combined = orders.map((order) => {
        // * adding order ids to combobox
        setOrderIds((prevIds) => {
          if (prevIds.findIndex((id) => id === order._id) === -1) {
            prevIds = [...prevIds, order._id];
          }
          return [...prevIds];
        });
        const user = users.find((u) => u._id === order.userId);
        const delivery = deliveries.find((d) => d.orderId === order._id);
        const orderedItems = order.orderedItems.map((item) => {
          const food = foods.find((f) => f._id === item.food);
          return { ...item, food };
        });
        return { ...order, user, delivery, orderedItems };
      });

      // Sort combined data by orderDate (assuming it exists in order object)
      combined.sort((a, b) => new Date(b.date) - new Date(a.date));

      setOrders(orders);
      setUsers(users);
      setFoods(foods);
      setDeliveries(deliveries);
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

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // * retrieve order and delivery information
  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, selectedDate, selectedId]);

  useEffect(() => {
    console.log("COMBINED DATA:");
    console.log(combinedData);
  }, [combinedData]);

  const handleStatusChange = (event) => {
    setOrderIds([]);
    setSelectedId("");
    setSelectedStatus(event.target.value);
  };

  const handleIdChange = (event) => {
    setSelectedId(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

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
      <h1>Orders</h1>
      <form className="filters">
        <div>
          <label htmlFor="orderDate">Date</label>
          <input
            type="date"
            onKeyDown={() => false}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label htmlFor="orderStatus">Status</label>
          <select id="orderStatus" onChange={handleStatusChange}>
            <option value={""}>All</option>
            <option value={"Approved"}>Approved</option>
            <option value={"Pending"}>Pending</option>
            <option value={"Rejected"}>Rejected</option>
          </select>
        </div>
        <div>
          <label htmlFor="orderId">ID</label>
          <select id="orderId" onChange={handleIdChange}>
            <option value={""}>ALL</option>
            {orderIds.map((id) => {
              return (
                <option key={id} value={id}>
                  {id}
                </option>
              );
            })}
          </select>
        </div>
      </form>
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
                    <p>Date Ordered: {order.date}</p>
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
                <div className="actions">
                  {/* <h4>Actions</h4> */}

                  {(order.status === "Pending" ||
                    order.status === "Delivered") && (
                    <>
                      <button
                        name="Approved"
                        className="approve"
                        onClick={(e) =>
                          handleStatusClick(e, order._id, order.orderedItems)
                        }
                      >
                        Approve
                      </button>
                      {order.status === "Pending" && (
                        <button
                          name="Rejected"
                          className="reject"
                          onClick={(e) =>
                            handleStatusClick(e, order._id, order.orderedItems)
                          }
                        >
                          Reject
                        </button>
                      )}
                    </>
                  )}

                  {order.status === "Approved" && (
                    <button
                      name="Pending"
                      className="pending"
                      onClick={(e) =>
                        handleStatusClick(e, order._id, order.orderedItems)
                      }
                    >
                      Pending
                    </button>
                  )}

                  {order.status === "Approved" && (
                    <button
                      name="Delivered"
                      className="approve"
                      onClick={(e) =>
                        handleStatusClick(e, order._id, order.orderedItems)
                      }
                    >
                      Delivered
                    </button>
                  )}

                  {(order.status === "Delivered" ||
                    order.status === "Rejected" ||
                    order.status === "Cancelled") && (
                    <button
                      name="Deleted"
                      className="delete"
                      onClick={() => handleDeleteOrderClick(order._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
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
              className="size-6"
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

export default Orders;
