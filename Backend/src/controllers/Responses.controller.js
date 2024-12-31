import FormResponse from "../models/TypeBotResponses.model.js"; 

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
    
      const { formId, responses } = req.body;
  
      if (!formId || !Array.isArray(responses)) {
        return res.status(400).json({ message: "Invalid input data" });
      }
  
      // Structure the response to match the schema
      const responseEntry = {
        data: responses, // Attach the array of responses here
      };
  
      const updatedFormResponse = await FormResponse.findOneAndUpdate(
        { formId },
        { $push: { responses: responseEntry } }, // Push the structured response
        { upsert: true, new: true } // Create the document if it doesn't exist
      );
  
      res.status(200).json({
        message: "Response added successfully",
        updatedFormResponse,
      });
   
  };
  