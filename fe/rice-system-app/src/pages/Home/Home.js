import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import Footer from '../../components/Footer/Footer';
import AppDownload from '../../components/AppDownload/AppDownload';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'; 
import FoodItem from '../../components/FoodItem/FoodItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [category, setCategory] = useState("All");

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div>
      <Header />
      <ExploreMenu setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
      <ScrollToTopButton onClick={handleScrollToTop} />
    </div>
  );
};

const ScrollToTopButton = ({ onClick }) => {
  return (
    <button className="scroll-to-top-button" onClick={onClick}>
      <FontAwesomeIcon icon={faChevronUp} />
    </button>
  );
};

export default Home;
