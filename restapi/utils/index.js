const handleItemID = require("./itemHandler"),
    deleteItemById = require("./dataHandler"),
    fsWriteFile = require("./fsWriteFile");

// module.exports = {
//     getItemNoteById: handleItemID,
//     deleteItemById,
//     writeFile: fsWriteFile,
// };

module.exports = {
    handleItemID,
    deleteItemById,
    fsWriteFile,
};