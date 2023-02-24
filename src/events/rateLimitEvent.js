module.exports = {
  name: "Rate Limit",
  event: "rateLimit",
  once: false,

  async createEvent(rateLimitData) {
    console.log(rateLimitData);
  },
};
