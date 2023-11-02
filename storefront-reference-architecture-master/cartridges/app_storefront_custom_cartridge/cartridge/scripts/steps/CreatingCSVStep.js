var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Transaction = require("dw/system/Transaction");
var { File, FileWriter, CSVStreamWriter } = require("dw/io");

module.exports.execute = function () {
    try {
        var customObjectIterator = CustomObjectMgr.getAllCustomObjects(
            "Hristian_NewsletterSubscription"
        );
        var CSVWriter;
        var file;
        var fileWriter;

        file = new File([File.IMPEX, "objects.csv"].join(File.SEPARATOR));
        fileWriter = new FileWriter(file);

        CSVWriter = new CSVStreamWriter(fileWriter);

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
    } finally {
        CSVWriter.close();
        fileWriter.close();
    }
};
