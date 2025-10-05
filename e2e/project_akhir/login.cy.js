// cypress/e2e/project_akhir/login.cy.js

import LoginPage from '../../support/pages/LoginPage';
import ForgotPasswordPage from '../../support/pages/ForgotPasswordPage';

describe('1. OrangeHRM Login & Forgot Password Automasi (5 Tes)', () => {
    const loginPage = new LoginPage();
    const forgotPasswordPage = new ForgotPasswordPage();
    
    const validUsername = 'Admin';
    const validPassword = 'admin123';
    
    beforeEach(() => {
        loginPage.visitLoginPage(); 
    });

    // --- Test Case 1: Successful Login ---
    it('TC-LGN-01: Login berhasil dan verifikasi API Intercept dengan status 302', () => {
        cy.intercept('POST', '**/auth/validate').as('loginRequest');

        loginPage.login(validUsername, validPassword);

        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(302); 
        });

        loginPage.getDashboardHeader().should('be.visible').and('contain', 'Dashboard');
        cy.url().should('include', '/dashboard');
    });

    // --- Test Case 2: Failed Login - Invalid Credentials ---
    it('TC-LGN-02: Login gagal dengan kredensial salah dan verifikasi pesan error', () => {
        loginPage.login('invalidUser', 'wrongPass');
        loginPage.getErrorMessage().should('be.visible').and('contain', 'Invalid credentials');
    });

    // --- Test Case 3: Failed Login - Empty Username (UI Validation) ---
    it('TC-LGN-03: Login gagal dengan username kosong dan verifikasi pesan "Required"', () => {
        loginPage.login('{backspace}', validPassword);
        loginPage.getUsernameRequiredError().should('be.visible').and('contain', 'Required');
    });
    
    // --- Test Case 4: Forgot Password - Success Flow ---
    it('TC-FP-01: Berhasil meminta reset password dan verifikasi pesan sukses di UI', () => {
        forgotPasswordPage.goToForgotPassword();
        forgotPasswordPage.submitResetPassword(validUsername);

        cy.url().should('include', '/auth/sendPasswordReset'); 
        
        forgotPasswordPage.getSuccessMessage()
            .should('be.visible')
            .and('contain', 'Reset Password link sent successfully');
    });
    
    // --- Test Case 5: Forgot Password - Cancel to Login Page ---
    it('TC-FP-02: Tombol Cancel mengembalikan ke halaman Login', () => {
        forgotPasswordPage.goToForgotPassword();
        forgotPasswordPage.getCancelButton().click();
        cy.url().should('include', '/auth/login');
        loginPage.getLoginButton().should('be.visible');
    });
});