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
    userLoggedIn.validateLoggedIn,
    consentTracking.consent,
    function (req, res, next) {
        var Resource = require("dw/web/Resource");
        var URLUtils = require("dw/web/URLUtils");
        const newsletterForm = server.forms.getForm("newsletter");
        newsletterForm.clear();
        res.render("newsletter", { newsletterForm: newsletterForm });

        // var accountModel = accountHelpers.getAccountModel(req);
        // var content = ContentMgr.getContent("tracking_hint");
        // var profileForm = server.forms.getForm("profile");
        // profileForm.clear();
        // profileForm.customer.firstname.value = accountModel.profile.firstName;
        // profileForm.customer.lastname.value = accountModel.profile.lastName;
        // profileForm.customer.phone.value = accountModel.profile.phone;
        // profileForm.customer.email.value = accountModel.profile.email;
        // res.render("account/profile", {
        //     consentApi: Object.prototype.hasOwnProperty.call(
        //         req.session.raw,
        //         "setTrackingAllowed"
        //     ),
        //     caOnline: content ? content.online : false,
        //     profileForm: profileForm,
        //     breadcrumbs: [
        //         {
        //             htmlValue: Resource.msg("global.home", "common", null),
        //             url: URLUtils.home().toString(),
        //         },
        //         {
        //             htmlValue: Resource.msg(
        //                 "page.title.myaccount",
        //                 "account",
        //                 null
        //             ),
        //             url: URLUtils.url("Account-Show").toString(),
        //         },
        //     ],
        // });
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
    "SaveProfile",
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

        const neswletterForm = server.forms.getForm("newsletter");
        const NEWSLETTER_TABLE_NAME = "NEWSLETTER_SUBSCRIPTION";
        const newsletterResult = CustomObjectMgr.getCustomObject(
            NEWSLETTER_TABLE_NAME,
            newsletterForm.customer.email.value
        );
        if (!empty(newsletterResult)) {
            newsletterForm.valid = false;
            newsletterForm.customer.email.valid = false;
            newsletterForm.customer.email.error = Resource.msg(
                "error.message.mismatch.email",
                "forms",
                null
            );
        }
        if (newsletterForm.valid) {
            Transaction.wrap(function () {
                newsletterEntry = CustomObjectMgr.createCustomObject(
                    NEWSLETTER_TABLE_NAME,
                    newsletterForm.customer.email.value
                );
                newsletterEntry.fullName =
                    newsletterForm.customer.fullname.value;
                newsletterEntry.skinType =
                    newsletterForm.customer.skinType.value;
            });
        }
        res.json({
            success: true,
            redirectUrl: URLUtils.url("Newsletter-Show").toString(),
        });
        // if (
        //     profileForm.customer.email.value.toLowerCase() !==
        //     profileForm.customer.emailconfirm.value.toLowerCase()
        // ) {
        //     // form validation
        //     profileForm.valid = false;
        //     profileForm.customer.email.valid = false;
        //     profileForm.customer.emailconfirm.valid = false;
        //     profileForm.customer.emailconfirm.error = Resource.msg(
        //         "error.message.mismatch.email",
        //         "forms",
        //         null
        //     );
        // }

        // var result = {
        //     firstName: profileForm.customer.firstname.value,
        //     lastName: profileForm.customer.lastname.value,
        //     phone: profileForm.customer.phone.value,
        //     email: profileForm.customer.email.value,
        //     confirmEmail: profileForm.customer.emailconfirm.value,
        //     password: profileForm.login.password.value,
        //     profileForm: profileForm,
        // };
        // if (profileForm.valid) {
        //     res.setViewData(result);
        //     this.on("route:BeforeComplete", function (req, res) {
        //         // eslint-disable-line no-shadow
        //         var formInfo = res.getViewData();
        //         var customer = CustomerMgr.getCustomerByCustomerNumber(
        //             req.currentCustomer.profile.customerNo
        //         );
        //         var profile = customer.getProfile();
        //         var customerLogin;
        //         var status;

        //         Transaction.wrap(function () {
        //             status = profile.credentials.setPassword(
        //                 formInfo.password,
        //                 formInfo.password,
        //                 true
        //             );

        //             if (status.error) {
        //                 formInfo.profileForm.login.password.valid = false;
        //                 formInfo.profileForm.login.password.error =
        //                     Resource.msg(
        //                         "error.message.currentpasswordnomatch",
        //                         "forms",
        //                         null
        //                     );
        //             } else {
        //                 customerLogin = profile.credentials.setLogin(
        //                     formInfo.email,
        //                     formInfo.password
        //                 );
        //             }
        //         });

        //         delete formInfo.password;
        //         delete formInfo.confirmEmail;

        //         if (customerLogin) {
        //             Transaction.wrap(function () {
        //                 profile.setFirstName(formInfo.firstName);
        //                 profile.setLastName(formInfo.lastName);
        //                 profile.setEmail(formInfo.email);
        //                 profile.setPhoneHome(formInfo.phone);
        //             });

        //             // Send account edited email
        //             accountHelpers.sendAccountEditedEmail(customer.profile);

        //             delete formInfo.profileForm;
        //             delete formInfo.email;

        //             res.json({
        //                 success: true,
        //                 redirectUrl: URLUtils.url("Account-Show").toString(),
        //             });
        //         } else {
        //             if (!status.error) {
        //                 formInfo.profileForm.customer.email.valid = false;
        //                 formInfo.profileForm.customer.email.error =
        //                     Resource.msg(
        //                         "error.message.username.invalid",
        //                         "forms",
        //                         null
        //                     );
        //             }

        //             delete formInfo.profileForm;
        //             delete formInfo.email;

        //             res.json({
        //                 success: false,
        //                 fields: formErrors.getFormErrors(profileForm),
        //             });
        //         }
        //     });
        // } else {
        //     res.json({
        //         success: false,
        //         fields: formErrors.getFormErrors(profileForm),
        //     });
        // }
        return next();
    }
);

module.exports = server.exports();
