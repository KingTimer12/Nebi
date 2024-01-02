const { db } = require('../firebase_app')
const { ref, child, get, remove, set, update, query, orderByChild } = require('firebase/database')
const badges = require("../../config/badges.json");
const { getRole } = require('./guildManager');

const create_profile = async (userId, username) => {
    const dbRef = ref(db());
    const profile = await get(child(dbRef, `Profiles/${userId}`))
    if (profile.exists()) return

    await set(child(dbRef, `Profiles/${userId}`), {
        username: username,
        level: 1,
        glows: 0,
        xp: 0,
        about_me: "Aqui ficará o seu sobre mim.",
        badges: [],
        flag: 'br',
        background: 'default',
        last_message: null
    }).catch(console.error)
}

const remove_profile = async (userId) => {
    const dbRef = ref(db());
    const profile = await get(child(dbRef, `Profiles/${userId}`))
    if (!profile.exists()) return

    await remove(child(dbRef, `Profiles/${userId}`)).catch(console.error)
}

const update_profile = async (userId, value) => {
    const dbRef = ref(db());
    const profile = await get(child(dbRef, `Profiles/${userId}`))
    if (!profile.exists()) return
    await update(child(dbRef, `Profiles/${userId}`), value).catch(console.error)
}

const update_badges = async (member, profile) => {
    const {guild, user} = member
    const userId = user.id
    const userProfile = profile ?? await getProfile(userId)
    const hasBadges = userProfile.val().badges ?? []
    for (const badge of badges.raw_names) {
        const roleId = await getRole(guild, {roleName: badge})
        if (!roleId) continue
        const role = member.roles.cache.find(role => role.id == roleId)
        if (!role) continue
        const has = hasBadges.filter(b => b != undefined).find(b => b.name == badge)
        if (has) continue
        hasBadges.push({
            name: badge,
            enabled: true
        })
    }
    console.log(hasBadges)
    await update_profile(userId, {
        badges: hasBadges
    })
}

const getProfile = async (userId) => {
    const dbRef = ref(db());
    return await get(child(dbRef, `Profiles/${userId}`)).catch(console.error)
}

const getGlows = async (userId) => {
    const profile = await getProfile(userId)
    if (!profile.exists()) return
    return Number(profile.val().glows)
}

const getXp = async (userId) => {
    const profile = await getProfile(userId)
    if (!profile.exists()) return
    return Number(profile.val().xp)
}

const getLastMessage = async (userId) => {
    const profile = await getProfile(userId)
    if (!profile.exists()) return
    return new Date(profile.val().last_message)
}

const calcCheck = (level) => level ^ 2 * 100

const readjustLevel = async (userId, xp) => {
    const profile = await getProfile(userId)
    if (!profile.exists()) return
    const currentLevel = Number(profile.val().level)
    while (true) {
        const nextLevel = currentLevel + 1;
        if (xp >= calcCheck(nextLevel)) {
            return currentLevel + 1
        } else {
            if (xp >= calcCheck(currentLevel)) break;
            if (currentLevel == 1) break;
            return currentLevel + 1
        }
    }
    return currentLevel
};

const removeInactiveUsers = async () => {

}

const getRanking = async (userId) => {
    const dbRef = ref(db(), `Profiles`);
    const ranking = query(dbRef, orderByChild('xp'))

    const snapshot = await get(ranking).catch(console.error)
    if (snapshot.exists()) {
        const list = new Set();
        const array = Object.keys(snapshot.val());

        array.forEach((index) => {
            const infoMembro = { id: `${index}`, xp: snapshot.val()[index].xp };
            list.add(infoMembro)
        });
        const pe = Array.from(list);
        const organize = pe.sort((a, b) => {
            if (a.xp < b.xp) {
                return 1;
            }
            if (a.xp > b.xp) {
                return -1;
            }
            return 0;
        });
        let index = 1
        for (const i in organize) {
            const member = organize[i]
            if (member.id == userId)
                return `${index >= 10 ? index : "0" + index}`
            index++;
        }
    }
}

module.exports = { 
    
    getRanking, getLastMessage, getGlows, getXp, 
    getProfile,

    
    readjustLevel, 
    create_profile, 
    update_profile,
    update_badges,

    remove_profile,

    calcCheck

}