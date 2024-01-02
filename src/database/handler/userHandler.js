const cooldowns = {};
const cooldownRemovalQueue = [];

const addCooldown = (userId, cooldownTime) => {
    if (cooldowns[userId]) {
        return;
    }
    cooldowns[userId] = true;
    setTimeout(() => {
        cooldownRemovalQueue.push(() => {
            delete cooldowns[userId];
        });
    }, cooldownTime);
}

const processCooldownRemovalQueue = () => {
    if (cooldownRemovalQueue.length > 0) {
        const removalAction = cooldownRemovalQueue.shift();
        removalAction();
        processCooldownRemovalQueue();
    }
}

const hasCooldown = (userId) => cooldowns[userId]

module.exports = {addCooldown, processCooldownRemovalQueue, hasCooldown}