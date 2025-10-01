// cypress/support/pages/LoginPage.js

class LoginPage {
    // --- Locators (Selektor Elemen) ---
    getUsernameField() {
        return cy.get('input[name="username"]');
    }

    getPasswordField() {
        return cy.get('input[name="password"]');
    }

    getLoginButton() {
        return cy.get('button[type="submit"]');
    }

    getDashboardHeader() {
        return cy.get('.oxd-topbar-header-breadcrumb > .oxd-text'); // Locator untuk Dashboard setelah login
    }

    getErrorMessage() {
        return cy.get('.oxd-alert-content-text'); // Locator untuk pesan error umum (e.g., Invalid credentials)
    }

    getUsernameRequiredError() {
        // Menggunakan :nth-child(2) karena Username biasanya grup input kedua di form
        return cy.get(':nth-child(2) > .oxd-input-group > .oxd-text--span');
    }

    getPasswordRequiredError() {
        // Menggunakan :nth-child(3) karena Password biasanya grup input ketiga di form
        return cy.get(':nth-child(3) > .oxd-input-group > .oxd-text--span');
    }

    // --- Actions (Metode Aksi) ---

    // Metode untuk mengunjungi halaman login
    visitLoginPage() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        cy.url().should('include', 'auth/login');
    }

    // Metode untuk mengisi formulir login
    fillLogin(username, password) {
        this.getUsernameField().type(username);
        this.getPasswordField().type(password);
    }

    // Metode untuk klik tombol login
    clickLogin() {
        this.getLoginButton().click();
    }

    // Metode lengkap untuk login
    login(username, password) {
        this.fillLogin(username, password);
        this.clickLogin();
    }
}

export default LoginPage;