function addOptionsReactions(msg, opt_nbr) {
    for (let i = 1; i <= opt_nbr; i++) {
        switch (i) {
            case 1:
                msg.react('1️⃣');
                break;
            case 2:
                msg.react('2️⃣');
                break;
            case 3:
                msg.react('3️⃣');
                break;
            case 4:
                msg.react('4️⃣');
                break;
            case 5:
                msg.react('5️⃣');
                break;
            case 6:
                msg.react('6️⃣');
                break;
            case 7:
                msg.react('7️⃣');
                break;
            case 8:
                msg.react('8️⃣');
                break;
            case 9:
                msg.react('9️⃣');
                break;
            default:
                break;
        }
    }
}

function getChoiceByReact(emoji) {
    switch (emoji) {
        case '1️⃣':
            return 1;
        case '2️⃣':
            return 2;
        case '3️⃣':
            return 3;
        case '4️⃣':
            return 4;
        case '5️⃣':
            return 5;
        case '6️⃣':
            return 6;
        case '7️⃣':
            return 7;
        case '8️⃣':
            return 8;
        case '9️⃣':
            return 9;
        default:
            throw ("Wrong emoji")
    }
}