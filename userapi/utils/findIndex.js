const findIndex = (data, id) => {
    const currentIndex = data.findIndex(el => el.id === +id);
    if(currentIndex !== -1){
        data.splice(currentIndex, 1);
        return true
    }

    return false
};

module.exports = findIndex;