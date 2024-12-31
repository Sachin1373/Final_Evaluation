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
    try {
      const { formId, responses } = req.body;
  
      // Validate formId and responses
      if (!formId || !mongoose.Types.ObjectId.isValid(formId)) {
        return res.status(400).json({ message: "Invalid formId" });
      }
      if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({ message: "Invalid responses format" });
      }
  
      // Prepare the response entry
      const responseEntry = { data: responses };
  
      // Update the form response by pushing the new responses
      const updatedFormResponse = await FormResponse.findOneAndUpdate(
        { formId },
        { $push: { responses: responseEntry } },
        { upsert: true, new: true }
      );
  
      // Send back the updated form response
      res.status(200).json({
        message: "Response added successfully",
        updatedFormResponse,
      });
  
    } catch (error) {
      // Handle any errors that occur during the update process
      console.error("Error adding form response:", error);
      res.status(500).json({ message: "Error adding form response" });
    }
  };
  
  