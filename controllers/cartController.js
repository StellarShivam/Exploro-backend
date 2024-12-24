const CartItem = require("../models/cartModel");
const Trip = require("../models/Trips");

exports.addToCart = async (req, res) => {
  const { userId } = req.user;
  try {
    const { tripId, noOfPeople } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const existingCartItem = await CartItem.findOne({
      trip: tripId,
      user: userId,
    });
    if (existingCartItem) {
      existingCartItem.noOfPeople = noOfPeople;
      await existingCartItem.save();
      return res.status(200).json(existingCartItem);
    }

    const cartItem = new CartItem({
      trip: tripId,
      user: userId,
      noOfPeople,
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding item to cart", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.user;
  try {
    const cartItems = await CartItem.find({ user: userId })
      .populate("trip")
      .exec();

    res.status(200).json(cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId } = req.user;
  try {
    const { itemId } = req.params;

    const result = await CartItem.findOneAndDelete({
      _id: itemId,
      user: userId,
    });

    if (!result) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({
      message: "Error removing item from cart",
      error: error.message,
    });
  }
};
