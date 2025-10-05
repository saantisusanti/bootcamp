// cypress/support/pages/DashboardPage.js

class DashboardPage {
    // --- Locators ---
    getSidebarMenu() {
        return cy.get('.oxd-sidepanel-body');
    }
    
    getDirectoryMenu() {
        return this.getSidebarMenu().contains('Directory');
    }

    getSearchButton() {
        return cy.get('button[type="submit"]');
    }
    
    getEmployeeNameInput() {
        return cy.get('.oxd-autocomplete-text-input > input');
    }

    // Locator untuk elemen rekomendasi yang muncul (autocomplete dropdown)
    getAutocompleteOption(name) {
        return cy.get('.oxd-autocomplete-dropdown').contains(name);
    }
    
    // Locator untuk mendapatkan teks nama karyawan di kartu hasil
    getFirstEmployeeCardNameText() {
        // Menyasar elemen teks yang paling mungkin berisi nama karyawan di kartu hasil pencarian
        return cy.get('.orangehrm-container .oxd-text--h6').first(); 
    }

    // --- Actions ---

    // Navigasi ke menu Directory
    goToDirectory() {
        this.getDirectoryMenu().click();
        cy.url().should('include', '/directory');
    }
}

export default DashboardPage;