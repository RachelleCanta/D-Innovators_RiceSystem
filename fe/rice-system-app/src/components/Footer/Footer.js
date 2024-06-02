import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
      <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} width="100px" height="70px" alt=""/>
                    <p>Simplifying Rice, Connecting Lives: ZGM Rice Shop envisions a world where rice transactions are effortlessly accessible, promoting connections between customers and owners. We see a future where ordering rice is as easy as a smile, fostering relationships that nourish communities.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt=""/>
                        <img src={assets.twitter_icon} alt=""/>
                        <img src={assets.linkedin_icon} alt=""/>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>SHOP</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
            </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+6397-7621-4501</li>
                        <li>zgm_riceshop@gmail.com</li>
                    </ul>
                </div>
                
        </div>
      <hr/>
      <p className="footer-copyright">Copyright @ 2024 © ZGM Rice Shop - All Right Reserved.</p>
    </div>
  )
}

export default Footer
