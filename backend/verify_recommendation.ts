import axios from 'axios';

async function main() {
  try {
    const district = 'Darjeeling';
    console.log(`Checking recommendations for ${district}...`);
    // Assuming the backend is running on 5000
    const res = await axios.get(`http://localhost:5000/api/crops?district=${district}`);
    
    console.log(`Found ${res.data.length} crops.`);
    res.data.forEach((c: any) => {
      console.log(`- ${c.name}: ${c.reason} (Score: ${c.suitabilityScore})`);
    });

    if (res.data.some((c: any) => c.name === 'Tea')) {
      console.log('✅ SUCCESS: Tea found for Darjeeling.');
    } else {
      console.error('❌ FAILURE: Tea not found for Darjeeling.');
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

main();
