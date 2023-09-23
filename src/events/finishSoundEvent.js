const { removeMusicCooldown, hasMusicCooldown, addMusicCooldown } = require("../managers/musicManager");

module.exports = {
  name: "Finish Song",
  event: "finish",
  once: false,
  distube: true,

  createEvent(queue) {
    
    addMusicCooldown()
    setTimeout(() => {
        if (hasMusicCooldown()) {
            queue.distube.voices.leave(queue)
            removeMusicCooldown()
            queue.textChannel.send("Se passaram 5 minutos e não houve nenhuma música tocada, acho que isso é um adeus.").catch(console.error)
        }
    }, 5 * 60 * 1000)
  },
};