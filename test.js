// Simple test suite for pricing calculations
function testPricing() {
    const pricing = {
        basic: 10,
        premium: 15,
        executive: 20,
        team: 25
    };

    // Test individual pricing
    console.assert(calculateTotal(2, 'basic') === 20, 'Basic membership 2 hours should be $20');
    console.assert(calculateTotal(3, 'premium') === 45, 'Premium membership 3 hours should be $45');
    
    // Test team pricing
    console.assert(calculateTotal(2, null, true) === 50, 'Team desk 2 hours should be $50');
    
    // Test discount
    console.assert(calculateTotal(4, 'executive') === 72, 'Executive membership 4 hours should be $72 after discount');
    console.assert(calculateTotal(5, null, true) === 112.5, 'Team desk 5 hours should be $112.5 after discount');

    console.log('All tests passed!');
}

function calculateTotal(hours, membership, isTeam = false) {
    let pricePerHour;
    if (isTeam) {
        pricePerHour = 25;
    } else {
        pricePerHour = membership === 'basic' ? 10 : 
                       membership === 'premium' ? 15 : 20;
    }
    
    let total = pricePerHour * hours;
    if (hours > 3) {
        total *= 0.9;
    }
    
    return total;
}

testPricing();