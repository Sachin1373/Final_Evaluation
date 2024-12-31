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


export  const addFormResponse = async (req, res) => {
    
      const { formId, responses } = req.body;
      await FormResponse.findOneAndUpdate(
        { formId },
        { $push: { responses: { data: responses } } },
        // { upsert: true }
      );
      res.status(200).json({ message: 'Response added successfully' });
    
  }; 
