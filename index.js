const app = require('./app');

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
})();