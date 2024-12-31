import FormResponse from "../models/TypeBotResponses.model.js"; 
import mongoose from "mongoose";
 export const incrementViewCount = async (req, res) => {
    
      const { formId } = req.params;
      await FormResponse.findOneAndUpdate(
        { formId },
        { $inc: { viewCount: 1 } },
        { upsert: true }
      );
      res.status(200).json({ message: 'View count updated' });
   
  };


 export  const incrementStartCount = async (req, res) => {
    
      const { formId } = req.params;
      await FormResponse.findOneAndUpdate(
        { formId },
        { $inc: { startCount: 1 } },
        { upsert: true }
      );
      res.status(200).json({ message: 'Start count updated' });
    
  };  



  export const addFormResponse = async (req, res) => {
    try {
        const { formId, responses } = req.body;

        // Validate formId
        if (!mongoose.Types.ObjectId.isValid(formId)) {
            return res.status(400).json({ error: 'Invalid formId format' });
        }

        // Create the response entry with the formatted data
        const responseEntry = {
            date: responses.date || new Date(),
            data: responses.date.data  // This is already formatted from frontend
        };

        const result = await FormResponse.findOneAndUpdate(
            { formId },
            { $push: { responses: responseEntry } },
            { upsert: true, new: true }
        );

        res.status(200).json({ 
            message: 'Response added successfully', 
            data: result 
        });

    } catch (error) {
        console.error('Error adding form response:', error);
        res.status(500).json({ error: error.message });
    }
};