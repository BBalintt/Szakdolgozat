describe('FurulyatáR alap tesztek', () => {
  beforeEach(() => {
    cy.visit('https://hbalintt.web.elte.hu/furulyatar/view/loader.php');
  });

  it('a furulya választó tartalmaz választható elemeket', () => {
    cy.get('#chooserec option')
      .should('have.length.greaterThan', 1);
  });

  it('betölti a furulyák oldalt', () => {
    cy.get('#chooserec', { timeout: 10000 }).should('exist');
    cy.get('#chooserec').select(1)
    cy.get('#recorderToggle').should('exist');
  });

  it('furulya kiválasztása után megjelennek a hangkártyák', () => {
    cy.get('#chooserec').select(1);

    cy.get('.note-card', { timeout: 10000 })
      .should('have.length.greaterThan', 0);
  });

  it('3D nézetre váltáskor lefut a nézetváltás', () => {
    cy.get('#chooserec').select(1);

    cy.get('#recorderToggle').check({ force: true });

    cy.get('#noteSlider').should('exist');
    cy.get('#noteContainer').should('exist');
  });

  it('2D nézetben láthatók a fogáskártyák', () => {
    cy.get('#chooserec').select(1);

    cy.get('#recorderToggle').uncheck({ force: true });

    cy.get('.fingeringCard', { timeout: 10000 }).should('exist');
  });

   it('menüből navigál és bejelentkezik', () => {

    // 1. Rákattint a menüben a Bejelentkezésre
    cy.contains('a', 'Bejelentkezés').click();

    // 2. Ellenőrzi hogy login oldalra jutott
    cy.url().should('include', 'signin.php');

    // 3. Kitölti az adatokat
    cy.get('#username').type('123');
    cy.get('#password').type('123');

    // 4. Submit
    cy.get('#loginForm').submit();

    // 5. Ellenőrzés (alert vagy redirect)
    cy.on('window:alert', (text) => {
      expect(text).to.contain('Sikeres');
    });
  });

  it('bejelentkezés után új furulyát ad hozzá', () => {
  const recorderName = 'cypress_test_' + Date.now();

  cy.contains('a', 'Bejelentkezés').click();
  cy.url().should('include', 'signin.php');

  cy.get('#username').type('123');
  cy.get('#password').type('123');

  cy.get('#loginForm').submit();

  cy.contains('a', 'Új furulya hozzáadása', { timeout: 10000 }).click();

  cy.url().should('include', 'recorders.php');

  cy.get('#name').type(recorderName);
  cy.get('#description').type('Cypress által létrehozott teszt furulya');
  cy.get('#pipe_number').clear().type('1');

  const alerts = [];

  cy.on('window:alert', (text) => {
    alerts.push(text);
  });

  cy.get('#holes1', { timeout: 10000 }).clear().type('6');

  cy.get('input[value="Furulya mentése"]').click();

  cy.wrap(alerts).should((arr) => {
    expect(arr).to.include('Furulya sikeresen mentve!');
  });
  });
});