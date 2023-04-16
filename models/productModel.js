const { Sequelize, Op, DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelize');
const AppError = require('../utils/appError');
const Customer = require('../models/customerModel');

class Product extends Model {};

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT('medium'),
            allowNull: false,
        },
        titleImage: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {
                notNull: {
                    msg: "Please specify a title image for display.",
                }
            }
        },
        images: {
            type: DataTypes.TEXT('medium'),
            get() {
                const stringValue = this.getDataValue('images');
                return stringValue ? rawValue.split(',') : [];
            },
            set(value) {
                const arrayValue = value ? value.join(',') : '';
                this.setDataValue('images', arrayValue);
            },
        },
        video: {
            type: DataTypes.STRING,
        },
        avaialble: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                nonNegativeValue(value) {
                    if(value < 0) {
                        throw new AppError("Available count must be greater than or equal to zero");
                    }
                }
            }
        },
        minimumOrderCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                positiveValue(value) {
                    if(value < 1) {
                        throw new AppError("Minimum order count must be greater than or equal to one");
                    }
                }
            }
        },
        priceInRuppes: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                positiveValue(value) {
                    if(value <= 0) {
                        throw new AppError("Price must be greater than zero");
                    }
                }
            }
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                validatePercantage(value) {
                    if(value < 0 || value > 99) {
                        throw new AppError("Discount must be between 0 and 99 (inclusive).");
                    }
                }
            }
        },
        sellerEmail: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        timestamps: true,
        tableName: 'Products',
    }
);

Product.belongsTo(Customer, {
    onDelete: 'CASCADE',
    foreignKey: 'sellerEmail',
    targetKey: 'email',
});

// Sync the defined model to database
const sync = async () => {
	await Product.sync({ alter: true });
};

if(process.env.NODE_ENV === 'development') {
	sync();
}

module.exports = Product;