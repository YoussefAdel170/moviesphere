import express from 'express';
const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('❌ Missing GROQ_API_KEY in .env file');
}

// --------------------
// SIMPLE IN-MEMORY CACHE (TMDB STYLE SIMULATION)
// --------------------
const cache = new Map();

// --------------------
// PAGINATION FUNCTION
// --------------------
function paginate(allItems, page, limit) {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    total_results: allItems.length,
    total_pages: Math.ceil(allItems.length / limitNum),
    results: allItems.slice(start, end)
  };
}

// --------------------
// ROUTE
// --------------------
router.post('/ai-recommend', async (req, res) => {
  const { title, year, page = 1, limit = 10 } = req.body;

  // 1. Validate input
  if (!title || !year) {
    return res.status(400).json({ error: 'Missing title or year' });
  }

  // 2. Check API key
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  const cacheKey = `${title}-${year}`;

  try {
    let allMovies;

    // --------------------
    // 3. CACHE CHECK (TMDB STYLE)
    // --------------------
    if (cache.has(cacheKey)) {
      allMovies = cache.get(cacheKey);
    } else {
      // --------------------
      // 4. AI CALL
      // --------------------
      const messages = [
        {
          role: "system",
          content: "You are a strict JSON API. Only return valid JSON arrays with 'title' and 'year'. No extra text."
        },
        {
          role: "user",
          content: `Based on "${title}" (${year}), suggest up to 30 real similar movies.

Rules:
- Only real released movies
- No upcoming or fake movies
- No extra fields
- Return ONLY JSON array

Format:
[
  {"title": "Movie Name", "year": 2000}
]`
        }
      ];

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages,
            temperature: 0.3,
            max_tokens: 1200
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Groq error:', data);
        return res.status(response.status).json({
          error: data.error?.message || 'Groq API failed'
        });
      }

      const aiText = data?.choices?.[0]?.message?.content || '';

      // --------------------
      // 5. SAFE JSON EXTRACTION
      // --------------------
      const match = aiText.match(/\[\s*\{[\s\S]*?\}\s*\]/);

      if (!match) {
        return res.json({ results: [] });
      }

      let parsed;

      try {
        parsed = JSON.parse(match[0]);
      } catch (err) {
        console.error('❌ JSON parse error:', err);
        return res.json({ results: [] });
      }

      // --------------------
      // 6. CLEAN + VALIDATE + REMOVE DUPLICATES
      // --------------------
      const seen = new Set();

      allMovies = parsed
        .filter(movie =>
          movie &&
          typeof movie.title === 'string' &&
          movie.title.trim() !== '' &&
          !isNaN(movie.year)
        )
        .map(movie => ({
          title: movie.title.trim(),
          year: Number(movie.year)
        }))
        .filter(movie => {
          const key = movie.title.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      // --------------------
      // 7. STORE IN CACHE
      // --------------------
      cache.set(cacheKey, allMovies);
    }

    // --------------------
    // 8. RETURN PAGINATED RESULT (TMDB STYLE)
    // --------------------
    const responseData = paginate(allMovies, page, limit);

    return res.json(responseData);

  } catch (error) {
    console.error('❌ AI route error:', error);
    return res.status(500).json({
      error: 'Failed to get recommendations'
    });
  }
});

export default router;