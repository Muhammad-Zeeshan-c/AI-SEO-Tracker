import analysisSchema from '../models/AnalysisModel.js';
import { analyzeSeoData } from '../services/geminiService.js';
import { scrapUrl } from '../services/scrapperService.js';

export const analyzeUrl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'Url is required'
            });
        }

        let validUrl;
        try {
            validUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL'
            });
        }

        // Create analysis record
        const analysis = await analysisSchema.create({
            userId: req.userid,
            url: validUrl.href,
            status: 'processing'
        });

        // Send immediate response with analysis ID
        res.json({
            success: true,
            message: 'Analysis started',
            analysisId: analysis._id
        });

        // Running scraper and analyzing in background
        try {
            const scrapeResult = await scrapUrl(validUrl.href);
            console.log(scrapeResult);

            if (!scrapeResult || !scrapeResult.success) {
                analysis.status = 'failed';
                await analysis.save();
                return;
            }

            // Analyze with Gemini
            const aiResult = await analyzeSeoData(scrapeResult.data);

            if (!aiResult || !aiResult.success) {
                analysis.status = 'failed';
                await analysis.save();
                return;
            }

            // Save result
            analysis.overallScore = aiResult.data?.overallScore || 0;
            analysis.categories = aiResult.data?.categories || {};
            analysis.metaData = scrapeResult.data?.metaData || {};
            analysis.headings = scrapeResult.data?.headings || {};
            analysis.links = scrapeResult.data?.links || {};
            analysis.images = scrapeResult.data?.images || {};
            analysis.keywords = aiResult.data?.keywords || [];
            analysis.issues = aiResult.data?.issues || [];
            analysis.loadTime = scrapeResult.data?.loadTime || 0;
            analysis.pageSize = scrapeResult.data?.pageSize || 0;
            analysis.wordCount = scrapeResult.data?.wordCount || 0;
            analysis.status = "completed";

            await analysis.save();

        } catch (bgErr) {
            console.error('Background analysis error ', bgErr);
            try {
                analysis.status = 'failed';
                await analysis.save();
            } catch (saveErr) {
                console.log('Failed to save status', saveErr);
            }
        }
    } catch (err) {
        console.error('Analyze Url error ', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get analysis by id
export const getAnalysis = async (req, res) => {
    try {
        const analysis = await analysisSchema.findOne({
            _id: req.params.id,
            userId: req.userid
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            analysis
        });
    } catch (err) {
        console.error('Get analysis error ', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all analysis for user
export const getAnalyses = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const analyses = await analysisSchema
            .find({ userId: req.userid })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-issues -keywords');

        const total = await analysisSchema.countDocuments({ userId: req.userid });

        res.json({
            success: true,
            analyses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Get analyses error ', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete analysis by id
export const deleteAnalysis = async (req, res) => {
    try {
        const deletedDoc = await analysisSchema.findOneAndDelete({
            _id: req.params.id,
            userId: req.userid
        });

        if (!deletedDoc) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            message: 'Analysis deleted'
        });
    } catch (err) {
        console.error('Delete analysis error ', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};