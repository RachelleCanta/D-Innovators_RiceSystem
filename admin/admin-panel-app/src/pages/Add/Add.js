import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Select",
    stocks: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("stocks", Number(data.stocks));
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Select",
          stocks: ""
        });
        setImage(null);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again later.');
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <select onChange={onChangeHandler} value={data.description} name="description">
            <option value="">Select Description</option>
            <option value="Dinurado - Enjoy the finest grains of Mindoro's Crystal Dinurado Rice! 
            100% pure local rice, fresh-milled, soft and delicious even until the next day and chemical-free.">DINURADO</option>
            <option value="Jasmine - Jasmine Rice is moist and soft in texture when cooked, with a slightly sweet flavor. 
            The grains cling and are somewhat sticky when cooked, though less sticky than glutinous rice, 
            as it has less amylopectin.">JASMINE</option>
            <option value="Maharlika - This premium rice is a long grain varietal that is white and fluffy. 
            It has separating qualities and fragrance that make it a great choice for a wide variety of fried rice.">MAHARLIKA</option>
            <option value="Premium Rice - It is a special type of rice from the northeast of Vietnam that is of excellent 
            quality and has a shiny and firm grain, a wonderfully soft taste, and a naturally fragrant aroma.">PREMIUM RICE</option>
            <option value="Sinandomeng - Sinandomeng is a household favorite in every Filipino home. 
            Sinandomeng is characterized by long white grains and when cooked its 
            grains are soft and fluffy for your perfect pair to any viand.<">SINANDOMENG</option>
          </select>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} value={data.category} name="category">
              <option value="Select">Select Category</option>
              <option value="Dinurado">Dinurado</option>
              <option value="Jasmine">Jasmine</option>
              <option value="Maharlika">Maharlika</option>
              <option value="Premium Rice">Premium Rice</option>
              <option value="Sinandomeng">Sinandomeng</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₱320.00' />
          </div>
          <div className="add-product-stocks flex-col">
            <p>Product Stocks</p>
            <input onChange={onChangeHandler} value={data.stocks} type="number" name='stocks' placeholder='available stocks' />
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
};

export default Add;
