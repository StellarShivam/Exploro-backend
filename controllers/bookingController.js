const Trip = require("../models/Trips");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");

exports.createBooking = async (req, res) => {
  const { userId } = req.user;
  try {
    const { trip, bookingDate, numberOfPeople, name, phone, totalPrice } =
      req.body;

    const tripExists = await Trip.findById(trip);
    if (!tripExists) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (tripExists.slots < numberOfPeople) {
      return res.status(400).json({
        success: false,
        message: "Not enough slots available for this booking",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedTrip = await Trip.findByIdAndUpdate(
        trip,
        { $inc: { slots: -numberOfPeople } },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      const booking = await Booking.create(
        [
          {
            trip,
            user: userId,
            bookingDate,
            noOfPeople: numberOfPeople,
            name,
            phone,
            totalPrice,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      await booking[0].populate("trip");

      res.status(201).json({
        success: true,
        data: booking[0],
        remainingSlots: updatedTrip.slots,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyBookings = async (req, res) => {
  const { userId } = req.user;
  try {
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "trip",
        select:
          "title location photos description perks cancellationPolicy startDate endDate slots price",
      })
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTripBookings = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const bookings = await Booking.find({ trip: tripId })
      .populate({
        path: "trip",
        select:
          "title location photos description perks cancellationPolicy startDate endDate slots price",
      })
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBooking = async (req, res) => {
  const { userId } = req.user;
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format",
      });
    }

    const booking = await Booking.findById(bookingId).populate({
      path: "trip",
      select:
        "title location photos description perks cancellationPolicy startDate endDate slots price",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
