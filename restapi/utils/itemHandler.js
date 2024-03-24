function handleItemID(queryID, data) {
    for (let item of data) {
        if (item.id === queryID) {
            return `${item.title}\n\n${item.message}`;
        }
    }

    return "";
}

module.exports = handleItemID;