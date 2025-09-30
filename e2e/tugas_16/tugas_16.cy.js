// orangehrm_login_with_intercept.cy.js

// Mendefinisikan Test Suite untuk Login OrangeHRM
describe('OrangeHRM Login Feature - Intercepting API Calls', () => {

    // Hook: Berjalan sebelum setiap block 'it'.
    beforeEach(() => {
        // Mengunjungi halaman login OrangeHRM Demo
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        cy.url().should('include', 'auth/login');
    });

    // TC01: Login Berhasil (Validasi Status Code 302 dan Header Location)
    // -----------------------------------------------------------
    it('TC01 - Should log in successfully and intercept Login POST with Status 302', () => {
        // 1. Intercept: Aliaskan request POST Login
        // URL intercept: '/web/index.php/auth/validate'
        cy.intercept('POST', '/web/index.php/auth/validate').as('loginRequest');

        // 2. Aksi: Lakukan Login
        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        // 3. Validasi Intercept
        cy.wait('@loginRequest').then((interception) => {
            // Validasi 1: Status Code harus 302 (Found/Redirect)
            expect(interception.response.statusCode).to.eq(302);
            
            // Validasi 2: Memastikan ada Header 'location' yang mengarah ke dashboard
            expect(interception.response.headers.location).to.include('/dashboard/index');
        });

        // 4. Validasi UI (Verifikasi bahwa redirect berhasil)
        cy.url().should('include', '/dashboard/index');
        cy.get('.oxd-topbar-header-breadcrumb > .oxd-text').should('contain', 'Dashboard');
    });


    // TC02: Login Gagal (Invalid Username - Validasi Status Code 302 dan Redirect ke Login)
// -----------------------------------------------------------
it('TC02 - Should display error for invalid username and intercept Status 302 redirecting to Login', () => {
    // 1. Intercept: Aliaskan request POST Login
    cy.intercept('POST', '/web/index.php/auth/validate').as('loginRequest');

    // 2. Aksi: Lakukan Login dengan username salah
    cy.get('input[name="username"]').type('userSalah');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // 3. Validasi Intercept
    // Validasi Status 302 dan pastikan header location mengarah kembali ke halaman login
    cy.wait('@loginRequest').then((interception) => {
        // Validasi 1: Status Code harus 302 (Redirect)
        expect(interception.response.statusCode).to.eq(302);
        
        // Validasi 2: Memastikan Header 'location' mengarah kembali ke URL login
        expect(interception.response.headers.location).to.include('/auth/login');
    });
    
    // 4. Validasi UI (Pesan error harus terlihat)
    cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
});

    // -----------------------------------------------------------
    // TC03: Login Gagal (Invalid Password - Validasi Request Body)
    // -----------------------------------------------------------
    it('TC03 - Should display error for invalid password and intercept Request Body contains password', () => {
        // 1. Intercept: Aliaskan request POST Login
        cy.intercept('POST', '/web/index.php/auth/validate').as('loginRequest');

        // 2. Aksi: Lakukan Login dengan password salah
        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('passwordSalah');
        cy.get('button[type="submit"]').click();

        // 3. Validasi Intercept
        // Validasi request body yang dikirim ke API
        cy.wait('@loginRequest').its('request.body').should('include', 'Admin');

        // 4. Validasi UI
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });

   // -----------------------------------------------------------
// TC04: Username Kosong (Validasi Network: Memastikan Navigasi Dashboard Gagal)
// -----------------------------------------------------------
it('TC04 - Should display "Required" error and intercept to confirm Dashboard request failed', () => {
    // 1. Intercept: Aliaskan request yang hanya terjadi SETELAH login berhasil (e.g., loading Employee List)
    cy.intercept('GET', '/web/index.php/pim/viewEmployeeList').as('dashboardRequest');
    
    // 2. Aksi: Lakukan Login yang Gagal (Username Kosong)
    cy.get('input[name="password"]').type('admin123'); // Isi hanya password
    cy.get('button[type="submit"]').click();

    // 3. Validasi Intercept
    // Assert: Pastikan request yang menuju dashboard TIDAK PERNAH terjadi (karena login gagal)
    cy.wait(100).then(() => {
        cy.get('@dashboardRequest.all').should('have.length', 0); // Memastikan request ini 0 kali terjadi
    });
    
    // 4. Validasi UI (Validasi client-side error)
    // Ganti selector lama yang error (label-span) dengan selector yang benar (oxd-text--span)
    cy.get(':nth-child(2) > .oxd-input-group > .oxd-text--span')
      .should('be.visible')
      .and('have.text', 'Required');
});

// -----------------------------------------------------------
// TC05: Semua Field Kosong (Validasi Network: Memastikan Tidak Ada Request Login yang Dikirim)
// -----------------------------------------------------------
it('TC05 - Should display "Required" errors and intercept to confirm Login API request failed', () => {
    // 1. Intercept: Aliaskan request POST Login
    cy.intercept('POST', '/web/index.php/auth/validate').as('loginRequest');

    // 2. Aksi: Klik tombol Login
    cy.get('button[type="submit"]').click();

    // 3. Validasi Intercept
    // Assert: Pastikan request Login API TIDAK PERNAH terjadi
    cy.wait(100).then(() => {
        cy.get('@loginRequest.all').should('have.length', 0);
    });

    // 4. Validasi UI (Validasi client-side error)
    cy.get(':nth-child(2) > .oxd-input-group > .oxd-text--span') 
      .should('be.visible')
      .and('have.text', 'Required');
    cy.get(':nth-child(3) > .oxd-input-group > .oxd-text--span') 
      .should('be.visible')
      .and('have.text', 'Required');
});
});