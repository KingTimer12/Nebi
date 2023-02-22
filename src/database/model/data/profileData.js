module.exports = class ProfileData {
  constructor(
    aboutMe = "Não há nada aqui.",
    birthday = "??/??",
    glows = 0,
    badges = new Map(),
    wallpaper = "https://i.imgur.com/H1GXNG4.jpg"
  ) {
    this.aboutMe = aboutMe
    this.birthday = birthday
    this.glows = glows
    this.badges = badges
    this.wallpaper = wallpaper
  }

  setGlows = (glows) => {
    this.glows = glows
  }

  addBadge = (badgeId, badgeUrl) => {
    this.badges.set(badgeId, badgeUrl)
  }

  removeBadge = (badgeId) => {
    this.badges.delete(badgeId)
  }

  setWallpaper = (url) => {
    this.wallpaper = url
  }

  setBirthday = (day, month) => {
    this.birthday = `${day}/${month}`
  }
};
