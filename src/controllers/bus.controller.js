import { Bus } from "../models/bus.models.js";
import { Route } from "../models/busroute.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { CloudinaryUpload } from "../utils/Cloudinary.js";

// Render EJS form
const renderAddBusForm = (req, res) => {
    res.render('addbus', { error: null });
};


const addBusDetails = asynchandler( async (req,res)=> {
    try {
        const {
          busName,
          busType,
          noOfBuses,
          startTime,
          endTime,
          routes,
        } = req.body;
    
        // Handle file upload for bus photo
        const busPhoto = req.files?.busPhoto[0]?.path; // Assuming multer is used and the file path is stored in `req.file.path`
    
        if (!busPhoto) {
          return res.status(400).json({ message: "Bus photo is required." });
        }
    
        // Create the bus
        const newBus = await Bus.create({
          busName,
          totalBuses: noOfBuses,
          busType,
          startingTime: startTime,
          closingTime: endTime,
          busPhoto,
        });
    
        // Parse and validate routes
        const parsedRoutes = Array.isArray(routes)
          ? routes
          : [routes]; // Ensure routes is an array
        const formattedRoutes = parsedRoutes.map((route, index) => ({
          routeName: route.routeName,
          routeLongitide: parseFloat(route.longitude),
          routeLatitude: parseFloat(route.latitude),
        }));
    
        // Create the routes and associate them with the bus
        const newRoutes = await Route.create({
          routes: formattedRoutes,
          busid: newBus._id,
        });
    
        res.status(201).json({
          message: "Bus and routes added successfully.",
          bus: newBus,
          routes: newRoutes,
        });
      } catch (error) {
        console.error("Error adding bus with routes:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    
})


const getBusRoutes = asynchandler(async(req,res)=>{
    try {
        const { firstRouteName, secondRouteName } = req.body;
    
        if (!firstRouteName || !secondRouteName) {
          return res.status(400).json({ message: "Both route names are required." });
        }
    
        // Find all routes that match the first and second route names
        const matchingRoutes = await Route.find({
          "routes.routeName": { $all: [firstRouteName, secondRouteName] },
        });
    
        if (matchingRoutes.length === 0) {
          return res.status(404).json({ message: "No buses found for the given routes." });
        }

        
    
        // Extract bus IDs from the matching routes
        const busIds = matchingRoutes.map((route) => route.busid);
    
        // Fetch the bus details for the extracted bus IDs
        const buses = await Bus.find({ _id: { $in: busIds } });
    
        if (buses.length === 0) {
          return res.status(404).json({ message: "No buses found for the given routes." });
        }
    
        res.status(200).json({
          message: "Buses found successfully.",
          buses,
          matchingRoutes
        });
      } catch (error) {
        console.error("Error finding buses by routes:", error);
        res.status(500).json({ message: "Internal server error." });
      }
})


export {renderAddBusForm,addBusDetails,getBusRoutes}