// cypress/e2e/project_akhir/dashboard.cy.js

import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('2. OrangeHRM Dashboard & Directory Automasi (5 Tes)', () => {
    const loginPage = new LoginPage();
    const dashboardPage = new DashboardPage();
    
    // Blok beforeEach yang distabilkan
    beforeEach(() => {
        cy.session('adminLogin', () => {
            loginPage.visitLoginPage();
            
            // Wajib: Tunggu field username terlihat untuk stabilitas cy.session
            loginPage.getUsernameField().should('be.visible'); 
            
            cy.intercept('POST', '**/auth/validate').as('login');
            loginPage.login('Admin', 'admin123');
            cy.wait('@login');
            cy.url().should('include', '/dashboard');
        });
        
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    });

    // --- Test Case 6: Verifikasi Dashboard Header ---
    it('TC-DB-01: Verifikasi header Dashboard ditampilkan dengan benar', () => {
        loginPage.getDashboardHeader().should('be.visible').and('contain', 'Dashboard');
    });

    // --- Test Case 7: Navigasi ke Menu Directory ---
    it('TC-DB-02: Berhasil navigasi dari Dashboard ke Menu Directory', () => {
        dashboardPage.goToDirectory();
        
        cy.get('.oxd-text--h6').contains('Directory').should('be.visible'); 
    });

    // --- Test Case 8: Directory Search (Empty Search) ---
    it('TC-DR-01: Directory Search (tanpa filter) dan verifikasi API call (Intercept)', () => {
        dashboardPage.goToDirectory();
        
        cy.get('.oxd-text--h6').contains('Directory').should('be.visible'); 

        cy.intercept('GET', '**/api/v2/directory/employees?*').as('directorySearch');

        dashboardPage.getSearchButton().click(); 
        
        cy.wait('@directorySearch').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
            expect(interception.request.url).to.include('/api/v2/directory/employees?');
        });
        
        cy.contains('.orangehrm-horizontal-padding > .oxd-text', 'Records Found')
            .should('be.visible');
    });
    
    // --- Test Case 9: Directory Search dengan Autocomplete ---
    it('TC-DR-02: Directory Search dengan Autocomplete Employee Name dan verifikasi hasil di UI', () => {
        dashboardPage.goToDirectory();
        
        cy.get('.oxd-text--h6').contains('Directory').should('be.visible'); 
        
        const partialName = 'Amelia'; 
        const fullName = 'Amelia Brown'; 
        
        // 1. Ketik sebagian nama
        dashboardPage.getEmployeeNameInput().type(partialName);
        
        // 2. Klik rekomendasi yang muncul (Tunggu sampai muncul)
        dashboardPage.getAutocompleteOption(fullName).should('be.visible').click();

        // 3. Klik tombol Search
        dashboardPage.getSearchButton().click();
        
        cy.wait(500); // Tunggu sebentar untuk memuat hasil

        // Verifikasi hasil UI: pastikan hanya satu record ditemukan
        cy.contains('.orangehrm-horizontal-padding > .oxd-text', 'Record Found')
            .should('be.visible');
    });
    
    // --- Test Case 10: Verifikasi keberadaan elemen Search/Reset di Directory ---
    it('TC-DR-03: Memastikan tombol Search & Reset Directory terlihat', () => {
        dashboardPage.goToDirectory();
        
        cy.get('.oxd-text--h6').contains('Directory').should('be.visible'); 
        
        dashboardPage.getSearchButton().should('be.visible').and('contain', 'Search');
        cy.contains('.oxd-button--ghost', 'Reset').should('be.visible'); 
    });
});