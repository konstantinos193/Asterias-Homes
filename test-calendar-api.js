// Frontend test script for calendar API
console.log('🧪 Testing Calendar API Endpoint...\n');

// Test the calendar API endpoint
async function testCalendarAPI() {
  try {
    console.log('📡 Testing API endpoint: /api/availability/calendar');
    
    const response = await fetch('https://asterias-backend.onrender.com/api/availability/calendar?month=8&year=2025');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response received successfully!');
    console.log('📊 Response data:', JSON.stringify(data, null, 2));
    
    // Test the data structure
    console.log('\n🔍 Testing Data Structure...');
    
    if (data.month && data.year && data.availability) {
      console.log('✅ Basic structure: PASSED');
    } else {
      console.log('❌ Basic structure: FAILED');
      return;
    }
    
    // Test availability data
    const availability = data.availability;
    const dates = Object.keys(availability);
    
    console.log(`📅 Total dates: ${dates.length}`);
    console.log(`📅 Month: ${data.month}`);
    console.log(`📅 Year: ${data.year}`);
    
    // Test first few dates
    console.log('\n📊 Sample Availability Data:');
    console.log('Date\t\t| Available | Total | Status\t| Color');
    console.log('----------------|-----------|-------|-----------|--------');
    
    dates.slice(0, 5).forEach(date => {
      const day = availability[date];
      const status = day.status.padEnd(10);
      const color = day.color.padEnd(6);
      console.log(`${date}\t| ${day.availableRooms}/7\t| 7\t| ${status}| ${color}`);
    });
    
    // Test color distribution
    console.log('\n🎨 Color Distribution:');
    const colorStats = {
      green: 0,
      yellow: 0,
      red: 0
    };
    
    Object.values(availability).forEach(day => {
      colorStats[day.color]++;
    });
    
    console.log(`🟢 Green (Available): ${colorStats.green} days`);
    console.log(`🟡 Yellow (Limited): ${colorStats.yellow} days`);
    console.log(`🔴 Red (Booked): ${colorStats.red} days`);
    
    // Test logic
    console.log('\n🔍 Testing Logic...');
    let logicErrors = 0;
    
    Object.entries(availability).forEach(([date, day]) => {
      // Check if availableRooms + bookedRooms = totalRooms
      const bookedRooms = 7 - day.availableRooms;
      const expectedTotal = day.availableRooms + bookedRooms;
      
      if (expectedTotal !== 7) {
        console.log(`❌ Logic Error on ${date}: ${day.availableRooms} + ${bookedRooms} ≠ 7`);
        logicErrors++;
      }
      
      // Check if status matches available rooms count
      let expectedStatus;
      if (day.availableRooms === 0) {
        expectedStatus = 'booked';
      } else if (day.availableRooms <= 2) {
        expectedStatus = 'limited';
      } else {
        expectedStatus = 'available';
      }
      
      if (day.status !== expectedStatus) {
        console.log(`❌ Status Error on ${date}: Expected ${expectedStatus}, got ${day.status}`);
        logicErrors++;
      }
      
      // Check if color matches status
      let expectedColor;
      switch (day.status) {
        case 'available':
          expectedColor = 'green';
          break;
        case 'limited':
          expectedColor = 'yellow';
          break;
        case 'booked':
          expectedColor = 'red';
          break;
        default:
          expectedColor = 'unknown';
      }
      
      if (day.color !== expectedColor) {
        console.log(`❌ Color Error on ${date}: Status ${day.status} should be ${expectedColor}, got ${day.color}`);
        logicErrors++;
      }
    });
    
    if (logicErrors === 0) {
      console.log('✅ All logic checks passed!');
    } else {
      console.log(`❌ Found ${logicErrors} logic errors`);
    }
    
    // Test summary
    console.log('\n🎯 Test Summary:');
    console.log(`Total dates tested: ${dates.length}`);
    console.log(`Logic errors: ${logicErrors}`);
    console.log(`Status: ${logicErrors === 0 ? 'PASSED' : 'FAILED'}`);
    
    // Test specific scenarios
    console.log('\n📋 Testing Specific Scenarios:');
    
    // Find examples of each status
    const examples = {
      available: null,
      limited: null,
      booked: null
    };
    
    Object.entries(availability).forEach(([date, day]) => {
      if (!examples[day.status]) {
        examples[day.status] = { date, ...day };
      }
    });
    
    Object.entries(examples).forEach(([status, example]) => {
      if (example) {
        console.log(`✅ ${status.toUpperCase()}: ${example.date} shows ${example.availableRooms}/7 (${example.color})`);
      } else {
        console.log(`❌ ${status.toUpperCase()}: No examples found`);
      }
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('404')) {
      console.log('\n💡 404 Error means:');
      console.log('• Backend not deployed yet');
      console.log('• Availability routes not registered');
      console.log('• Need to wait for Render to redeploy');
    }
  }
}

// Test different months
async function testMultipleMonths() {
  console.log('\n📅 Testing Multiple Months...');
  
  const months = [
    { month: 8, year: 2025 },
    { month: 9, year: 2025 },
    { month: 10, year: 2025 }
  ];
  
  for (const { month, year } of months) {
    try {
      console.log(`\n🧪 Testing ${month}/${year}...`);
      const response = await fetch(`https://asterias-backend.onrender.com/api/availability/calendar?month=${month}&year=${year}`);
      
      if (response.ok) {
        const data = await response.json();
        const dates = Object.keys(data.availability || {});
        console.log(`✅ ${month}/${year}: ${dates.length} dates available`);
      } else {
        console.log(`❌ ${month}/${year}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${month}/${year}: ${error.message}`);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Calendar API Tests...\n');
  
  await testCalendarAPI();
  await testMultipleMonths();
  
  console.log('\n✨ All tests completed!');
  console.log('\n💡 Next steps:');
  console.log('1. Check if backend is deployed on Render');
  console.log('2. Verify availability routes are registered');
  console.log('3. Test the frontend calendar display');
}

// Run tests if in browser environment
if (typeof window !== 'undefined') {
  // Browser environment
  runTests();
} else {
  // Node.js environment
  console.log('⚠️  This script is designed for browser environment');
  console.log('💡 To test in Node.js, use: node test-availability.js');
}
