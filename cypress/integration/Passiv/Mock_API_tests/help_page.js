
    it('Email for help', () => {
      cy.intercept('POST', '/api/v1/auth/help', {
          statusCode: 200,
          body: 'it worked!'
      }).as('help')
      cy.intercept('POST', '/api/v1/feedback', {
          statusCode: 200,
          body: 'it worked!'
      }).as('email')
      cy.intercept('/api/v1/', {
        statusCode: 200,
        body: 'it worked!'
      }).as('api poke')


      cy.fixture('localhost').as('server')
      cy.get('@server').then(domain => {
      cy.visit('/app/help/' ,{ responseTimeout: 310000 })

      cy.fixture('user').as('userFixture')
      cy.get('@userFixture').then(user => {
          cy.get('[name=le]').first().type(user.email)
          cy.get('[name=lm]').first().type("test")
      })

      cy.get('button').contains('Submit').click()
    })
  })