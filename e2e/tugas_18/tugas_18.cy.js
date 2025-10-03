/// <reference types="cypress" />

describe('ReqRes API Automation with Custom Header', () => {
    // Definisikan header yang akan digunakan di semua request
    const customHeader = {
        'x-api-key': 'reqres-free-v1'
    };

    // Definisikan base URL
    const baseUrl = 'https://reqres.in/api';

    it('1. GET - List Users (Page 2) with Custom Header', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/users?page=2`,
            headers: customHeader
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.length(6);
            expect(response.body.page).to.eq(2);
        });
    });

    it('2. GET - Single User (ID: 2) with Custom Header', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/users/2`,
            headers: customHeader
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.id).to.eq(2);
            expect(response.body.data).to.have.property('name');
        });
    });

    it('3. POST - Create User with Custom Header', () => {
        const newUser = {
            "name": "morpheus",
            "job": "leader"
        };
        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            headers: customHeader,
            body: newUser
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.name).to.eq(newUser.name);
            expect(response.body.job).to.eq(newUser.job);
            expect(response.body).to.have.property('id');
        });
    });

    it('4. PUT - Update User (ID: 2) with Custom Header', () => {
        const updatedUser = {
            "name": "morpheus updated",
            "job": "zion resident"
        };
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/users/2`,
            headers: customHeader,
            body: updatedUser
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.name).to.eq(updatedUser.name);
            expect(response.body.job).to.eq(updatedUser.job);
            expect(response.body).to.have.property('updatedAt');
        });
    });

    it('5. DELETE - Delete User (ID: 2) with Custom Header', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/users/2`,
            headers: customHeader
        }).then((response) => {
            expect(response.status).to.eq(204); // Status code 204 No Content untuk DELETE berhasil
            expect(response.body).to.be.empty;
        });
    });

    it('6. POST - Register Successful with Custom Header', () => {
        const credentials = {
            "email": "eve.holt@reqres.in",
            "password": "pistol"
        };
        cy.request({
            method: 'POST',
            url: `${baseUrl}/register`,
            headers: customHeader,
            body: credentials
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('token');
        });
    });

    it('7. GET - Single Resource (ID: 2) with Custom Header', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/unknown/2`, // Endpoint /unknown untuk Resource
            headers: customHeader
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.id).to.eq(2);
            expect(response.body.data).to.have.property('year');
        });
    });
});