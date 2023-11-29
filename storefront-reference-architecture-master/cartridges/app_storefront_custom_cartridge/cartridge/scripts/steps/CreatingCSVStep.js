var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Transaction = require("dw/system/Transaction");
var Logger = require("dw.system.Logger");
var { File, FileWriter, CSVStreamWriter } = require("dw/io");

module.exports.execute = function () {
    var customObjectIterator = CustomObjectMgr.getAllCustomObjects(
        "Hristian_NewsletterSubscription"
    );
    var CSVWriter;
    var file;
    var fileWriter;

    try {
        file = new File([File.IMPEX, "objects.csv"].join(File.SEPARATOR));
        fileWriter = new FileWriter(file);
        if (!fileWriter) {
            throw new Error("There is problem with fileWriter");
        }
        CSVWriter = new CSVStreamWriter(fileWriter);

        if (!CSVWriter) {
            throw new Error("There is problem with CSVStreamWriter");
        }

        CSVWriter.writeNext(["Email", "FirstName", "LastName", "Gender"]);
        while (customObjectIterator.hasNext()) {
            var newsletterObject = customObjectIterator.next();
            CSVWriter.writeNext([
                newsletterObject.custom.Hristian_email,
                newsletterObject.custom.Hristian_firstName,
                newsletterObject.custom.Hristian_lastName,
                newsletterObject.custom.gender,
            ]);
            Transaction.wrap(function () {
                CustomObjectMgr.remove(newsletterObject);
            });
        }
    } catch (error) {
        Logger.error("Error from job {0}:", error.message);
    } finally {
        if (CSVWriter) {
            CSVWriter.close();
        }
        if (fileWriter) {
            fileWriter.close();
        }
    }
};
