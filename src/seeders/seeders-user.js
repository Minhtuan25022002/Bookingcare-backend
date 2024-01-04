'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'test1@gmail.com',
      password: '123456',
      firstName: 'Tuan1',
      lastName: 'Nguyen',
      address: 'Viet Nam1',
      gender: 1,
      roleId: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'test2@gmail.com',
      password: '123456',
      firstName: 'Tuan1',
      lastName: 'Nguyen1',
      address: 'Viet Nam1',
      gender: 1,
      roleId: 'Doctor',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'test3@gmail.com',
      password: '123456',
      firstName: 'Tuan3',
      lastName: 'Nguyen3',
      address: 'Viet Nam3',
      gender: 1,
      roleId: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
