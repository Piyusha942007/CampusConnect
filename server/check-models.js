const axios = require('axios');
require('dotenv').config();

async function listAllModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log("Checking API Key:", apiKey.substring(0, 10) + "...");
  
  try {
    const response = await axios.get(url);
    console.log("\n✅ SUCCESS! Your key is working.");
    console.log("Here are the models you can use:");
    
    const models = response.data.models;
    models.forEach(m => {
      console.log(`- ${m.name.split('/').pop()} (${m.displayName})`);
    });
    
    console.log("\nCopy one of the names above (like 'gemini-1.5-flash') and let me know!");
  } catch (error) {
    console.error("\n❌ ERROR FETCHING MODELS:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.error.message}`);
    } else {
      console.error(error.message);
    }
  }
}

listAllModels();
