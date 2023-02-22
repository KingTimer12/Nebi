module.exports = class RankData {
    constructor(xp = 0, level = 1, wallpaper = "https://i.imgur.com/H1GXNG4.jpg") {
        this.xp = xp;
        this.level = level;
        this.wallpaper = wallpaper;
    }

    addXp = (xp) => {
        this.xp += xp
    }

    addLevel = () => {
        this.level++
    }

    setWallpaper = (url) => {
        this.wallpaper = url
    }

}