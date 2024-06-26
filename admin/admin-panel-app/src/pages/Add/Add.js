import React, { useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const Add = ({ url }) => {
  const location = useLocation();

  // ! RESUME HERE :
  // TODO: UPDATE RESPONSIVENESS FOR ADD AND LIST

  const [addImage, setAddImage] = useState(null);
  const [updateImage, setUpdateImage] = useState(null);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stocks: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // * check if the user will edit on mount
  useEffect(() => {
    if (window.location.href.includes("update")) {
      if (location.state) {
        // * extract food id from location.state
        const { searchFoodId } = location.state;
        search(searchFoodId);
      }
    } else {
      setIsUpdating(false);
      setData({
        name: "",
        description: "",
        price: "",
        category: "",
        stocks: "",
      });
      setAddImage(null);
    }
  }, [window.location.href]);

  const handleImageChange = (e) => {
    if (isUpdating) {
      setUpdateImage(e.target.files[0]);
    } else {
      setAddImage(e.target.files[0]);
    }
  };

  const search = async (id) => {
    try {
      const response = await axios.get(`${url}/api/food/search`, {
        params: {
          searchFoodId: id,
        },
      });
      if (response.data.success) {
        setData({
          name: response.data.food.name,
          description: response.data.food.description,
          price: response.data.food.price,
          category: response.data.food.category,
          stocks: response.data.food.stocks,
        });
        setUpdateImage(url + "/images/" + response.data.food.image);
        toast.success(response.data.message);
        setIsUpdating(true);
      }
    } catch (error) {
      console.error("Error searching product:", error);
      toast.error("Failed to search product. Please try again later.");
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if ((isUpdating && !updateImage) || (!isUpdating && !addImage)) {
      toast.warning("Please choose an image");
      return;
    }

    if (data.price <= 0 || data.category === "" || data.stocks <= 0) {
      toast.warning("Please fill all necessary fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("stocks", Number(data.stocks));

    formData.append("image", isUpdating ? updateImage : addImage);

    console.log("image", updateImage);

    if (isUpdating) {
      const { searchFoodId } = location.state;
      formData.append("updateId", searchFoodId);
    }

    try {
      let response = null;

      if (isUpdating) {
        response = await axios.put(`${url}/api/food/update`, formData);
      } else {
        response = await axios.post(`${url}/api/food/add`, formData);
      }

      if (response.data.success) {
        if (!isUpdating) {
          setData({
            name: "",
            description: "",
            price: "",
            category: "",
            stocks: "",
          });
          setAddImage(null);
        }
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error " + (isUpdating ? "Updating" : "Adding") + " product:",
        error
      );
      toast.error(
        "Failed to " +
          (isUpdating ? "Update" : "Add") +
          " product. Please try again later."
      );
    }
  };

  return (
    <div className="add">
      <form className="" onSubmit={onSubmitHandler}>
        <div className="image-div">
          <p>Upload Image</p>
          <label htmlFor="image">
            {!isUpdating ? (
              <img
                src={
                  addImage ? URL.createObjectURL(addImage) : assets.upload_area
                }
                alt=""
              />
            ) : (
              <img
                src={
                  updateImage instanceof File
                    ? URL.createObjectURL(updateImage)
                    : updateImage || assets.upload_area
                }
                alt=""
              />
            )}
          </label>
          <input
            onChange={(e) => handleImageChange(e)}
            type="file"
            id="image"
            hidden
          />
        </div>
        <div className="name-div">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>
        <div className="description-div">
          <p>Product Description</p>
          <textarea
            required
            name="description"
            onChange={onChangeHandler}
            className="product-description"
            placeholder="Enter description here"
            value={data.description}
          ></textarea>
        </div>
        <div className="category-price-stock-div">
          <div className="category-div">
            <p>Product Category</p>
            <select
              onChange={onChangeHandler}
              value={data.category}
              name="category"
            >
              <option value="">Select Category</option>
              <option value="Dinurado">Dinurado</option>
              <option value="Jasmine">Jasmine</option>
              <option value="Maharlika">Maharlika</option>
              <option value="Premium Rice">Premium Rice</option>
              <option value="Sinandomeng">Sinandomeng</option>
            </select>
          </div>
          <div className="price-div">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="₱0"
              min={1}
            />
          </div>
          <div className="stock-div">
            <p>Product Stocks</p>
            <input
              onChange={onChangeHandler}
              value={data.stocks}
              type="number"
              name="stocks"
              placeholder="0"
              min={0}
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          {!isUpdating ? "ADD" : "UPDATE"}
        </button>
      </form>
    </div>
  );
};

export default Add;

//  return (
//     <div className="add">
//       <form className="flex-col" onSubmit={onSubmitHandler}>
//         <div className="add-img-upload flex-col">
//           <p>Upload Image</p>
//           <label htmlFor="image">
//             {!isUpdating ? (
//               <img
//                 src={
//                   addImage ? URL.createObjectURL(addImage) : assets.upload_area
//                 }
//                 alt=""
//               />
//             ) : (
//               <img
//                 src={
//                   updateImage instanceof File
//                     ? URL.createObjectURL(updateImage)
//                     : updateImage || assets.upload_area
//                 }
//                 alt=""
//               />
//             )}
//           </label>
//           <input
//             onChange={(e) => handleImageChange(e)}
//             type="file"
//             id="image"
//             hidden
//           />
//         </div>
//         <div className="add-product-name flex-col">
//           <p>Product Name</p>
//           <input
//             onChange={onChangeHandler}
//             value={data.name}
//             type="text"
//             name="name"
//             placeholder="Type here"
//             required
//           />
//         </div>
//         <div className="add-product-description flex-col">
//           <p>Product Description</p>
//           <textarea
//             required
//             name="description"
//             onChange={onChangeHandler}
//             className="product-description"
//             placeholder="Enter description here"
//             value={data.description}
//           ></textarea>
//         </div>
//         <div className="add-category-price">
//           <div className="add-category flex-col">
//             <p>Product Category</p>
//             <select
//               onChange={onChangeHandler}
//               value={data.category}
//               name="category"
//             >
//               <option value="">Select Category</option>
//               <option value="Dinurado">Dinurado</option>
//               <option value="Jasmine">Jasmine</option>
//               <option value="Maharlika">Maharlika</option>
//               <option value="Premium Rice">Premium Rice</option>
//               <option value="Sinandomeng">Sinandomeng</option>
//             </select>
//           </div>
//           <div className="add-price flex-col">
//             <p>Product Price</p>
//             <input
//               onChange={onChangeHandler}
//               value={data.price}
//               type="number"
//               name="price"
//               placeholder="₱0"
//               min={1}
//             />
//           </div>
//           <div className="add-product-stocks flex-col">
//             <p>Product Stocks</p>
//             <input
//               onChange={onChangeHandler}
//               value={data.stocks}
//               type="number"
//               name="stocks"
//               placeholder="0"
//               min={0}
//             />
//           </div>
//         </div>
//         <button type="submit" className="add-btn">
//           {!isUpdating ? "ADD" : "UPDATE"}
//         </button>
//       </form>
//     </div>
//   );
// };