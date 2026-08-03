// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: any }) {
    // Seed Data Script
    try {
      // Check if Airdrop content-type exists to prevent crashes if not defined yet
      if (strapi.contentTypes['api::airdrop.airdrop']) {
        const count = await strapi.db.query('api::airdrop.airdrop').count();
        if (count === 0) {
          strapi.log.info('Seeding database with initial airdrop data...');
          await strapi.db.query('api::airdrop.airdrop').create({
            data: {
              title: "Monad",
              slug: "monad",
              description: "Monad is a high-performance Layer 1 blockchain.",
              status: "Confirmed",
              publishedAt: new Date(),
            }
          });
          strapi.log.info('Database seeded successfully.');
        }
      }
    } catch (err) {
      strapi.log.error('Failed to seed database:', err);
    }
  },
};
