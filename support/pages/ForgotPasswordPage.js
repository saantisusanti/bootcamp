// cypress/support/pages/ForgotPasswordPage.js

class ForgotPasswordPage {
    // --- Locators ---
    getForgotPasswordLink() {
        return cy.get('.orangehrm-login-forgot-header'); // Link 'Forgot your password?' di halaman login
    }

    getUsernameField() {
        return cy.get('input[name="username"]');
    }

    getResetPasswordButton() {
        return cy.get('button[type="submit"]'); // Tombol Reset Password
    }

    getCancelButton() {
        return cy.get('.oxd-button--ghost'); // Tombol Cancel
    }

    getSuccessMessage() {
        // Locator untuk pesan sukses 'Reset Password link sent successfully'
        return cy.get('.orangehrm-card-container > .oxd-text--h6'); 
    }

    getResetPasswordHeader() {
        return cy.get('.orangehrm-forgot-password-title'); // Header 'Reset Password'
    }

    // --- Actions ---

    // Navigasi ke halaman Forgot Password
    goToForgotPassword() {
        this.getForgotPasswordLink().click();
        cy.url().should('include', 'requestPasswordResetCode');
        this.getResetPasswordHeader().should('be.visible').and('contain', 'Reset Password');
    }

    // Mengisi username dan klik Reset Password
    submitResetPassword(username) {
        this.getUsernameField().type(username);
        this.getResetPasswordButton().click();
    }
}

export default ForgotPasswordPage;