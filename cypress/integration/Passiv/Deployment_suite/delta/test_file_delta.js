
describe('Login and Adjust portfolio', () => {

  // Re-login
  it('Login test 2', () => {
      cy.fixture('testDomain').as('login')
      cy.get('@login').then(domain => {
      cy.visit((domain.test).concat('/login')) })
      cy.fixture('my_credentials').as('userFixture')
      cy.get('@userFixture').then(user => {
      cy.get('[name=email]').first().type(user.username)
      cy.get('[placeholder=Password]').type(user.password)

  // Verify the sign in button is enabled//
  cy.get('[data-cy=login-button]').should('not.be.disabled')
  .click({multiple:true})
  })
})

describe('Add goals', () => {

  it('Goals Test', () => {
    cy.contains('Goals').click()
    .should('have.attr', 'href', '/goals')
})


//these are the values for the goal
const goal1 = "Get the bag"
const goalnumber = "1000000"
const month = "July"
const year = "2050"

const goal2 = "Get the bread"
const goalnumber2 = "10000000"



it('Create a goal name', () => {
cy.get('[id=goalname]')
.clear()
.type(goal1)
.should('have.value', goal1)
})

it('Next' , () => {
cy.get('div').find('button').contains('Next')
.click()
})


it('Optional Account Selection ' , () => {
cy.get('div').find('button').contains('All Accounts')
.click()
})

//     // This is the block for no account@class='css-jm466k']

// it('Pick portfolio Account ' , () => {
//     cy.get('div').find('button').contains('Retirement TFSA')
//     .click()
// })

it('Next' , () => {
cy.get('div').find('button').contains('Next')
.click()
})

it('Enter goal ammount', () => {
cy.get('div').find('label').contains('I want to reach $').next()
.click({multiple:true})
.type(goalnumber)
.should('have.value', goalnumber)
})

it('Enter Year', () => {
cy.get('div').find('label').contains('By').next().next()
.clear()
.type(year)
.should('have.value', year)
})

it('Confirm Goal', () => {
cy.get('button').contains('Start Saving!').click()
cy.get('button').contains('Refresh').click().wait(4000)

})

it('Return to Dashboard  Page', () => {
cy.fixture('testDomain').as('login')

cy.get('@login').then(domain => {
cy.visit((domain.test).concat('/dashboard')) })
cy.get('button').contains('Refresh').click().wait(4000)
})


it('Return to Goals Page', () => {
cy.fixture('testDomain').as('login')

cy.get('@login').then(domain => {
cy.visit((domain.test).concat('/goals')) })
})

//Refreh
it('Refresh', () => {

cy.get('button').contains('Refresh').click()

})



it('Edit Goal', () => {
cy.contains('Goals').click()
cy.get('div').contains(goal1)
.click({multiple:true})
})

it('Change goal name', () => {
cy.get('div').find('div.css-ov1ktg main.css-ozbw39 div.css-875kku div.css-2lma4n div:nth-child(3) > button.css-1v6e5e8').click()
cy.get('button').contains('Edit Name').click({multiple: true})
.get('div').find('input').first()
.clear()
.type(goal2)

cy.contains('Finish').click()
})

it('Update Goal', () => {
cy.get('button').contains('Update Goal').click()

})

it('Update the target amount', () => {
cy.get('button').contains('Edit Target').click()
.get('div').find('input').last()
.clear()
.type(goalnumber2)
.get('button').contains('Update').click()

})

it('Update Goal', () => {
cy.get('button').contains('Update Goal').click()

})

it('Delete Goal', () => {
  cy.get('div').contains('Goals').click()
  cy.get('h2').contains(goal1).click()
  cy.get('div').find('div.css-ov1ktg main.css-ozbw39 div.css-875kku div.css-2lma4n div:nth-child(3) > button.css-1v6e5e8').click()
  cy.get('button').contains('Delete Goal').click({multiple: true})
  cy.get('div').find('div:nth-child(1) div:nth-child(1) div:nth-child(1) div.css-1y1hlfi > button.css-jm466k').click().wait(10000)
})





it('Reset to Dashboard', () => {
cy.fixture('testDomain').as('login')
cy.get('@login').then(domain => {
cy.visit((domain.test).concat('/Dashboard')) })
})

it('View all Goals', () => {
  cy.fixture('testDomain').as('login')

  cy.get('@login').then(domain => {
  cy.visit((domain.test).concat('/goals')) })
})

})



//     cy.contains('My Models').click().wait(8000)

// })

// it('Test duplicate and delete function for models', () => {
//   cy.get('div').contains('tester').prev().click()
//   cy.get('button').contains('Duplicate').click()
//   cy.get('body').focus().click()

// // delete the model and duplicate again
//   cy.get('div').contains('tester(Copy)').prev().click()
//   cy.get('button').find('Delete').click()

//   cy.get('button').contains('Delete').click()

//   cy.get('div').contains('tester').prev().click()
//   cy.get('button').contains('Duplicate').click()
//   cy.get('body').focus()


// })

// })
})
