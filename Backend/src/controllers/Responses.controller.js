import FormResponse from "../models/FormResponse.model.js";

export const incrementViewCount = async (req, res) => {
 
      const { formId } = req.params;
  
      // Find the form response by formId and increment viewCount
      const updatedFormResponse = await FormResponse.findOneAndUpdate(
        { formId },
        { $inc: { viewCount: 1 } },
        { new: true } // Return the updated document
      );
  
      if (!updatedFormResponse) {
        return res.status(404).json({ message: "Form response not found" });
      }
  
      res.status(200).json({
        message: "View count incremented successfully",
        updatedFormResponse,
      });
    
  };


export  const incrementStartCount = async (req, res) => {
    
      const { formId } = req.params;
  
      // Find the form response by formId and increment startCount
      const updatedFormResponse = await FormResponse.findOneAndUpdate(
        { formId },
        { $inc: { startCount: 1 } },
        { new: true } // Return the updated document
      );
  
      if (!updatedFormResponse) {
        return res.status(404).json({ message: "Form response not found" });
      }
  
      res.status(200).json({
        message: "Start count incremented successfully",
        updatedFormResponse,
      });
   
  };  


export const addFormResponse = async (req, res) => {
    
      const { formId, responses } = req.body;
  
      // Validate input
      if (!formId || !Array.isArray(responses)) {
        return res.status(400).json({ message: "Invalid input data" });
      }
  
      // Create a new form response
      const formResponse = new FormResponse({
        formId,
        responses,
        submittedAt: new Date(),
      });
  
      await formResponse.save();
  
      res.status(201).json({
        message: "Form response added successfully",
        formResponse,
      });
    
};  
