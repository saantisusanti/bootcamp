// orangehrm.cy.js

// Mendefinisikan Test Suite untuk Login OrangeHRM
describe('OrangeHRM Login Feature', () => {

    // Hook: Berjalan sebelum setiap block 'it'. Digunakan untuk mengunjungi halaman login.
    beforeEach(() => {
        // Mengunjungi halaman login OrangeHRM Demo
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        cy.url().should('include', 'auth/login'); // Memastikan berada di halaman login
    });

    // --- Test Case 1: Login Berhasil (Skenario Positif) ---
    it('TC01 - Should log in successfully with valid credentials', () => {
        // 1. Masukkan Username yang valid
        cy.get('input[name="username"]').type('Admin');
        // 2. Masukkan Password yang valid
        cy.get('input[name="password"]').type('admin123');
        // 3. Klik tombol Login
        cy.get('button[type="submit"]').click();

        // 4. Assert: Verifikasi login berhasil dengan memeriksa URL atau elemen di Dashboard
        cy.url().should('include', '/dashboard/index');
        cy.get('.oxd-topbar-header-breadcrumb > .oxd-text').should('contain', 'Dashboard');
    });

    // --- Test Case 2: Login Gagal (Invalid Username) ---
    it('TC02 - Should display error for invalid username and valid password', () => {
        // 1. Masukkan Username yang tidak valid
        cy.get('input[name="username"]').type('userSalah');
        // 2. Masukkan Password yang valid
        cy.get('input[name="password"]').type('admin123');
        // 3. Klik tombol Login
        cy.get('button[type="submit"]').click();

        // 4. Assert: Verifikasi pesan error 'Invalid credentials' muncul
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
        // 5. Assert: Verifikasi masih di halaman login
        cy.url().should('include', 'auth/login');
    });

    // --- Test Case 3: Login Gagal (Invalid Password) ---
    it('TC03 - Should display error for valid username and invalid password', () => {
        // 1. Masukkan Username yang valid
        cy.get('input[name="username"]').type('Admin');
        // 2. Masukkan Password yang tidak valid
        cy.get('input[name="password"]').type('passwordSalah');
        // 3. Klik tombol Login
        cy.get('button[type="submit"]').click();

        // 4. Assert: Verifikasi pesan error 'Invalid credentials' muncul
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
        // 5. Assert: Verifikasi masih di halaman login
        cy.url().should('include', 'auth/login');
    });

    // --- Test Case 4: Login Gagal (Username Kosong) ---
    it('TC04 - Should display "Required" error when username field is empty', () => {
        // 1. Masukkan Password yang valid
        cy.get('input[name="password"]').type('admin123');
        // 2. Klik tombol Login
        cy.get('button[type="submit"]').click();

        // 3. Assert: Verifikasi pesan error 'Required' di bawah field username
        // Mencari grup input kedua (Username) dan memverifikasi teks errornya.
        cy.get(':nth-child(2) > .oxd-input-group > .oxd-text--span')
          .should('be.visible')
          .and('have.text', 'Required');
    });

    // --- Test Case 5: Login Gagal (Semua Field Kosong) ---
    it('TC05 - Should display "Required" errors when both fields are empty', () => {
        // 1. Biarkan kedua field kosong
        // 2. Klik tombol Login
        cy.get('button[type="submit"]').click();

        // 3. Assert 1: Verifikasi pesan error 'Required' muncul di bawah field Username
        // Locator untuk Username (Grup input ke-2 di form)
        cy.get(':nth-child(2) > .oxd-input-group > .oxd-text--span')
          .should('be.visible')
          .and('have.text', 'Required');

        // 4. Assert 2: Verifikasi pesan error 'Required' muncul di bawah field Password
        // Locator untuk Password (Grup input ke-3 di form)
        cy.get(':nth-child(3) > .oxd-input-group > .oxd-text--span')
          .should('be.visible')
          .and('have.text', 'Required');

        // Assert Tambahan: Verifikasi tidak ada pesan error 'Invalid credentials' di atas form
        cy.get('.oxd-alert-content-text').should('not.exist');
    });
});