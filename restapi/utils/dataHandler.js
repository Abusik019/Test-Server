function deleteItemById(id, data) {
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
        data.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = deleteItemById;