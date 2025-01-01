import FormResponse from "../models/TypeBotResponse.modal.js";



export  const incrementViews = async (req, res) => {
    const { formId } = req.params;
    
      const form = await FormResponse.findByIdAndUpdate(formId, { $inc: { views: 1 } }, { new: true,  upsert: true, setDefaultsOnInsert: true });
      if (!form) return res.status(404).json({ message: "Form not found" });
      res.status(200).json({ message: "Views incremented", views: form.views });
   
  };

  export const incrementStarts = async (req, res) => {
    const { formId } = req.params;
    
      const form = await FormResponse.findByIdAndUpdate(formId, { $inc: { starts: 1 } }, { new: true,  upsert: true, setDefaultsOnInsert: true });
      if (!form) return res.status(404).json({ message: "Form not found" });
      res.status(200).json({ message: "Starts incremented", starts: form.starts });
    
  };

 export const saveSubmission = async (req, res) => {
    const { formId } = req.params;
    const { responses } = req.body;
  
    try {
      const form = await FormResponse.findById(formId);
      if (!form) return res.status(404).json({ message: "Form not found" });
      form.formId = formId; // Set the form ID
      form.submissions.push({ responses }); // Add new submission
      await form.save(); // Save form with new submission
  
      res.status(200).json({ message: "Submission saved successfully", form });
    } catch (error) {
      res.status(500).json({ message: "Error saving submission", error: error.message });
    }
  };

  export const getviews = async (req, res) => {
    const { formId } = req.params;
    
      const form = await FormResponse
        .findById(formId)
        .select("views")
        .exec();
      if (!form) return res.status(404).json({ message: "Form not found" });
      res.status(200).json({ views: form.views });


  };

  export const getstarts = async (req, res) => {
    const { formId } = req.params;
    
      const form = await FormResponse
        .findById(formId)
        .select("starts")
        .exec();
      if (!form) return res.status(404).json({ message: "Form not found" });
      res.status(200).json({ starts: form.starts });
    
  };
  
  
  