'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const models = require('../models');
        // update review stars
        let products = await models.Product.findAll({
            include: [{ model: models.Review }]
        });
        let updatedProducts = [];
        products.forEach(item => {
            let stars = 0;
            if (item.Reviews.length > 0) {
                stars = item.Reviews.reduce((total, item) => {
                    return total + item.stars;
                }, 0) / item.Reviews.length;
            }
            item.stars = stars.toFixed(1);
            updatedProducts.push({
                id: item.id,
                stars: item.stars
            });
        });
        await models.Product.bulkCreate(updatedProducts, {
            updateOnDuplicate: ['stars']
        });
    },

    async down(queryInterface, Sequelize) {

    }
};
