const axios = require('axios');

const analyzeGitHubProfile = async (username) => {
  try {
    // 1. Fetch data from GitHub
    console.log(`Fetching GitHub data for ${username}...`);
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
    ]);

    const userData = userRes.data;
    const reposData = reposRes.data.map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at
    }));

    // 2. Direct Call to Gemini API (Using the verified available model)
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const prompt = `
      You are a professional Tech Recruiter. Analyze this GitHub profile for "Recruiter Readiness".
      User: ${userData.name || userData.login}
      Bio: ${userData.bio || 'No bio provided'}
      Public Repos: ${userData.public_repos}
      Followers: ${userData.followers}
      Recent Repositories: ${JSON.stringify(reposData)}

      Return ONLY a JSON object with this exact structure:
      {
        "score": number,
        "grade": "A+" | "A" | "B" | "C",
        "firstImpression": "A short recruiter-style summary",
        "highlights": [
          { "name": "Strength Name", "reason": "Why it is a strength" }
        ],
        "actionItems": ["Tip 1", "Tip 2", "Tip 3"]
      }
    `;

    console.log(`Calling Gemini API directly for user: ${username}...`);
    
    const geminiRes = await axios.post(GEMINI_URL, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    if (!geminiRes.data.candidates || !geminiRes.data.candidates[0]) {
      throw new Error('No response from Gemini AI');
    }

    let text = geminiRes.data.candidates[0].content.parts[0].text;
    console.log('Gemini raw response received.');
    
    // Clean JSON if needed
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('GitHub Analysis Error Detail:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error('GitHub profile not found. Please check the username.');
    }
    if (error.response?.status === 400) {
      throw new Error('AI request failed. The API key might be invalid or not enabled yet.');
    }
    throw new Error('AI analysis failed. Please check your Gemini API key activation.');
  }
};

module.exports = { analyzeGitHubProfile };
