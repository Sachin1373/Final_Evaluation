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
      
      // Process the responses to ensure all data is in string format
      const processedResponses = responses.map(item => ({
        ...item,
        data: String(item.data)
      }));
  
      const responseEntry = {
        date: new Date(),
        data: processedResponses,
      };
      
      await FormResponse.findOneAndUpdate(
        { formId },
        { $push: { responses: responseEntry } },
        { upsert: true }
      );
      
      res.status(200).json({ message: 'Response added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  