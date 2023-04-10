DROP DATABASE IF EXISTS find_the_best_pick;

CREATE DATABASE IF NOT EXISTS find_the_best_pick;

USE find_the_best_pick;

CREATE TABLE Customer (
	email VARCHAR(255),
	fullName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    dateOfBirth DATE,
    contactNumber1 VARCHAR(15) NOT NULL,
    contactNumber2 VARCHAR(15),
    PRIMARY KEY(email)
);

CREATE TABLE Delivery_Address (
	customer_email VARCHAR(255) NOT NULL,
    id INT AUTO_INCREMENT,
    fullAddress VARCHAR(255) NOT NULL,
    addressCity VARCHAR(255) NOT NULL,
    addressState VARCHAR(255) NOT NULL,
    addressCountry VARCHAR(255) NOT NULL,
    addressZipCode VARCHAR(10) NOT NULL,
    contactNumber VARCHAR(15) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(customer_email) REFERENCES Customer(email)
);

CREATE TABLE Seller (
	email VARCHAR(255),
	fullName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullAddress VARCHAR(255),
    addressCity VARCHAR(255),
    addressState VARCHAR(255),
    addressCountry VARCHAR(255),
    addressZipCode VARCHAR(10),
    dateOfBirth DATE,
    contactNumber1 VARCHAR(15) NOT NULL,
    contactNumber2 VARCHAR(15),
    accountNumber VARCHAR(40),
    ifscCode VARCHAR(40),
    accountHolderName VARCHAR(255),
    amazonBalance_in_dollars DECIMAL(25,2) NOT NULL DEFAULT 0,
    PRIMARY KEY(email)
);

CREATE TABLE Orders (
	id INT AUTO_INCREMENT,
    order_status ENUM('not yet dispatched', 'dispatched', 'shipped', 'delivered', 'returning', 'cancelled', 'refunded'),
    order_time DATETIME,
    paid BOOL DEFAULT FALSE,
    customer_email VARCHAR(255) NOT NULL,
    delivery_address_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(customer_email) REFERENCES Customer(email),
    FOREIGN KEY(delivery_address_id) REFERENCES Delivery_Address(id)
);

CREATE TABLE Products (
	id INT AUTO_INCREMENT,
    count INT NOT NULL,
    price_in_dollars DECIMAL(10,2),
    discount INT NOT NULL,
    product_description LONGTEXT,
    seller_email VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT count_check CHECK(count >= 0),
    CONSTRAINT discount_check CHECK(discount >= 0 AND discount < 100),
    FOREIGN KEY(seller_email) REFERENCES Seller(email) ON DELETE CASCADE
);

CREATE TABLE Products_Order (
	order_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY(order_id, product_id),
    FOREIGN KEY(order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES Products(id)
);

CREATE TABLE Categories (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    description LONGTEXT
);

CREATE TABLE Subcategories (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    category_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(category_id) REFERENCES Categories(id) ON DELETE CASCADE
);

CREATE TABLE Product_Subcategory (
    product_id VARCHAR(255) NOT NULL,
    subcategory_id INT NOT NULL,
    PRIMARY KEY(product_id, subcategory_id),
    FOREIGN KEY(product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY(subcategory_id) REFERENCES Subcategories(id) ON DELETE CASCADE
);

CREATE TABLE Cart (
    id INT AUTO_INCREMENT,
    customer_email VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(customer_email) REFERENCES Customer(email) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE Wishlist (
    id INT AUTO_INCREMENT,
    customer_email VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(customer_email) REFERENCES Customer(email) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE Payment (
    id INT AUTO_INCREMENT,
    order_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_time DATETIME,
    payment_method ENUM('cash on delivery', 'debit/credit card', 'net banking', 'upi', 'paypal'),
    PRIMARY KEY(id),
    FOREIGN KEY(order_id) REFERENCES Orders(id) ON DELETE CASCADE
);

CREATE TABLE Reviews (
	id INT AUTO_INCREMENT,
    rating INT,
    time DATETIME,
    review LONGTEXT,
    product_id VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    CONSTRAINT ratings_check CHECK(rating >= 1 AND rating <= 5),
    PRIMARY KEY(id),
    FOREIGN KEY(product_id) REFERENCES Products(id),
    FOREIGN KEY(customer_email) REFERENCES Customer(email)
);

CREATE TABLE Ratings (
    product_id INT NOT NULL,
    num_ratings INT NOT NULL DEFAULT 0,
    total_rating INT NOT NULL DEFAULT 0,
    PRIMARY KEY(product_id),
    FOREIGN KEY(product_id) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE Product_Images (
    id INT AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(product_id) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE Product_Variants (
    id INT AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    variant_value VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(product_id) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE Product_Attributes (
    id INT AUTO_INCREMENT,
    product_id INT NOT NULL,
    attribute_name VARCHAR(255) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(product_id) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE Coupons (
    id INT AUTO_INCREMENT,
    code VARCHAR(255) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    expiry_date DATE NOT NULL,
    description LONGTEXT,
    PRIMARY KEY(id),
    UNIQUE(code)
);