import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const navigate = useNavigate();

  // ! EC : YOU CANT DELETE A PRODUCT WHEN THERE ARE STILL ORDERS AND ITEMS IN CART OF USERS
  // ? SOLUTION : BEFORE DELETING PRODUCT DELETE CART ITEMS FOR ALL USERS AND ORDERS

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log(response.data);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Failed to fetch list. Please try again later.");
    }
  };

  const removeItem = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item. Please try again later.");
    }
  };

  const editItem = async (foodId) => {
    navigate("/update", {
      state: {
        searchFoodId: foodId,
      },
    });

    // try {
    //   const response = await axios.post(`${url}/api/food/remove`, {
    //     id: foodId,
    //   });
    //   await fetchList();
    //   if (response.data.success) {
    //     toast.success(response.data.message);
    //   } else {
    //     toast.error("Error");
    //   }
    // } catch (error) {
    //   console.error("Error removing item:", error);
    //   toast.error("Failed to remove item. Please try again later.");
    // }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="foodlist-parent-container">
      <p>All Products List</p>
      <div className="cart-table-div">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th className="description">Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0
              ? list.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <img src={url + "/images/" + item.image} alt="" />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td className="description">{item.description}</td>
                      <td>{item.price}</td>
                      <td>{item.stocks}</td>
                      <td className="actions-div">
                        <button
                          onClick={() => editItem(item._id)}
                          className="edit-item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="remove-item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              : list.length <= 0 && (
                  <tr className="empty-cart">
                    <td colSpan={6}>Your cart is empty...</td>
                    <td></td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;

// return (
//   <div className="list add flex-col">
//     <p>All Products List</p>
//     <div className="list-table">
//       <div className="list-table-format title">
//         <b>Image</b>
//         <b>Name</b>
//         <b>Category</b>
//         <b>Description</b>
//         <b>Price</b>
//         <b>Stocks</b>
//         <b>Action</b>
//       </div>
//       {list.map((item, index) => {
//         return (
//           <div key={index} className="list-table-format">
//             <img
//               src={`${url}/images/` + item.image}
//               width="50px"
//               height="50px"
//               alt=""
//             />
//             <p>{item.name}</p>
//             <p>{item.category}</p>
//             <p className="description">{item.description}</p>
//             <p>₱{item.price}</p>
//             <p>{item.stocks}</p>
//             <div className="actions-div">
//               <button onClick={() => editItem(item._id)} className="edit-item">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
//                   />
//                 </svg>
//               </button>
//               <button
//                 onClick={() => removeItem(item._id)}
//                 className="remove-item"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// );
