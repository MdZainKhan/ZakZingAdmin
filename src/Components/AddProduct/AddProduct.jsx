import React, { useState } from "react";
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "", // Change to null or empty string
        category: "women",
        new_price: "", // Make sure this field is filled
        old_price: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    }

    const Add_Product = async () => {
        if (!image || !productDetails.new_price) {
            alert("Please upload an image and fill out all fields.");
            return;
        }

        let formData = new FormData();
        formData.append('product', image);

        const response = await fetch('https://zakzingbackend.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });
        const responseData = await response.json();

        if (responseData.success) {
            const product = { ...productDetails, image: responseData.image_url };

            const addProductResponse = await fetch('https://zakzingbackend.onrender.com/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            const addProductData = await addProductResponse.json();
            if (addProductData.success) {
                alert("Product Added");
            } else {
                alert("Failed to add product");
            }
        } else {
            alert("Failed to upload image");
        }
    }

    return (
        <div className="addproduct">
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Type here"/>
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type here"/>
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type here"/>
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className="addproduct-thumbnail-img" alt="" />
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
            </div>
            <button onClick={Add_Product} className="addproduct-btn">ADD</button>
        </div>
    );
}

export default AddProduct;
