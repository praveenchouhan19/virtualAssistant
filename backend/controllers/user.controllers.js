import User from "../models/user.model.js";
import  uploadOnCloudinary  from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";


export const getCurrentUser = async (req, res) => {
  try {
    console.log("Incoming cookies:", req.cookies);
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};

//new
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");
    console.log("Updated user:", user);
    return res.status(200).json(user); // or { user } if you prefer
  } catch (error) {
    return res.status(500).json({ message: "Failed to update assistant", error });
  }
};


export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command);
    await user.save();
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command,assistantName, userName);

    const jsonMatch = result.match(/({[\s\S]*})/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I couldn't understand." });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: `Today's date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("HH:mm:ss")}`,
        });
      case "get-day":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });
      case "general":
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.status(200).json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      default:
        return res.status(400).json({ response: "I didn't understand that command." });
    } 

  }catch (error) {
    console.error("Assistant error:", error);
    res.status(500).json({ response: "ask assistant error" });
  }
}



