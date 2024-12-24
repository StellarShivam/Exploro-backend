const Trip = require("../models/Trips");
const Booking = require("../models/Booking");

exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate("owner", "name email")
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      trips: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trips",
      error: error.message,
    });
  }
};

exports.getTrip = async (req, res, next) => {
  console.log("getTrip");
  const tripId = req.params.tripId;
  try {
    const trip = await Trip.findById(tripId).populate("owner", "name email");

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      trip: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trip",
      error: error.message,
    });
  }
};

exports.getMyTrips = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const trips = await Trip.find({ owner: userId }).sort({
      startDate: -1,
    });

    res.status(200).json({
      success: true,
      trips: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your trips",
      error: error.message,
    });
  }
};

exports.createTrip = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const {
      title,
      location,
      photos,
      description,
      perks,
      cancellationPolicy,
      startDate,
      endDate,
      slots,
      price,
    } = req.body;

    const newTrip = new Trip({
      owner: userId,
      title,
      location,
      photos,
      description,
      perks,
      cancellationPolicy,
      startDate,
      endDate,
      slots,
      price,
    });

    console.log(newTrip);

    const savedTrip = await newTrip.save();

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip: savedTrip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating trip",
      error: error.message,
    });
  }
};

exports.updateTrip = async (req, res, next) => {
  const tripId = req.params.tripId;
  const { userId } = req.user;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this trip",
      });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating trip",
      error: error.message,
    });
  }
};

exports.deleteTrip = async (req, res, next) => {
  const tripId = req.params.tripId;
  const { userId } = req.user;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this trip",
      });
    }

    await Booking.deleteMany({ trip: tripId });

    await Trip.findByIdAndDelete(tripId);

    res.status(200).json({
      success: true,
      message: "Trip and associated bookings deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting trip and associated bookings",
      error: error.message,
    });
  }
};
