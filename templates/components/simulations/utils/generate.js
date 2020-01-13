import {sha256} from "js-sha256";

export default {
    generateHash: data => {
        return sha256(JSON.stringify(data));
    },
    generateUniqueId: function () {
        return (
            Date.now().toString(36) +
            Math.random().toString(36).substr(2, 5)
        ).toUpperCase();
    },
    generateColor: function () {
        return "#" + ("000000" + Math.floor(Math.random() * 0xffffff).toString(16)).slice(-6);
    },
    generateName: function (prevName) {
        if (!prevName) {
            prevName = "";
        }
        let number = 0;
        let name = prevName;
        const regExp = /(\s\d+)$/;
        const match = prevName.match(regExp);
        if (match) {
            number = parseInt(match[0]);
            name = name.replace(regExp, "");
        }
        return name + " " + ++number;
    }
};
