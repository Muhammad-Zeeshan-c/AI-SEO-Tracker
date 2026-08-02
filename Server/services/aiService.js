import 'dotenv/config';

export async function analyzeSeoData(scrapedData) {
    try {
        const prompt = `You are an expert SEO analyst. Analyze the following website data and provide a comprehensive SEO audit.
        
        Website URL: ${scrapedData.url}
        Load Time: ${scrapedData.loadTime}ms
        Status Code: ${scrapedData.statusCode}
        Page Size: ${Math.round(scrapedData.pageSize / 1024)}KB
        Word Count: ${scrapedData.wordCount}
        
        META DATA:
        - Title: "${scrapedData.metaData?.title || ''}"
        - Description: "${scrapedData.metaData?.description || ''}"
        - Canonical: "${scrapedData.metaData?.canonical || ''}"
        
        HEADINGS:
        - H1: ${scrapedData.headings?.h1 || 0}
        - H2: ${scrapedData.headings?.h2 || 0}
        - H3: ${scrapedData.headings?.h3 || 0}
        
        LINKS:
        - Internal: ${scrapedData.links?.internal || 0}
        - External: ${scrapedData.links?.external || 0}
        - Total: ${scrapedData.links?.total || 0}
        
        IMAGES:
        - Total: ${scrapedData.images?.total || 0}
        - Missing Alt Text: ${scrapedData.images?.missingAlt || 0}
        - With Alt Text: ${scrapedData.images?.withAlt || 0}
        
        PAGE CONTENT (first 3000 chars):
        ${scrapedData.bodyText ? scrapedData.bodyText.substring(0, 3000) : ''}
        
        Scoring guidelines:
        - Title: 50-60 chars optimal, must exist
        - Description: 150-160 chars optimal, must exist
        - H1: exactly 1 is ideal
        - Images: all should have alt text
        - Load time: <3s good, <5s ok, >5s poor
        - Page size: <3MB good
        
        You must return a valid JSON object matching exactly this structure:
        {
            "overallScore": number (0-100),
            "categories": {
                "seo": number (0-100),
                "performance": number (0-100),
                "accessibility": number (0-100),
                "bestPractices": number (0-100)
            },
            "keywords": [
                {
                    "word": "string",
                    "count": number,
                    "density": number
                }
            ],
            "issues": [
                {
                    "severity": "critical" | "warning" | "info",
                    "category": "string",
                    "message": "string",
                    "recommendation": "string"
                }
            ]
        }
        
        Severity levels must be exactly one of: "critical", "warning", or "info".
        Provide 5-15 issues sorted by severity (critical first). Extract top 10 keywords by frequency from the page content.`;



        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                messages: [
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        const analysis = JSON.parse(data.choices[0].message.content);

        return { success: true, data: analysis };

    } catch (err) {
        console.error('AI analysis error:', err);
        return { success: false, error: err.message };
    }
}