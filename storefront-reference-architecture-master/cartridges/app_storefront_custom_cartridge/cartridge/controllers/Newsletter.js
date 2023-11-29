"use strict";

/**
 * @namespace Account
 */

var server = require("server");

var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

/**
 * Checks if the email value entered is correct format
 * @param {string} email - email string to check if valid
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

/**
 * Account-EditProfile : The Account-EditProfile endpoint renders the page that allows a shopper to edit their profile. The edit profile form is prefilled with the shopper's first name, last name, phone number and email
 * @name Base/Account-EditProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.generateToken
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {middleware} - consentTracking.consent
 * @param {category} - sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get(
    "Show",
    server.middleware.https,
    csrfProtection.generateToken,
    consentTracking.consent,
    function (req, res, next) {
        var Resource = require("dw/web/Resource");
        var URLUtils = require("dw/web/URLUtils");

        const newsletterForm = server.forms.getForm("newsletter");
        newsletterForm.clear();
        res.render("newsletter", { newsletterForm: newsletterForm });
        next();
    }
);

/**
 * Account-SaveProfile : The Account-SaveProfile endpoint is the endpoint that gets hit when a shopper has edited their profile
 * @name Base/Account-SaveProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {httpparameter} - dwfrm_profile_customer_firstname - Input field for the shoppers's first name
 * @param {httpparameter} - dwfrm_profile_customer_lastname - Input field for the shopper's last name
 * @param {httpparameter} - dwfrm_profile_customer_phone - Input field for the shopper's phone number
 * @param {httpparameter} - dwfrm_profile_customer_email - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_customer_emailconfirm - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_login_password  - Input field for the shopper's password
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensititve
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.post(
    "Save",
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var Transaction = require("dw/system/Transaction");
        var CustomerMgr = require("dw/customer/CustomerMgr");
        var Resource = require("dw/web/Resource");
        var URLUtils = require("dw/web/URLUtils");
        var accountHelpers = require("*/cartridge/scripts/helpers/accountHelpers");
        var CustomObjectMgr = require("dw/object/CustomObjectMgr");
        var formErrors = require("*/cartridge/scripts/formErrors");

        const NEWSLETTER_TYPE = "Hristian_NewsletterSubscription";
        const newsletterForm = server.forms.getForm("newsletter");
        const newsletterResult = CustomObjectMgr.getCustomObject(
            NEWSLETTER_TYPE,
            newsletterForm.newsletter.email.value
        );
        if (!empty(newsletterResult)) {
            newsletterForm.valid = false;
            newsletterForm.newsletter.email.valid = false;
            newsletterForm.newsletter.email.error = Resource.msg(
                "error.message.mismatch.email",
                "forms",
                null
            );
        }
        if (newsletterForm.valid) {
            Transaction.wrap(function () {
                const newsletterEntry = CustomObjectMgr.createCustomObject(
                    NEWSLETTER_TYPE,
                    newsletterForm.newsletter.email.value
                );
                newsletterEntry.custom.Hristian_firstName =
                    newsletterForm.newsletter.firstname.value;
                newsletterEntry.custom.Hristian_lastName =
                    newsletterForm.newsletter.lastname.value;
                newsletterEntry.custom.gender =
                    newsletterForm.newsletter.gender.value;
            });

            res.json({
                success: true,
                redirectUrl: URLUtils.url("Newsletter-Show").toString(),
            });
        } else {
            res.json({
                success: false,
                fields: formErrors.getFormErrors(newsletterForm),
            });
        }

        return next();
    }
);

module.exports = server.exports();
