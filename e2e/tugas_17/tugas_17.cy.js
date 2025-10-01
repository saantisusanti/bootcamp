import LoginPage from '../support/pages/LoginPage';

// Mendefinisikan Test Suite
describe('OrangeHRM Login Feature - POM Implementation', () => {
    // Inisialisasi objek Page Object
    const loginPage = new LoginPage();
    let creds; // Variabel untuk menyimpan data dari fixture

    // Hook: Berjalan sebelum semua block 'it' untuk memuat data
    before(() => {
        // Memuat data dari credentials.json
        cy.fixture('credentials').then((data) => {
            creds = data;
        });
    });

    // Hook: Berjalan sebelum setiap block 'it'. Menggunakan method dari Page Object.
    beforeEach(() => {
        loginPage.visitLoginPage();
    });

    // ----------------------------------------------------------------------

    // --- Test Case 1: Login Berhasil (Skenario Positif) ---
    it('TC01 - Should log in successfully with valid credentials', () => {
        // Menggunakan method 'login' dari Page Object dengan data dari fixture
        loginPage.login(creds.valid.username, creds.valid.password);

        // Assert: Verifikasi login berhasil
        cy.url().should('include', '/dashboard/index');
        loginPage.getDashboardHeader().should('contain', 'Dashboard');
    });

    // ----------------------------------------------------------------------

    // --- Test Case 2: Login Gagal (Invalid Username) ---
    it('TC02 - Should display error for invalid username and valid password', () => {
        // Menggunakan method 'login' dari Page Object dengan kombinasi data
        loginPage.login(creds.invalid.username, creds.valid.password);

        // Assert: Verifikasi pesan error 'Invalid credentials'
        loginPage.getErrorMessage().should('be.visible').and('contain', 'Invalid credentials');
        cy.url().should('include', 'auth/login');
    });

    // ----------------------------------------------------------------------

    // --- Test Case 3: Login Gagal (Invalid Password) ---
    it('TC03 - Should display error for valid username and invalid password', () => {
        // Menggunakan method 'login' dari Page Object dengan kombinasi data
        loginPage.login(creds.valid.username, creds.invalid.password);

        // Assert: Verifikasi pesan error 'Invalid credentials'
        loginPage.getErrorMessage().should('be.visible').and('contain', 'Invalid credentials');
        cy.url().should('include', 'auth/login');
    });

    // ----------------------------------------------------------------------

    // --- Test Case 4: Login Gagal (Username Kosong) ---
    it('TC04 - Should display "Required" error when username field is empty', () => {
        // Hanya mengisi password, lalu klik login
        loginPage.getPasswordField().type(creds.valid.password);
        loginPage.clickLogin();

        // Assert: Verifikasi pesan error 'Required' untuk username menggunakan locator dari Page Object
        loginPage.getUsernameRequiredError()
          .should('be.visible')
          .and('have.text', 'Required');
    });

    // ----------------------------------------------------------------------

    // --- Test Case 5: Login Gagal (Semua Field Kosong) ---
    it('TC05 - Should display "Required" errors when both fields are empty', () => {
        // Langsung klik tombol Login (dengan kedua field kosong)
        loginPage.clickLogin();

        // Assert 1: Verifikasi pesan error 'Required' di bawah field Username
        loginPage.getUsernameRequiredError()
          .should('be.visible')
          .and('have.text', 'Required');

        // Assert 2: Verifikasi pesan error 'Required' di bawah field Password
        loginPage.getPasswordRequiredError()
          .should('be.visible')
          .and('have.text', 'Required');

        // Assert Tambahan: Verifikasi tidak ada pesan error 'Invalid credentials'
        loginPage.getErrorMessage().should('not.exist');
    });
});