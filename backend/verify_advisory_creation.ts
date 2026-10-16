import axios from 'axios';

async function main() {
  try {
    const userEmail = 'newfarmer@wb.gov.in';
    console.log(`Creating advisory for ${userEmail}...`);
    
    // Simulate frontend call
    const res = await axios.post('http://localhost:5000/api/advisories', {
      cropId: 1, // Potato
      location: 'Hooghly',
      stage: 'Preparation',
      status: 'active',
      message: 'Initial soil preparation for Potato.',
      userEmail: userEmail
    });
    
    console.log('Creation Response:', res.status, res.data.id);

    // Verify fetching it back
    console.log('Fetching history...');
    const listRes = await axios.get(`http://localhost:5000/api/advisories?userEmail=${userEmail}`);
    
    const found = listRes.data.find((a: any) => a.id === res.data.id);
    if (found) {
        console.log('✅ SUCCESS: Created advisory found in user history.');
    } else {
        console.error('❌ FAILURE: Created advisory NOT found in user history.');
    }

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

main();
