'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert heroes into Heroes table with correct column names
    await queryInterface.bulkInsert('Heroes', [
      {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'Born on Krypton, sent to Earth.',
        superpowers: 'Flight, Super Strength, X-ray vision',
        catch_phrase: 'Up, up and away!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nickname: 'Batman',
        real_name: 'Bruce Wayne',
        origin_description: 'Wealthy vigilante from Gotham City.',
        superpowers: 'Martial Arts, High Intelligence',
        catch_phrase: 'I am the night.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Query heroes to get their IDs for images
    const heroes = await queryInterface.sequelize.query(
      `SELECT id, nickname FROM "Heroes";`
    );

    const heroRows = heroes[0];

    // Insert hero images linked by heroId
    await queryInterface.bulkInsert('HeroImages', [
      {
        heroId: heroRows.find(hero => hero.nickname === 'Superman').id,
        image_url: 'https://example.com/superman.jpg',
        is_main: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        heroId: heroRows.find(hero => hero.nickname === 'Batman').id,
        image_url: 'https://example.com/batman1.jpg',
        is_main: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        heroId: heroRows.find(hero => hero.nickname === 'Batman').id,
        image_url: 'https://example.com/batman2.jpg',
        is_main: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Delete all data from HeroImages and Heroes tables
    await queryInterface.bulkDelete('HeroImages', null, {});
    await queryInterface.bulkDelete('Heroes', null, {});
  }
};
