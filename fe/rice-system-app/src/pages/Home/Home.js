import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import Footer from '../../components/Footer/Footer';
import AppDownload from '../../components/AppDownload/AppDownload';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <ExploreMenu setCategory={setCategory} />
      <FoodDisplay category={category} />
      <Footer />
      <AppDownload />
    </div>
  );
};

export default Home;
